const express = require('express');
const sessionMiddleware = require('./middleware/sessionStore');
const corsMiddleware = require('./middleware/cors');
const compressionMiddleware = require('compression');
const bodyParser = require('body-parser');

let server = express();

function useStatic(staticAssets, server) {
  if (staticAssets.url && staticAssets.folder) {
    server.use(staticAssets.url, express.static(staticAssets.folder));
  } else {
    throw new Error('Static option should contain a url and folder property!');
  }
}

async function initServer({ compression, sessions, staticAssets, trustProxy, cors }) {
  if (sessions) {
    // Register express-session
    server.use(sessionMiddleware(sessions));
  }

  if (cors) {
    server.use(corsMiddleware(cors));
  }

  if (trustProxy) {
    if (isNan(trustProxy)) {
      trustProxy = 1;
    }
    // Trust load balancer
    server.set('trust proxy', trustProxy);
  }

  if (compression) {
    // Use GZIP
    server.use(compressionMiddleware());
  }

  if (staticAssets) {
    if (Array.isArray(staticAssets)) {
      for (let staticAsset of staticAssets) {
        useStatic(staticAsset, server);
      }
    } else {
      useStatic(staticAssets, server);
    }
  }

  // parse application/x-www-form-urlencoded
  server.use(bodyParser.urlencoded({ extended: false }))

  // parse application/json
  server.use(bodyParser.json())

  return server;
}

async function startServer({ port }) {
  if (!port) {
    throw new Error('You should define a port');
  }
  
  await new Promise(resolve => server.listen(port, resolve));
  return server;
}

exports.initServer = initServer;
exports.start = startServer;