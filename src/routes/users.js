/* @flow */

import express from 'express';
import HttpStatus from 'http-status-codes';
import models from '../models/';
import errors from '../lib/errors';
import oauthService from '../lib/oauth-service';

const exposeAttributes = ['id', 'name', 'updated_at'];
const router = express.Router();

// TODO: admin
// router.get('/', (req, res, next: () => mixed) => {
//
//   const where = {};
//   if (req.query.name) where.name = req.query.name;
//   if (req.query.email) where.email = req.query.email;
//
//   // TODO: limit
//
//   models.User.findAll({ where: where, attributes: exposeAttributes })
//     .then((users) => {
//       res.send(users);
//     })
//     .catch((err) => {
//       next(err);
//     });
// });

router.post('/', (req, res, next: () => mixed) => {

  req.checkBody('name', 'required').notEmpty();
  req.checkBody('email', 'required').notEmpty();
  req.checkBody('password', 'required').notEmpty();

  req.getValidationResult().then((result) => {
    if (!result.isEmpty()) {
      return next(errors.ValidationError(result.array()));
    }

    // TODO: 業務エラー username/name/email 重複、passwordセキュリティ

    return oauthService.registerUser(req.body.name, req.body.password)
      .then(() => {

        return oauthService.authorize(req.body.name, req.body.password)
          .then((parsedBody) => {
            return models.User.createWithHash({
              name: req.body.name,
              email: req.body.email,
              password: req.body.password,
              access_token: parsedBody.access_token,
              refresh_token: parsedBody.refresh_token
            })
              .then(() => {
                // .then((user) => {
                // res.status(HttpStatus.CREATED).header('Location', req.getBaseUrl() + user.id).end();
                res.send({ access_token: parsedBody.access_token });
              })
              .catch((err) => {
                next(err);
              });
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
  models.User.findById(req.params.id, { attributes: exposeAttributes })
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        next(errors.NotFound('User not found'));
      }
    })
    .catch((err) => {
      next(err);
    });
});

const updateUser = (req, res, next: () => mixed) => {

  // TODO: updatedAtなど共通化
  const values: Object = { updatedAt: new Date() };
  if (req.body.name) values.name = req.body.name;
  // TODO: email 変更時は認証が必要
  if (req.body.email) values.email = req.body.email;
  if (req.body.password) values.password = req.body.password;

  models.User.updateWithHash(values, { where: { id: req.params.id, name: req.user.username } })
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

router.delete('/:id', (req, res, next: () => mixed) => {
  models.User.destroy({ where: { id: req.params.id, name: req.user.username } })
    .then((status) => {
      res.status(status ? HttpStatus.NO_CONTENT : HttpStatus.BAD_REQUEST).end();
    })
    .catch((err) => {
      next(err);
    });
});

export default router;
