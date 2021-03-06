/* @flow */

import express from 'express';
import HttpStatus from 'http-status-codes';
import models from '../models/';
import opinionsRoute from './opinions';
import errors from '../lib/errors';

const exposeAttributes = ['id', 'name', 'goal', 'updated_at'];
const router = express.Router();
router.get('/', (req, res, next: () => mixed) => {

  const where = {};
  if (req.query.name) where.name = req.query.name;
  if (req.query.topic_id) where.topic_id = req.query.topic_id;
  if (req.query.owner_id) where.owner_id = req.query.owner_id;

  models.Project.findAll(Object.assign({
    where: where,
    attributes: exposeAttributes,
  }, req.getQeuryCommon()))
    .then((projects) => {
      res.send(projects);
    })
    .catch((err) => {
      next(err);
    });
});

router.post('/', (req, res, next: () => mixed) => {

  req.checkBody('name', 'required').notEmpty();
  req.checkBody('topic_id', 'required').notEmpty();

  req.getValidationResult().then((result) => {
    if (!result.isEmpty()) {
      return next(errors.ValidationError(result.array()));
    }

    models.User.findOne({ where: { name: req.user.username } })
      .then((user) => {
        models.Project.create({
          name: req.body.name,
          topic_id: req.query.topic_id,
          owner_id: user.id
        })
          .then((project) => {
            res.status(HttpStatus.CREATED).header('Location', req.getBaseUrl() + project.id).end();
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

router.get('/:id', (req, res, next: () => mixed) => {
  models.Project.findById(req.params.id, { attributes: exposeAttributes })
    .then((project) => {
      if (project) {
        res.send(project);
      } else {
        next(errors.NotFound('Project not found'));
      }
    })
    .catch((err) => {
      next(err);
    });
});

const updateProject = (req, res, next: () => mixed) => {
  const values: Object = { updatedAt: new Date() };
  if (req.body.name) {
    values.name = req.body.name;
  }

  models.User.findOne({ where: { name: req.user.username } })
    .then((user) => {
      models.Project.update(values, { where: { id: req.params.id, owner_id: user.id } })
        .then((status) => {
          res.status(status[0] ? HttpStatus.NO_CONTENT : HttpStatus.BAD_REQUEST).end();
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
      next(err);
    });

};

// Should it be slightly different between put and patch?
router.put('/:id', updateProject);
router.patch('/:id', updateProject);

router.delete('/:id', (req, res, next: () => mixed) => {

  models.User.findOne({ where: { name: req.user.username } })
    .then((user) => {
      models.Project.destroy({ where: { id: req.params.id, owner_id: user.id } })
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

// =====================
// Opinion
opinionsRoute.provider(router, 'project_id');

// =====================
// Participant
router.post('/:project_id/participants/', (req, res, next: () => mixed) => {

  models.User.findOne({ where: { name: req.user.username } })
    .then((user) => {
      models.ProjectParticipant.create({
        user_id: user.id,
        project_id: req.params.project_id,
      })
        .then(() => {
          res.status(HttpStatus.CREATED).header('Location', req.getBaseUrl() + req.params.project_id).end();
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
      next(err);
    });

});
router.delete('/:project_id/participants/:id', (req, res, next: () => mixed) => {

  models.User.findOne({ where: { name: req.user.username } })
    .then((user) => {

      models.ProjectParticipant.destroy({
        where: {
          id: req.params.id,
          project_id: req.params.project_id,
          user_id: user.id
        }
      })
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
