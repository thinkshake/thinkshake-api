/* @flow */

import express from 'express';
import HttpStatus from 'http-status-codes';
import models from '../models/';
import errors from '../lib/errors';
import oauthService from '../lib/oauth-service';

const router = express.Router();

router.get('/healthcheck', (req, res, next: () => mixed) => {
  res.status(HttpStatus.OK).end();
});

// TODO: 要test
router.post('/login', (req, res, next: () => mixed) => {

  req.checkBody('email', 'required').notEmpty();
  req.checkBody('password', 'required').notEmpty();

  req.getValidationResult().then((result) => {
    if (!result.isEmpty()) {
      return next(errors.ValidationError(result.array()));
    }

    models.User.login(req.body.email, req.body.password)
      .then((user) => {
        if (user) {
          return oauthService.authorize(user.name, req.body.password)
            .then((parsedBody) => {
              return models.User.updateWithHash({
                access_token: parsedBody.access_token,
                refresh_token: parsedBody.refresh_token
              })
                .then(() => {
                  res.send({ access_token: parsedBody.access_token });
                })
                .catch((err) => {
                  next(err);
                });
            })
            .catch((err) => {
              next(err);
            });
        } else {
          next(errors.NotFound('User not found'));
        }
      })
      .catch((err) => {
        next(err);
      });
  });
});

export default router;
