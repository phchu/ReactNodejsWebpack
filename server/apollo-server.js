import { ApolloServer } from 'apollo-server-express';
import _ from 'lodash';
import jwt from 'jsonwebtoken';

const BEARER = 'Bearer ';
/**
 * Checks if client is authenticated by checking authorization key from req headers
 *
 * @param {obj} req
 */
const checkAuthorization = async (req) => {
  let token = _.get(req.headers, 'authorization');
  // Remove Bearer from string
  token = _.replace(token, BEARER, '');
  let result;
  if (token) {
    try {
      const authUser = jwt.verify(token, process.env.TOKEN_SECRET);
      result = authUser;
    } catch (err) {
      console.error('checkAuthorization: ', err);
    }
  }
  return result;
};

/**
 * Creates an Apollo server and identifies if user is authenticated or not
 *
 * @param {obj} schema GraphQL Schema
 * @param {array} resolvers GraphQL Resolvers
 * @param {obj} models Mongoose Models
 */
const createApolloServer = (schema, resolvers, models) => new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: async ({ req }) => {
    const result = { ...models };
    if (req) {
      const authUser = await checkAuthorization(req);
      if (authUser) {
        req.authUser = authUser;
        _.assign(result, { authUser });
      }
    }
    return result;
  },
});

export default createApolloServer;
