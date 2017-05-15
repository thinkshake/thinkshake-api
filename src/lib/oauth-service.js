/* @flow */

import appConfig from '../../config/app';
import rp from 'request-promise';

class OAuthService {
  options = {};

  constructor() {
    this.options = {
      json: true
    };
  }

  _getApiName(apiName) {
    return appConfig['oauth-endpoint'] + (apiName ? apiName : '');
  }

  registerUser(username, password) {
    const opts = Object.assign({}, this.options);
    opts.uri = this._getApiName('/users');
    opts.method = 'POST';
    opts.form = {
      username: username,
      password: password,
    };

    return rp(opts);
  }

  authorize(username, password, grantType) {
    const opts = Object.assign({}, this.options);
    opts.uri = this._getApiName('/oauth/token');
    opts.method = 'POST';
    opts.form = {
      grant_type: grantType || 'password',
      client_id: appConfig['oauth-client-id'],
      client_secret: appConfig['oauth-client-secret'],
      username: username,
      password: password,
    };

    if (grantType === 'refresh_token') {
      delete opts.form.username;
      delete opts.form.password;
    }

    return rp(opts);
  }

  authenticateMe(token) {
    const opts = Object.assign({}, this.options);
    opts.uri = this._getApiName('/oauth/me');
    opts.headers = {
      'Authorization': `Bearer ${token}`
    };

    return rp(opts);
  }

  authenticateById(username, token) {
    const opts = Object.assign({}, this.options);
    opts.uri = this._getApiName(`/users/${username}`);
    opts.headers = {
      'Authorization': `Bearer ${token}`
    };

    return rp(opts);
  }
}

export default new OAuthService();
