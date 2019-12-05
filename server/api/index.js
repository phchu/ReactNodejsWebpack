import express from 'express';
import auth from './auth';
import user from './user';

const app = express.Router();

app.use('/auth', auth);
app.use('/user', user);

export default app;
