import createArticle from './createArticle';
import deleteArticle from './deleteArticle';
import getArticle from './getArticle';
import listArticles from './listArticlesFromDDB';

export type AppSyncEvent = {
  info: {
    fieldName: string;
  };
  arguments: any;
  identity: {
    username: string;
    claims: {
      [key: string]: string[];
    };
  };
};

exports.handler = async (event: AppSyncEvent) => {
  const params = event.arguments.input;

  console.log(event);

  switch (event.info.fieldName) {
    case 'getArticle':
      return await getArticle(params);
    case 'listArticles':
      return await listArticles(params);
    case 'createArticle':
      return await createArticle(params);
    case 'deleteArticle':
        return await deleteArticle(params);
    // case 'articlesByCategory':
    //   return await listArticles(params);
    // case 'updateArticle':
    //   return await listArticles(params);
    default:
      throw new Error('Unsupported action.');
  }
};
