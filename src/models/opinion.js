'use strict';
const config = require('./config');
module.exports = function (sequelize, DataTypes) {
  var Opinion = sequelize.define('Opinion', {
    user_id: DataTypes.INTEGER,
    topic_id: DataTypes.INTEGER,
    project_id: DataTypes.INTEGER,
    remark: DataTypes.TEXT
  }, Object.assign({
    comment: 'opinion',
    timestamps: true,
    paranoid: true,

    classMethods: {
      associate: function (models) {
        // associations can be defined here
        Opinion.belongsTo(models.User, { 'foreignKey': 'user_id' });
        Opinion.belongsTo(models.Topic, { 'foreignKey': 'topic_id' });
        Opinion.belongsTo(models.Project, { 'foreignKey': 'project_id' });
      }
    }
  }, config.options));
  return Opinion;
};