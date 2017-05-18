/* @flow */

import oauth from '../lib/oauth';

type WhiteList = { path: RegExp, method: string }

function oauthAddon(whiteList: Array<WhiteList> = []) {
  // TODO: flow-typed 導入
  return (req: any, res: any, next: () => mixed) => {

    for (let i = 0, l = whiteList.length; i < l; i++) {
      if (whiteList[i].method === req.method && req.path.match(whiteList[i].path)) {
        return next();
      }
    }

    return oauth.authenticate()(req, res, next);
  };
}

export default oauthAddon;
