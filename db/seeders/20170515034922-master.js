'use strict';
const models = require('../../src/models/');

module.exports = {
  up: function (queryInterface, Sequelize) {
    const fn = [
      models.User.createWithHash({
        name: 'shaker_master',
        email: 'admin@thinkshake.net',
        password: 'test',
        refresh_token: 'refresh_token'
      }),
      models.Topic.create({ name: '社会'}),
      models.Topic.create({ name: '政治'}),
      models.Topic.create({ name: 'スポーツ'}),
    ];
    return Promise.all(fn);
  },

  down: function (queryInterface, Sequelize) {
    const fn = [
      queryInterface.bulkDelete('users', { name: 'shaker_master' }, {}),
      queryInterface.bulkDelete('topics', { name: '社会' }, {}),
      queryInterface.bulkDelete('topics', { name: '政治' }, {}),
      queryInterface.bulkDelete('topics', { name: 'スポーツ' }, {}),
    ];
    return Promise.all(fn);
  }
};
