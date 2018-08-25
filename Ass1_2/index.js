const express = require('express');
const http = require('http');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const dishRouter = require('./routes/dishRouter');


const hostname = 'localhost';
const port = 3000;

const app = express();
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use('/dishes', dishRouter);


//============


//when any post requests come in for /dishes/:dishId
app.post('/dishes/:dishId', (req, res, next) => {
    res.statusCode = 403; 
    res.end('POST not supported on /dishes/:' + req.params.dishId);
});

//when any put requests come in for /dishes/:dishId
app.put('/dishes/:dishId', (req, res, next) => {
    res.write('Updating dish ' + req.params.dishId 
        + ' with name ' + req.body.name + ' details ' + req.body.description);
    //TO DO - code for updating dish
    res.end('I have updated ' + req.params.dishId);
});

//when any delete requests come in for /dishes/:dishId
app.delete('/dishes/:dishId', (req, res, next) => {
    //TO DO - code to delete dish
    res.end('Deleted ' + req.params.dishId);
});

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