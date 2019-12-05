import express from 'express';
import { makeExecutableSchema } from 'graphql-tools';
import * as gqlBuilder from 'gql-query-builder';
import typeDefs from '../graphql/schema';
import resolvers from '../graphql/resolvers';
import checkAuthorization from '../operator/checkAuthorization';
import gql from '../operator/gql';
import { restResult, wrapResult } from '../operator/utils';

const app = express.Router();
const [userResolver] = resolvers;

const schema = makeExecutableSchema({ typeDefs, resolvers: userResolver });

app.post('/signin', async (req, res) => {
  const operation = 'signin';
  const query = gqlBuilder.mutation({
    operation,
    variables: {
      input: {
        value: { ...req.body },
        type: 'SignInInput',
        required: true
      }
    },
    fields: ['token']
  });
  const result = await gql(schema, operation, query);
  restResult(res, result);
});

app.post('/signup', async (req, res) => {
  const operation = 'signup';
  const query = gqlBuilder.mutation({
    operation,
    variables: {
      input: {
        value: { ...req.body },
        type: 'SignUpInput',
        required: true
      }
    },
    fields: ['_id', 'name', 'email', 'createdAt']
  });
  const result = await gql(schema, operation, query);
  restResult(res, result);
});

app.use(checkAuthorization);

app.get('/verify', async (req, res) => {
  const operation = 'getAuthUser';
  const query = gqlBuilder.query({
    operation,
    fields: ['_id', 'name', 'email', 'createdAt']
  });
  const result = await gql(schema, operation, query, req.authUser);
  const { err, data } = result;
  if (!err && !data) {
    res.status(400).json(wrapResult(new Error('Invalid token.')));
  } else {
    restResult(res, result);
  }
});

export default app;
