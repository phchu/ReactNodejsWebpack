import express from 'express';

import { wrapResult } from '../../operator/utils';
import verifyToken from './verifyToken';

const app = express.Router();

app.get('/', verifyToken, (req, res) => {
  const result = 'Success!';
  res.json(wrapResult(result));
});

export default app;
