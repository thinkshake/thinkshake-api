'use strict';
const models = require('../../src/models/');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return models.User.createWithHash({
      name: 'shaker_test',
      email: 'test@thinkshake.net',
      password: 'test',
      access_token: 'access_token',
      refresh_token: 'refresh_token'
    }).then((user) => {
      return models.Topic.create({
        name: 'テストトピック'
      }).then((topic) => {

        const fn = [
          models.Opinion.create({
            remark: 'トピックへの発言',
            topic_id: topic.id,
            user_id: user.id
          }),
          models.Project.create({
            name: 'テストプロジェクト',
            goal: 'テストゴール',
            topic_id: topic.id,
            owner_id: user.id
          }).then((project) => {
            return models.Opinion.create({
              remark: 'プロジェクトへの発言',
              project_id: project.id,
              user_id: user.id
            });
          }),
          models.Rate.create({
            ratee_id: user.id,// TODO: 本当は同じユーザーで評価はできない
            rater_id: user.id,
            type: 0,
            point: 55
          }),
          models.Rate.create({
            ratee_id: user.id,// TODO: 本当は同じユーザーで評価はできない
            rater_id: user.id,
            type: 1,
            point: 40
          }),
          models.Rate.create({
            ratee_id: user.id,// TODO: 本当は同じユーザーで評価はできない
            rater_id: user.id,
            type: 2,
            point: 60
          }),
          models.Rate.create({
            ratee_id: user.id,// TODO: 本当は同じユーザーで評価はできない
            rater_id: user.id,
            type: 3,
            point: 30
          }),
          models.Rate.create({
            ratee_id: user.id,// TODO: 本当は同じユーザーで評価はできない
            rater_id: user.id,
            type: 4,
            point: 20
          }),
          models.Rate.create({
            ratee_id: user.id,// TODO: 本当は同じユーザーで評価はできない
            rater_id: user.id,
            type: 5,
            point: 30
          }),
        ];
        return Promise.all(fn);
      });
    });

  },

  down: function (queryInterface, Sequelize) {
    const fn = [
      models.Opinion.truncate({ force: true }),
      models.Project.truncate({ force: true }),
      models.Topic.truncate({ where: { name: 'テストトピック' }, force: true }),
      models.User.destroy({ where: { name: 'shaker_test' }, force: true }),
      models.Rate.truncate({ force: true }),
    ];
    return Promise.all(fn);
  }
};
