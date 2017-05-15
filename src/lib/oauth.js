/* @flow */

import passport from 'passport';
import { Strategy } from 'passport-http-bearer';
import oauthService from './oauth-service';

class OAuthService {
  passport: passport.Authenticator;

  constructor(passport: passport.Authenticator) {
    this.passport = passport;
    this._useStrategy();
  }

  _useStrategy() {
    // this.passport.use({
    //   passReqToCallback: true
    // }, new Strategy(
    //   function (req, token, done: () => mixed) {
    //     return oauthService.authorizeMe(token)
    //       .then((parsedBody) => {
    //         const params = {};
    //         if (parsedBody.username) params.username = parsedBody.username;
    //         return done(null, params);
    //       })
    //       .catch((err) => {
    //         done(err);
    //       });
    //   }));
    this.passport.use(new Strategy(
      function (token, done: () => mixed) {
        return oauthService.authenticateMe(token)
          .then((parsedBody) => {
            const params = {};
            if (parsedBody.username) params.username = parsedBody.username;
            return done(null, params);
          })
          .catch((err) => {

          // FIXME: oauth2-serverが変更されたら変更する必要がある
            // err.error
            // { message: 'The access token provided is invalid.',
            //   error:
            //   { name: 'OAuth2Error',
            //     message: 'The access token provided is invalid.',
            //     headers: { 'Cache-Control': 'no-store', Pragma: 'no-cache' },
            //     code: 401,
            //       error: 'invalid_token',
            //     error_description: 'The access token provided is invalid.' } }

            const error = new Error(err.error.error.message);
            error.status = err.error.error.code;
            done(error);
          });
      }));
  }

  authenticate() {
    return this.passport.authenticate('bearer', { session: false, failWithError: true });
  }
}

export default new OAuthService(passport);
