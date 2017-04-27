import express from 'express';
import HttpStatus from 'http-status-codes';
import models from '../models/';
import util from 'util';

const router = express.Router();
router.get('/', (req, res, next) => {

  const where = {};
  if (req.query.name) {
    where.name = req.query.name;
  }

  models.user.findAll({ where: where })
    .then((users) => {

      // TODO: 出力データ絞る(日付とか不要)

      res.send(users);
    })
    .catch((err) => {
      next(err);
    });
});

router.post('/', (req, res, next) => {

  req.checkBody('name', 'required').notEmpty();
  req.getValidationResult().then((result) => {
    if (!result.isEmpty()) {

      const err = new Error('There have been validation errors: ' + util.inspect(result.array()));
      err.status = HttpStatus.BAD_REQUEST;
      next(err);
      return;
    }


    models.user.create({
      name: req.body.name,

      // TODO: 自動で日付付与
      createdAt: new Date(),
      updatedAt: new Date()
    })
      .then((user) => {
        res.status(HttpStatus.CREATED).header('Location', req.getBaseUrl() + user.id).end();
      })
      .catch((err) => {
        next(err);
      });

  });

});

router.get('/:id', (req, res, next) => {
  models.user.get(req.params.id)
    .then((user) => {
      if (user) {

        // TODO: 出力データ絞る

        res.send(user);
      } else {
        next();
      }
    })
    .catch((err) => {
      next(err);
    });
});

const updateUser = (req, res, next) => {
  // TODO: updatedAtなど共通化
  const values = { updatedAt: new Date() };
  if (req.body.name) {
    values.name = req.body.name;
  }

  models.user.update(values, { 'where': { 'id': req.params.id } })
    .then((status) => {
      res.status(status[0] ? HttpStatus.NO_CONTENT : HttpStatus.BAD_REQUEST).end();
    })
    .catch((err) => {
      next(err);
    });

};

// Should it be slightly different between put and patch?
router.put('/:id', updateUser);
router.patch('/:id', updateUser);

router.delete('/:id', (req, res, next) => {
  models.user.destroy({ 'where': { 'id': req.params.id } })
    .then((status) => {
      res.status(status ? HttpStatus.NO_CONTENT : HttpStatus.BAD_REQUEST).end();
    })
    .catch((err) => {
      next(err);
    });
});

export default router;
