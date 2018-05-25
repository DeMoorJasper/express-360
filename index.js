const express = require('express');
const sessionMiddleware = require('./middleware/sessionStore');
const corsMiddleware = require('./middleware/cors');
const compressionMiddleware = require('compression');
const bodyParser = require('body-parser');
const http = require('http');

let app = express();
let server = http.createServer(app);

function useStatic(staticAssets, app) {
  if (staticAssets.url && staticAssets.folder) {
    app.use(staticAssets.url, express.static(staticAssets.folder));
  } else {
    throw new Error('Static option should contain a url and folder property!');
  }
}

async function initServer({ compression, sessions, staticAssets, trustProxy, cors }) {
  if (sessions) {
    // Register express-session
    app.use(sessionMiddleware(sessions));
  }

  if (cors) {
    app.use(corsMiddleware(cors));
  }

  if (trustProxy) {
    if (isNan(trustProxy)) {
      trustProxy = 1;
    }
    // Trust load balancer
    app.set('trust proxy', trustProxy);
  }

  if (compression) {
    // Use GZIP
    app.use(compressionMiddleware());
  }

  if (staticAssets) {
    if (Array.isArray(staticAssets)) {
      for (let staticAsset of staticAssets) {
        useStatic(staticAsset, app);
      }
    } else {
      useStatic(staticAssets, app);
    }
  }

  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: false }))

  // parse application/json
  app.use(bodyParser.json())

  return app;
}

async function startServer({ port }) {
  if (!port) {
    throw new Error('You should define a port');
  }
  
  await new Promise(resolve => server.listen(port, resolve));
  return server;
}

async function stopServer() {
  await new Promise(resolve => server.close(resolve));
}

exports.initServer = initServer;
exports.startServer = startServer;
exports.stopServer = stopServer;