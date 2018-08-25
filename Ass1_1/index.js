const express = require('express');
const http = require('http');
const morgan = require('morgan');

const dishRouter = require('./routes/dishRouter');

const hostname = 'localhost';
const port = 3000;

const app = express();
app.use(morgan('dev'));

app.use('/dishes', dishRouter);




//Tell express where to get static files from
app.use(express.static(__dirname + '/public'));

//Define the server
app.use((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end('<html><body><h1>This is an Express server</h1></body></html>');
});

const server = http.createServer(app);

server.listen(port,hostname, () => {
    console.log(`Server is running at http://${hostname}:${port}`);
});