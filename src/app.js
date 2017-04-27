import express from 'express';
import path from 'path';
import fs from 'fs';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import HttpStatus from 'http-status-codes';
import users from './routes/users';
import expressValidator from 'express-validator';

// const log = require('debug')('thinkshake-api:server');
const error = require('debug')('thinkshake-api:error');

const app = express();

// setting for logger
const FileStreamRotator = require('file-stream-rotator');
const accessLogStream = (() => {
  if (process.env.REQUEST_LOG_FILE) {
    const logDirectory = path.dirname(process.env.REQUEST_LOG_FILE);
    fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
    return FileStreamRotator.getStream({
      filename: process.env.REQUEST_LOG_FILE,
      frequency: 'daily',
      verbose: false
    });
  }
  return process.stdout;
})();
app.use(logger(process.env.REQUEST_LOG_FORMAT || 'dev', {
  stream: accessLogStream
}));

app.use(bodyParser.json());
app.use(expressValidator());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// extend functions
app.use((req, res, next) => {
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
app.get('/favicon.ico', (req, res, next) => {
  const err = new Error(HttpStatus.getStatusText(HttpStatus.NO_CONTENT));
  err.status = HttpStatus.NO_CONTENT;
  next(err);
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error(HttpStatus.getStatusText(HttpStatus.NOT_FOUND));
  err.status = HttpStatus.NOT_FOUND;
  next(err);
});

// error handler
// next has to be defined as 4 args in order to define a error handler, even unused in the function.
app.use((err, req, res, next) => {
  res.status(err.status || HttpStatus.INTERNAL_SERVER_ERROR);
  error((err.status || HttpStatus.INTERNAL_SERVER_ERROR) + ' ' + (err.message || HttpStatus.getStatusText(err.status)));

  // TODO:エラーフォーマット
  const errorMessages = {
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
