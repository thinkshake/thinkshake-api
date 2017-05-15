/* @flow */

import express from 'express';
import HttpStatus from 'http-status-codes';
import models from '../models/';
import oauth from '../lib/oauth';
import errors from '../lib/errors';

const router = express.Router();
router.get('/', oauth.authenticate(), (req, res, next: () => mixed) => {

  const where = {};
  if (req.query.ratee_id) where.ratee_id = req.query.ratee_id;
  if (req.query.rater_id) where.rater_id = req.query.rater_id;

  models.Rate.findAll(Object.assign({
    where: where,
    attributes: ['id', 'ratee_id', 'rater_id', 'type', 'point', 'updated_at'],
  }, req.getQeuryCommon()))
    .then((rates) => {
      res.send(rates);
    })
    .catch((err) => {
      next(err);
    });
});

router.post('/', oauth.authenticate(), (req, res, next: () => mixed) => {

  req.checkBody('ratee_id', 'required').notEmpty();
  req.checkBody('type', 'required').notEmpty();
  req.checkBody('point', 'required').notEmpty();

  req.getValidationResult().then((result) => {
    if (!result.isEmpty()) {
      return next(errors.ValidationError(result.array()));
    }

    models.User.findOne({ where: { name: req.user.username } })
      .then((user) => {
        models.Rate.create({
          ratee_id: req.body.ratee_id,
          type: req.body.type,
          point: req.body.point,
          rater_id: user.id
        })
          .then((rate) => {
            res.status(HttpStatus.CREATED).header('Location', req.getBaseUrl() + rate.id).end();
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

router.get('/:id', oauth.authenticate(), (req, res, next: () => mixed) => {
  models.Rate.findById(req.params.id, { attributes: ['id', 'ratee_id', 'rater_id', 'type', 'point', 'updated_at'] })
    .then((rate) => {
      if (rate) {
        res.send(rate);
      } else {
        next(errors.NotFound('Rate not found'));
      }
    })
    .catch((err) => {
      next(err);
    });
});

router.delete('/:id', oauth.authenticate(), (req, res, next: () => mixed) => {

  models.User.findOne({ where: { name: req.user.username } })
    .then((user) => {
      models.Rate.destroy({ where: { id: req.params.id, rater_id: user.id } })
        .then((status) => {
          res.status(status ? HttpStatus.NO_CONTENT : HttpStatus.BAD_REQUEST).end();
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
      next(err);
    });

});

export default router;
