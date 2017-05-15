'use strict';
const config = require('./config');
module.exports = function(sequelize, DataTypes) {
  var ProjectParticipant = sequelize.define('ProjectParticipant', {
    project_id: DataTypes.INTEGER,
    participant_id: DataTypes.INTEGER
  }, Object.assign({
    comment: 'project users',
    timestamps: true,
    paranoid: true,

    classMethods: {
      associate: function(models) {
        // associations can be defined here
        ProjectParticipant.belongsTo(models.Project, { 'foreignKey': 'project_id' });
        ProjectParticipant.belongsTo(models.User, { 'foreignKey': 'participant_id' });
      }
    }
  }, config.options));
  return ProjectParticipant;
};