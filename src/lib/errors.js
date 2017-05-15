import util from 'util';
import HttpStatus from 'http-status-codes';

function NotFound(message) {
  const error = new Error(message);
  error.status = HttpStatus.NOT_FOUND;

  return error;
}

function BadRequest(message) {
  const error = new Error(message);
  error.status = HttpStatus.BAD_REQUEST;

  return error;
}

util.inherits(BadRequest, Error);

function ValidationError(errors) {
  const error = BadRequest('There have been validation errors');
  error.errors = errors;

  return error;
}

export default { NotFound, BadRequest, ValidationError };
