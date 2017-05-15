/* @flow */

import express from 'express';
import HttpStatus from 'http-status-codes';
import models from '../models/';
import oauth from '../lib/oauth';
import errors from '../lib/errors';

const router = express.Router();
router.get('/', oauth.authenticate(), (req, res, next: () => mixed) => {

  const where = {};
  if (req.query.project_id) where.project_id = req.query.project_id;
  if (req.query.topic_id) where.topic_id = req.query.topic_id;
  if (req.query.user_id) where.user_id = req.query.user_id;

  models.Opinion.findAll(Object.assign({
    where: where,
    attributes: ['id', 'remark', 'updated_at'],
  }, req.getQeuryCommon()))
    .then((opinions) => {
      res.send(opinions);
    })
    .catch((err) => {
      next(err);
    });
});

const provider = (router: express.Router, related_id: string) => {
  router.post('/:related_id/opinions/', oauth.authenticate(), (req, res, next: () => mixed) => {

    req.checkBody('remark', 'required').notEmpty();
    req.getValidationResult().then((result) => {
      if (!result.isEmpty()) {
        return next(errors.ValidationError(result.array()));
      }

      models.User.findOne({ where: { name: req.user.username } })
        .then((user) => {

          const options = {
            user_id: user.id,
            remark: req.body.remark,
          };
          options[related_id] = req.params.related_id;

          models.Opinion.create(options)
            .then(() => {
              res.status(HttpStatus.CREATED).header('Location', req.getBaseUrl() + req.params.related_id).end();
            })
            .catch((err) => {
              next(err);
            });

        })
        .catch((err) => {
          next(err);
        });

    });
  });

  router.delete('/:related_id/opinions/:id', oauth.authenticate(), (req, res, next: () => mixed) => {
    const options = { where: { id: req.params.id, user_id: 1 /* TODO:ユーザーを取得する */ } };
    options.where[related_id] = req.params.related_id;

    models.Opinion.destroy(options)
      .then((status) => {
        res.status(status ? HttpStatus.NO_CONTENT : HttpStatus.BAD_REQUEST).end();
      })
      .catch((err) => {
        next(err);
      });
  });
};

export default { router, provider };
