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
  let result;
  console.log('checkAuthorization: ', token);
  if (!token)
    return res
      .status(401)
      .send(wrapResult(new Error('Access denied. No token provided.')));

  if (token && token !== 'null') {
    try {
      const authUser = jwt.verify(
        _.replace(token, BEARER, ''),
        process.env.TOKEN_SECRET
      );
      console.log('authUser: ', authUser);
      result = authUser;
      if (next && authUser) {
        req.authUser = authUser;
        next();
      }
    } catch (err) {
      console.error('checkAuthorization: ', err.JsonWebTokenError);
      res.status(400).send(wrapResult(new Error('Invalid token.')));
    }
  }
  return result;
};

export default checkAuthorization;
