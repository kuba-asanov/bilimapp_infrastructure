/* External dependencies */
const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

/* Local dependencies */
// import ddbClient, { ARTICLES_TABLE_NAME } from '../clients/db';
import { ResourceNotFoundException } from './exceptions/common';
import { Article, GetArticleInput } from './article';

export default async function getArticle({
  id,
}: GetArticleInput): Promise<Article | null> {
  const params = {
    TableName: process.env.ARTICLE_TABLE,
    Key: {
      id,
    },
  };

  const { Item } = await docClient.get(params).promise();

  if (Item) {
    return Item as Article;
  }

  throw new Error(
    'No resource exists with this identifier.'
  ) as ResourceNotFoundException;
}
