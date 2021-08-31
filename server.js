const http = require('http');
const app = require('./app');

const PORT = process.env.PORT;

app.set(3000);
const server = http.createServer(app);

server.listen(3000, () => {
  console.log(`App listening on port ${PORT || 3000}`);
});
