const http = require('http')
const app = require('./app')

// normalizePort  function returns a valid port, whether it is provided as a number or a string
const normalizePort = val => {
    const port = parseInt(val, 10);
  
    if (isNaN(port)) {
      return val;
    }
    if (port >= 0) {
      return port;
    }
    return false;
};

const port = normalizePort(process.env.PORT || '3000');
// set the port
app.set('port', port);

// errorHandler function checks for various errors and handles them appropriately — it is then registered to the server
const errorHandler = error => {
    if (error.syscall !== 'listen') {
      throw error;
    }

    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;

    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges.');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use.');
        process.exit(1);
        break;
      default:
        throw error;
    }
};

// create a node server
const server = http.createServer(app)

// error event, on error run errorHandler method
server.on('error', errorHandler)

// listening event
server.on('listening', () => {
    const address = server.address()
    const bind = typeof address === 'string' ? 'pipe' + address : 'port' + port
    console.log('Listening on ' + bind)
})

server.listen(port)