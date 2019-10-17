import express from 'express';

import {wrapResult} from '../../operator/commonOps';

const app = express.Router();

app.get('/', (req, res) => {
  const result = 'Success!';
  res.json(wrapResult(result));
});

export default app;
