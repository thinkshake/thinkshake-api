/* @flow */

import express from 'express';
import models from '../models/';
import opinionsRoute from './opinions';
import errors from '../lib/errors';

const exposeAttributes = ['id', 'name', 'updated_at'];
const router = express.Router();
router.get('/', (req, res, next: () => mixed) => {

  const where = {};
  if (req.query.name) where.name = req.query.name;

  models.Topic.findAll(Object.assign({
    where: where,
    attributes: exposeAttributes,
  }, req.getQeuryCommon()))
    .then((topics) => {
      res.send(topics);
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/:id', (req, res, next: () => mixed) => {
  models.Topic.findById(req.params.id, { attributes: exposeAttributes })
    .then((topic) => {
      if (topic) {
        res.send(topic);
      } else {
        next(errors.NotFound('Topic not found'));
      }
    })
    .catch((err) => {
      next(err);
    });
});

// =====================
// Opinion
opinionsRoute.provider(router, 'topic_id');

export default router;
