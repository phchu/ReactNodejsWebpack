import bodyParser from 'body-parser';
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
app.use((req, res, next) => {
  // req.user = {_id: '5840e3481ee48c1a3d68aaaa'}; //temp: set dev admin user._id
  res.locals.login = req.isAuthenticated();
  res.locals.user = req.user;
  next();
});

app.use('/api', api);

if (process.env.NODE_ENV !== 'development') {
  app.get('*', (req, res) => {
    const filePath = './dist/index.html';
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

module.exports = app;
