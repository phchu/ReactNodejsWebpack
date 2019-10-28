import express from 'express';

import auth from './auth'
import query from './query';

const app = express.Router();

app.use('/query', query);
app.use('/auth', auth);

export default app;
