'use strict';
const config = require('./config');
module.exports = function(sequelize, DataTypes) {
  var Topic = sequelize.define('Topic', {
    name: DataTypes.STRING
  }, Object.assign({
    comment: 'topic'
  }, config.options));
  return Topic;
};
