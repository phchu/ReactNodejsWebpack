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

/**
 * @swagger
 * /api/auth/signin:
 *   post:
 *     tags: [Auth]
 *     name: signIn
 *     summary: Sign in a user with an email address and password.
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     requestBody:
 *       description: Sign in a user with an email address and password.
 *       require: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/schemas/req/signIn'
 *     responses:
 *      '200':
 *        description: 'Get a JWT token for authorization.'
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/schemas/res/signIn/200'
 *      '400':
 *        description: 'Bad request for invalid fields, unkown user ,or email and password do not match.'
 *        content:
 *          application/json:
 *            schema:
 *              oneOf:
 *                - $ref: '#/schemas/res/signIn/400/invalidFields'
 *                - $ref: '#/schemas/res/signIn/400/unknownUser'
 *                - $ref: '#/schemas/res/signIn/400/invalidPassword'
 *            example: {
 *              err: true,
 *              errMsg: '"email" length must be at least 6 characters long'
 *            }
 */
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

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     tags: [Auth]
 *     name: signUp
 *     summary: New user account registration.
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     requestBody:
 *       description: 'Creates an account with user name, email, password.'
 *       require: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/schemas/req/signUp'
 *     responses:
 *      '200':
 *        description: 'Get the information of new account.'
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/schemas/res/signUp/200'
 *      '400':
 *        description: 'Bad request for invalid fields or existed user account'
 *        content:
 *          application/json:
 *            schema:
 *              oneOf:
 *                - $ref: '#/schemas/res/signUp/400/invalidFields'
 *                - $ref: '#/schemas/res/signUp/400/existedUser'
 *            example: {
 *              err: true,
 *              errMsg: '"email" length must be at least 6 characters long'
 *            }
 */
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

/**
 * @swagger
 * /api/auth/verify:
 *   get:
 *     tags: [Auth]
 *     name: verifyUserToken
 *     summary: Verify user's JWT token
 *     security:
 *       - BearerAuth: []
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     responses:
 *      '200':
 *        description: 'Will send `Authenticated`'
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/schemas/res/verifyUser/200'
 *      '401':
 *        description: 'Authorization is possible but has failed or not yet been provided.'
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/schemas/res/verifyUser/401'
 *      '403':
 *        description: 'You do not have necessary permissions for the resource'
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/schemas/res/verifyUser/403'
 */
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
