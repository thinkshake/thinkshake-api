'use strict';
const config = require('./config');
const { genRandomString, sha512 } = require('../lib/cryption');

module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    salt: DataTypes.STRING,
    access_token: DataTypes.STRING,
    refresh_token: DataTypes.STRING
  }, Object.assign({
    comment: 'user',

    // I want updatedAt to actually be called updateTimestamp
    // updatedAt: 'updateTimestamp',

    // And deletedAt to be called destroyTime (remember to enable paranoid for this to work)
    // deletedAt: 'destroyTime',

    classMethods: {
      // associate: function (models) {
      //   // associations can be defined here
      // },

      // get: (id) => {
      //   return User.findOne(
      //     { where: { id: id } }
      //   );
      // }

      login: (email, password) => {
        return User.findOne({ where: { email: email }, attributes: ['name', 'password', 'salt'] })
          .then((user) => {
            if (user && user.password === sha512(password, user.salt)) {
              return user;
            }
            return null;
          });
      },

      createWithHash: (values, options) => {
        values.salt = genRandomString(16);
        if (values.password) values.password = sha512(values.password, values.salt);
        return User.create(values, options);
      },

      updateWithHash: (values, options) => {
        return User.findById(options.where.id, { rejectOnEmpty: true })
          .then((user) => {
            if (values.password) values.password = sha512(values.password, user.salt);
            return User.update(values, options);
          });
      }
    }
  }, config.options));

  // type UserModel = User;
  return User;
};