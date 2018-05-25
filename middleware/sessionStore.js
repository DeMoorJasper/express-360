const session = require('express-session');
const RedisStore = require('connect-redis')(session);

const { HOUR } = require('../utils/time');
const REDISHOST = process.env.REDISHOST || 'localhost';
const REDISPORT = process.env.REDISPORT || 6379;
const SECRET = process.env.SESSION_SECRET || 'The little bunny runs through the grass.';

module.exports = function createSessions() {
  let sessionOptions = {
    secret: SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: HOUR,
      httpOnly: false
    },
    store: new RedisStore({
      host: REDISHOST,
      port: REDISPORT
    })
  };
  
  if (process.env.NODE_ENV === 'production') {
    sessionOptions.cookie.secure = true;
  }

  return session(sessionOptions);
}