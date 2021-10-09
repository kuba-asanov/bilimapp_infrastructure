import * as cdk from '@aws-cdk/core';
import * as cognito from '@aws-cdk/aws-cognito';
import * as appsync from '@aws-cdk/aws-appsync';
import * as ddb from '@aws-cdk/aws-dynamodb';
import * as lambda from '@aws-cdk/aws-lambda';

export class CdkBilimStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const userPool = new cognito.UserPool(this, 'cdk-bilim-user-pool', {
      selfSignUpEnabled: true,
      accountRecovery: cognito.AccountRecovery.PHONE_AND_EMAIL,
      userVerification: {
        emailStyle: cognito.VerificationEmailStyle.CODE,
      },
      autoVerify: {
        email: true,
      },
      standardAttributes: {
        email: {
          required: true,
          mutable: true,
        },
      },
    });

    const userPoolClient = new cognito.UserPoolClient(this, 'UserPoolClient', {
      userPool,
    });

    const api = new appsync.GraphqlApi(this, 'cdk-bilim-app', {
      name: 'cdk-bilim-api',
      logConfig: {
        fieldLogLevel: appsync.FieldLogLevel.ALL,
      },
      schema: appsync.Schema.fromAsset('./graphql/schema.graphql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: cdk.Expiration.after(cdk.Duration.days(365)),
          },
        },
        additionalAuthorizationModes: [
          {
            authorizationType: appsync.AuthorizationType.USER_POOL,
            userPoolConfig: {
              userPool,
            },
          },
        ],
      },
    });

    const articleLambda = new lambda.Function(this, 'AppSyncArticleHandler', {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'main.handler',
      code: lambda.Code.fromAsset('lambda-fns'),
      memorySize: 1024,
    });

    const lambdaDs = api.addLambdaDataSource('lambdaDataSource', articleLambda);

    lambdaDs.createResolver({
      typeName: 'Query',
      fieldName: 'getArticle',
    });

    lambdaDs.createResolver({
      typeName: 'Query',
      fieldName: 'listArticles',
    });

    lambdaDs.createResolver({
      typeName: 'Query',
      fieldName: 'articlesByCategory',
    });

    lambdaDs.createResolver({
      typeName: 'Mutation',
      fieldName: 'createArticle',
    });

    lambdaDs.createResolver({
      typeName: 'Mutation',
      fieldName: 'updateArticle',
    });

    lambdaDs.createResolver({
      typeName: 'Mutation',
      fieldName: 'deleteArticle',
    });

    const articleTable = new ddb.Table(this, 'CDKArticleTable', {
      billingMode: ddb.BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'id',
        type: ddb.AttributeType.STRING,
      },
    });

    articleTable.addGlobalSecondaryIndex({
      indexName: 'articlesByCategory',
      partitionKey: {
        name: 'category',
        type: ddb.AttributeType.STRING,
      },
    });

    articleTable.grantFullAccess(articleLambda);

    articleLambda.addEnvironment('ARTICLE_TABLE', articleTable.tableName);

    new cdk.CfnOutput(this, 'GraphQLAPIURL', {
      value: api.graphqlUrl,
    });

    new cdk.CfnOutput(this, 'AppSyncApiKey', {
      value: api.apiKey || '',
    });

    new cdk.CfnOutput(this, 'ProjectRegion', {
      value: this.region,
    });

    new cdk.CfnOutput(this, 'UserPoolId', {
      value: userPool.userPoolId,
    });

    new cdk.CfnOutput(this, 'UserPoolClientId', {
      value: userPoolClient.userPoolClientId,
    });
  }
}
