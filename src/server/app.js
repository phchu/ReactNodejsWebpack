import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import errorHandler from 'errorhandler';
import express from 'express';
import logger from 'morgan';
import mongoose from 'mongoose';
import path from 'path';

import createApolloServer from './apollo-server';
import models from './models';
import resolvers from './resolvers';
import schema from './schema';

const app = express();
const PORT = process.env.NODE_ENV !== 'development' ? 3000 : 8080;
// Create a Apollo Server
const server = createApolloServer(schema, resolvers, models);
server.applyMiddleware({ app, path: '/graphql' });

mongoose
  .connect(
    process.env.MONGO_URL,
    { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log('🗄️ DB connected success.'))
  .catch(err => console.error('[ERROR]DB: ', err));

app.use(bodyParser.json({
  limit: '10mb'
}));
app.use(bodyParser.urlencoded({
  limit: '10mb',
  extended: true
}));

app.use(express.static('dist'));
app.use(logger('dev'));

app.use(cookieParser());

if (process.env.NODE_ENV !== 'development') {
  app.use(compression());
  app.use(express.static('public'));
  app.get('*', (req, res) => {
    const filePath = './public/index.html';
    const index = path.resolve(filePath);
    res.sendFile(index);
  });
}

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found!');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(errorHandler());
}
app.listen(PORT, () => console.log(`🚀 API ready at ${PORT}`));
