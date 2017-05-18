/* @flow */

import express from 'express';
import HttpStatus from 'http-status-codes';

const router = express.Router();
router.get('/', (req, res, next: () => mixed) => {
  res.status(HttpStatus.OK).end();
});

export default router;
