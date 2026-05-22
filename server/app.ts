import * as dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import errorHandler from 'errorhandler';
import express from 'express';
import logger from 'morgan';
import mongoose from 'mongoose';
import path from 'path';

import models from './models';
import resolvers from './graphql/resolvers';
import schema from './graphql/schema';
import { expressMiddleware } from '@as-integrations/express5';
import cors from 'cors';
import createApolloServer, { createContext } from './graphql/apollo-server';
import api from './api/index';
import swaggerDoc from './swaggerDoc';

const app = express();
const PORT = process.env.NODE_ENV !== 'development' ? 3000 : 8080;

// Create a Apollo Server
async function init() {
  const server = createApolloServer(schema, resolvers);
  await server.start(); // Await the server start

  swaggerDoc(app);

  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

  app.use('/graphql', cors(), bodyParser.json(), expressMiddleware(server, {
    context: createContext(models)
  }));
  console.log(`Apollo Server ready at http://localhost:${PORT}/graphql`);

  app.use(express.static('dist'));
  app.use(logger('dev'));
  app.use(cookieParser());
  app.use('/api', api);

  if (process.env.NODE_ENV === 'production') {
    app.use(compression());
    app.use(express.static('public'));
    app.get(/(.*)/, (req, res) => {
      const filePath = '../public/index.html';
      const index = path.resolve(__dirname, filePath);
      res.sendFile(index);
    });
  }

  // catch 404 and forward to error handler
  app.use((req, res, next) => {
    const err = new Error('Not Found!');
    // @ts-ignore
    err.status = 404;
    next(err);
  });

  // error handlers
  if (app.get('env') === 'development') {
    app.use(errorHandler());
  }

  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log('🗄️ DB connected success.'))
    .catch((err) => console.error('[ERROR]DB: ', err));

  app.listen(PORT, () => console.log(`🚀 API ready at ${PORT}`));
}

init();
