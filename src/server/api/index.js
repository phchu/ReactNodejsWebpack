import express from 'express';

import query from './query';

const app = express.Router();

app.use('/query', query);

export default app;
