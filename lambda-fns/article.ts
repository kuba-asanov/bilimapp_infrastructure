export type Article = {
  articleType: string;
  author: string;
  category: string;
  contents: [Content];
  createDate: number;
  heroMedia?: MediaFile;
  id: ID;
  synopsis: string;
  title: string;
};

interface Content {
  type: ContentType;
  data: string;
}

export enum ContentType {
  IMAGE = 'IMAGE',
  MARKDOWN = 'MARKDOWN',
  YOUTUBE = 'YOUTUBE',
}

interface MediaFile {
  imageUrl: string;
  fullVideoUrl: string;
}

type ID = string;

export type Articles = Article[];

type ArticlesTableKey = {
  id: ID;
};

/* CRUD operations */
export type CreateArticleParams = {
  TableName: string;
  Item: Article;
};

export type UpdateArticleParams = {
  TableName: string;
  Key: ArticlesTableKey;
  ExpressionAttributeValues: any;
  ExpressionAttributeNames: any;
  UpdateExpression: string;
  ReturnValues: string;
};

export interface ListArticlesInput {
  from?: number;
  query?: string;
  size?: number;
}

export interface CreateArticleInput {
  article: Article;
}

export interface GetArticleInput {
  id: string;
}

export interface DeleteArticleInput {
  id: string;
}
