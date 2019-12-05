import { ApolloServer } from 'apollo-server-express';
import _ from 'lodash';
import checkAuthorization from '../operator/checkAuthorization';

/**
 * Creates an Apollo server and identifies if user is authenticated or not
 *
 * @param {obj} schema GraphQL Schema
 * @param {array} resolvers GraphQL Resolvers
 * @param {obj} models Mongoose Models
 */
const createApolloServer = (schema, resolvers, models) =>
  new ApolloServer({
    typeDefs: schema,
    resolvers,
    context: async ({ req }) => {
      const result = { ...models };
      if (req) {
        const authUser = await checkAuthorization(req);
        console.log('authUser: ', authUser);
        if (authUser) {
          req.authUser = authUser;
          _.assign(result, { authUser });
        }
      }
      return result;
    }
  });

export default createApolloServer;
