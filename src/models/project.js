'use strict';
const config = require('./config');
module.exports = function(sequelize, DataTypes) {
  var Project = sequelize.define('Project', {
    name: DataTypes.STRING,
    goal: DataTypes.STRING,
    topic_id: DataTypes.INTEGER,
    owner_id: DataTypes.INTEGER
  }, Object.assign({
    comment: 'project',
    timestamps: true,
    paranoid: true,

    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Project.belongsTo(models.Topic, { 'foreignKey': 'topic_id' });
        Project.belongsTo(models.User, { 'foreignKey': 'owner_id' });
      }
    }
  }, config.options));
  return Project;
};