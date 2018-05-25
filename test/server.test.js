const { initServer, startServer, stopServer } = require('../index');

test('Should init a server without issues', async () => {
  let server = await initServer({
    compression: true,
    sessions: true,
    trustProxy: process.env.NODE_ENV === 'production',
    cors: {
      hosts: 'http://localhost:8080'
    }
  });

  await startServer({ port: 1111 });
  await stopServer();
});