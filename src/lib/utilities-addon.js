/* @flow */

// TODO: flow-typed 導入
function utilitiesAddon(req: any, res: any, next: () => mixed) {
  req.getBaseUrl = () => {
    return req.protocol + '://' + req.get('host') + req.baseUrl + '/';
  };
  req.getQueryCommon = () => {
    const order = req.query.order ? req.query.order : '';
    let orderSort = 'ASC';
    const orders = order.split(',').map((orderColumn) => {
      if (orderColumn[0] === '-') {
        orderColumn = orderColumn.substring(1);
        orderSort = 'DESC';
        return [orderColumn.substring(1), 'DESC'];
      } else if (orderColumn[0] === '+') {
        orderColumn = orderColumn.substring(1);
      }
      return [orderColumn, orderSort];
    });
    return {
      limit: isNaN(Number(req.query.limit)) ? 10 : Number(req.query.limit),
      offset: isNaN(Number(req.query.offset)) ? 0 : Number(req.query.offset),
      order: orders
    };
  };
  return next();
}
export default utilitiesAddon;
