import express from 'express';
import { makeExecutableSchema } from 'graphql-tools';
import * as gqlBuilder from 'gql-query-builder';
import typeDefs from '../graphql/schema';
import resolvers from '../graphql/resolvers';
import gql from '../operator/gql';
import { wrapResult, restResult } from '../operator/utils';

const app = express.Router();
const [userResolver] = resolvers;
const schema = makeExecutableSchema({ typeDefs, resolvers: userResolver });

/**
 * @swagger
 * /api/user:
 *   get:
 *     tags: [User]
 *     name: getUserInfo
 *     summary: Get user's information
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - $ref: '#/parameters/requiredUser'
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/schemas/res/userInfo'
 *       '400':
 *         description: Unknown user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/schemas/res/unknownUser'
 */
app.get('/', async (req, res) => {
  const operation = 'getUser';
  const query = gqlBuilder.query({
    operation,
    variables: { name: { value: req.query.name, required: true } },
    fields: ['_id', 'name', 'email', 'createdAt', 'updatedAt']
  });
  const result = await gql(schema, operation, query);
  const { err, data } = result;
  if (!err && !data) {
    res.status(400).json(wrapResult(new Error('Unknown user.')));
  } else {
    restResult(res, result);
  }
});

export default app;
