const config = {
  development: require('./development'),
  test: require('./test')
};

export default config[process.env.NODE_ENV || 'development'];
