/* @flow */

import logger from 'morgan';
import path from 'path';
import fs from 'fs';

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

export default logger(process.env.REQUEST_LOG_FORMAT || 'dev', {
  stream: accessLogStream
});
