module.exports = function({ hosts, credentials, methods, headers }) {
  return (req, res, next) => {
    res.header('Access-Control-Allow-Origin', hosts || '*');
    res.header('Access-Control-Allow-Credentials', credentials || true);
    res.header('Access-Control-Allow-Methods', methods || 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', headers || 'Content-Type');

    next();
  }
}