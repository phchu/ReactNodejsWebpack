import _ from 'lodash';
import jwt from 'jsonwebtoken';
import { wrapResult } from './utils';

const BEARER = 'Bearer ';
/**
 * Checks if client is authenticated by checking authorization key from req headers
 *
 * @param {obj} req
 */
const checkAuthorization = (req, res, next) => {
  const token = _.get(req.headers, 'authorization');
  let result = null;
  if (!token || token === 'null' || token === '') {
    // If this is a GraphQL context call without 'res', just return null.
    // If it's a middleware call, return 401.
    if (res && res.status) {
      return res
        .status(401)
        .send(wrapResult(new Error('Access denied. No token provided.')));
    }
    return result;
  }

  try {
    const authUser = jwt.verify(
      _.replace(token, BEARER, ''),
      process.env.TOKEN_SECRET
    );
    result = authUser;
    if (next && authUser) {
      req.authUser = authUser;
      next();
    }
  } catch (err) {
    console.error('checkAuthorization: ', err.message);
    if (res && res.status) {
      res.status(400).send(wrapResult(new Error('Invalid token.')));
    }
  }
  return result;
};

export default checkAuthorization;
