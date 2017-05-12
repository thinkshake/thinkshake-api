/* @flow */
const Sequelize = require('sequelize');

let User;
type UserModel = User;

export default (sequelize: Sequelize, DataTypes: Sequelize.DataTypes): UserModel => {
  User = sequelize.define('user', {
    name: DataTypes.STRING
  }, {
    comment: 'user',
    timestamps: true,

    // createdAt: false,
    // updatedAt: false,
    // deletedAt: false,

    // I want updatedAt to actually be called updateTimestamp
    // updatedAt: 'updateTimestamp',

    // And deletedAt to be called destroyTime (remember to enable paranoid for this to work)
    // deletedAt: 'destroyTime',
    paranoid: true,

    classMethods: {
      // associate: function (models) {
      //   // associations can be defined here
      // },

      get: (id: number) => {
        return User.findOne(
          { 'where': { 'id': id } }
        );
      }
    }
  });

  // type UserModel = User;
  return User;
};