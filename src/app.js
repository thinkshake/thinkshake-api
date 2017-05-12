/* @flow */

import express from 'express';
import logger from './lib/logger';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import HttpStatus from 'http-status-codes';
import users from './routes/users';
import expressValidator from 'express-validator';

// const log = require('debug')('thinkshake-api:server');
const error = require('debug')('thinkshake-api:error');

const app = express();

app.use(logger);
app.use(bodyParser.json());
app.use(expressValidator());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// extend functions
app.use((req, res, next: () => mixed) => {
  req.getBaseUrl = () => {
    return req.protocol + '://' + req.get('host') + req.baseUrl + '/';
  };
  return next();
});

// routes
app.use('/users', users);

// secure headers
app.disable('x-powered-by');

// favicon response
app.get('/favicon.ico', (req, res, next: () => mixed) => {
  const err: Object = new Error(HttpStatus.getStatusText(HttpStatus.NO_CONTENT));
  err.status = HttpStatus.NO_CONTENT;
  next(err);
});

// catch 404 and forward to error handler
app.use((req, res, next: () => mixed) => {
  const err: Object = new Error(HttpStatus.getStatusText(HttpStatus.NOT_FOUND));
  err.status = HttpStatus.NOT_FOUND;
  next(err);
});

// error handler
// next has to be defined as 4 args in order to define a error handler, even unused in the function.
app.use((err, req, res, next: () => mixed) => {
  res.status(err.status || HttpStatus.INTERNAL_SERVER_ERROR);
  error((err.status || HttpStatus.INTERNAL_SERVER_ERROR) + ' ' + (err.message || HttpStatus.getStatusText(err.status)));

  // TODO:エラーフォーマット
  const errorMessages: Object = {
    message: (err.message || HttpStatus.getStatusText(err.status))
  };

  // TODO: 不要？フォーマット次第？
  if (app.get('env') === 'development') {
    errorMessages.error = err;
  }

  res.send(errorMessages);
});

process.on('uncaughtException', (err) => {
  error('I\'ve crashed!!! - ' + (err.stack || err));
});

module.exports = app;
