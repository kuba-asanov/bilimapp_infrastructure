/* External dependencies */
const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

/* Local dependencies */
// import ddbClient, { ARTICLES_TABLE_NAME } from '../clients/db';
import { ResourceNotFoundException } from './exceptions/common';
import { DeleteArticleInput } from './article';

export default async function deleteArticle({
  id,
}: DeleteArticleInput): Promise<string | null> {
  const params = {
    TableName: process.env.ARTICLE_TABLE,
    Key: {
      id,
    },
  };

  try {
    await docClient.delete(params).promise();
    return id;
  } catch (error) {
    console.log('DDB error: ', error);
    throw new Error(
      'No resource exists with this identifier.'
    ) as ResourceNotFoundException;
  }
}
