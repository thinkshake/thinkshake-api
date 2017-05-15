/* @flow */

import express from 'express';
import logger from './lib/logger';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import HttpStatus from 'http-status-codes';
import expressValidator from 'express-validator';
import routes from './routes';

// const log = require('debug')('thinkshake-api:server');
const error = require('debug')('thinkshake-api:error');

const app = express();

app.set('env', process.env.NODE_ENV || 'development');

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
  req.getQueryCommon = () => {
    const order = req.query.order ? req.query.order : '';
    let orderSort = 'ASC';
    const orders = order.split(',').map((orderColumn) => {
      if (orderColumn[0] === '-') {
        orderColumn = orderColumn.substring(1);
        orderSort = 'DESC';
        return [orderColumn.substring(1), 'DESC'];
      } else if (orderColumn[0] === '+') {
        orderColumn = orderColumn.substring(1);
      }
      return [orderColumn, orderSort];
    });
    return {
      limit: isNaN(Number(req.query.limit)) ? 10 : Number(req.query.limit),
      offset: isNaN(Number(req.query.offset)) ? 0 : Number(req.query.offset),
      order: orders
    };
  };
  return next();
});

// routes
app.use('/users', routes.users);
app.use('/topics', routes.topics);
app.use('/projects', routes.projects);
app.use('/opinions', routes.opinions);
app.use('/rates', routes.rates);

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
