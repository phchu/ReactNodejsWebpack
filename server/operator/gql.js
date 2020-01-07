import _ from 'lodash';
import { graphql } from 'graphql';
import models from '../models';
import { wrapResult } from './utils';

/**
 * Executes a GraphQL request. It requires a schema, an operation and a query object.
 * Optional arguments include an authUser, which will get passed as the context value
 * to all resolve functions,
 *
 * @param {Object} schema GraphQL executable schema
 * @param {string} operation resolve function name
 * @param {Object} q GraphQL query body
 * @param {string} q.query GraphQL query
 * @param {string} q.variables variables sent to the operation
 * @param {Object} authUser authorized user information
 * @param {string} authUser._id id
 * @param {string} authUser.name name
 * @param {number} authUser.createdAt created timestamp
 * @param {number} authUser.updatedAt updated timestamp
 *
 * @returns {Object} result The execution result of the request.
 * @returns {boolean} result.err status of the request. true if error occurs;
 * otherwise, is false;
 * @returns {object} result.data the value of the result if request is successful
 * @returns {object} result.errMsg the error message if request is failed
 *
 */
async function gql(schema, operation, q, authUser) {
  const { query, variables } = q;
  const gqlResult = await graphql(
    schema,
    query,
    null,
    { ...models, authUser },
    variables
  );
  const { errors, data } = gqlResult;
  let result;
  if (_.isEmpty(errors)) {
    result = wrapResult(_.get(data, operation));
  } else {
    result = wrapResult(
      new Error(
        _.chain(errors)
          .head()
          .get('message')
          .value()
      )
    );
  }
  return result;
}

export default gql;
