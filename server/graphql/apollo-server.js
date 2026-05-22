import { ApolloServer } from '@apollo/server';
import _ from 'lodash';
import checkAuthorization from '../operator/checkAuthorization';

/**
 * Creates an Apollo server
 */
const createApolloServer = (schema, resolvers) =>
  new ApolloServer({
    typeDefs: schema,
    resolvers,
  });

export const createContext = (models) => async ({ req }) => {
  const result = { ...models };
  if (req) {
    const authUser = await checkAuthorization(req);
    if (authUser) {
      req.authUser = authUser;
      _.assign(result, { authUser });
    }
  }
  return result;
};

export default createApolloServer;
