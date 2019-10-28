import _ from 'lodash';
import jwt from 'jsonwebtoken';

import { wrapResult } from '../../operator/utils';

const BEARER = 'Bearer ';

// eslint-disable-next-line consistent-return
export default (req, res, next) => {
  let token = _.get(req.headers, 'authorization');
  if (!token || !_.startsWith(token, BEARER)) {
    const error = new Error('Access Denied.');
    return res.status(401).send(wrapResult(error));
  }
  // Remove Bearer from string
  token = _.replace(token, BEARER, '');
  try {
    const authUser = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = authUser;
    next();
  } catch (err) {
    return res.status(401).send(wrapResult(err));
  }
};
