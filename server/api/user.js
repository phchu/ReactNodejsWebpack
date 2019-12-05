import express from 'express';
import { makeExecutableSchema } from 'graphql-tools';
import * as gqlBuilder from 'gql-query-builder';
import typeDefs from '../graphql/schema';
import resolvers from '../graphql/resolvers';
import gql from '../operator/gql';
import { restResult } from '../operator/utils';

const app = express.Router();
const [userResolver] = resolvers;
const schema = makeExecutableSchema({ typeDefs, resolvers: userResolver });

app.get('/', async (req, res) => {
  const operation = 'getUser';
  const query = gqlBuilder.query({
    operation,
    variables: { name: { value: req.query.name, required: true } },
    fields: ['_id', 'name', 'email', 'createdAt']
  });
  const result = await gql(schema, operation, query);
  restResult(res, result);
});

export default app;
