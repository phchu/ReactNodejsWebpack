import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import errorHandler from 'errorhandler';
import express from 'express';
import logger from 'morgan';
import path from 'path';

import api from './api/index';

const app = express();

const PORT = process.env.NODE_ENV !== 'development' ? 3000 : 8080;
app.listen(PORT, () => console.log(`Listening on PORT ${PORT}!`));

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

app.use('/api', api);

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

export default app;
