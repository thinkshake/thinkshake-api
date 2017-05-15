const bcrypt = require('bcrypt');

/**
 * generates random string of characters i.e salt
 * @function
 * @param {number} length - Length of the random string.
 */
const genRandomString = function (length) {
  return bcrypt.genSaltSync(length);
};

/**
 * generates hash string
 * @function
 * @param {string} password - List of required fields.
 * @param {string} salt - Data to be validated.
 */
const sha512 = function (password, salt) {
  return bcrypt.hashSync(password, salt);
};

module.exports = { genRandomString, sha512 };
