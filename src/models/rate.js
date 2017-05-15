'use strict';
const config = require('./config');
module.exports = function(sequelize, DataTypes) {
  var Rate = sequelize.define('Rate', {
    ratee_id: DataTypes.INTEGER,
    rater_id: DataTypes.INTEGER,
    type: DataTypes.INTEGER, // TODO: ENUM? SQLITE3だとない // 0:論理力/1:協働力/2:アイデア力/3:継続力/4:発信力/5:調査力
    point: DataTypes.INTEGER
  }, Object.assign({
    comment: 'rate',
    timestamps: true,
    paranoid: true,

    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Rate.belongsTo(models.User, { 'foreignKey': 'ratee_id' });
        Rate.belongsTo(models.User, { 'foreignKey': 'rater_id' });
      }
    }
  }, config.options));
  return Rate;
};