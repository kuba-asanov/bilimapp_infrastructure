import { Article } from './article';
import { CreateArticleInput } from './article';

const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
const { v4: uuid } = require('uuid');

export default async function createArticle({
  article,
}: CreateArticleInput) {
  if (!article.id) {
    article.id = uuid();
  }

  const params = {
    TableName: process.env.ARTICLE_TABLE,
    Item: article,
  };

  try {
    await docClient.put(params).promise();
    return article;
  } catch (err) {
    console.log('DynamoDB error: ', err);
    return null;
  }
}
