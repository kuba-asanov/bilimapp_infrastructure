/* External dependencies */
const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

/* Local dependencies */
import { Articles, ListArticlesInput } from './article';

interface ListArticlesResponse {
  total: number;
  articles: Articles;
}

export default async function listArticles({
  query = '',
  from = 0,
  size = 20,
}: ListArticlesInput): Promise<ListArticlesResponse> {

  const params = {
    TableName: process.env.ARTICLE_TABLE,
    Limit: size,
    ProjectionExpression:
      'articleType, author, category, contents, createDate, heroMedia, id, description, title',
  };

  /// Code for searching by title, category, contents from DB
//   if (query) {
//     params.FilterExpression =
//       'contains(title, :query) OR contains(category, :query)' +
//       ' OR contains(contents, :query)' +
//       ' OR contains(synopsis, :query)';
//     params.ExpressionAttributeValues = {
//       ':query': query,
//     };
//   }

  const { Items } = await docClient.scan(params).promise();

  const itemsCount = Items?.length || 0;
  const items = from < itemsCount ? Items!.slice(from, from + size) : [];

  return {
    total: Items?.length || 0,
    articles: items as Articles,
  };
}
