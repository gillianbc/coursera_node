const express = require('express');
const http = require('http');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const hostname = 'localhost';
const port = 3000;

const app = express();
app.use(morgan('dev'));
app.use(bodyParser.json());

//when any requests come in for /dishes, do this then pass along the result and 
//exec the next thing for any /dishes
app.all('/dishes', (req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text-plain');
    next();
});

//===========================================

//when any get requests come in for /dishes
app.get('/dishes', (req, res, next) => {
    //TO DO - code to get dishes
    res.end('Here are your dishes');
});

//when any post requests come in for /dishes
app.post('/dishes', (req, res, next) => {
    //TO DO - code to do insert
    res.end('I have added ' + req.body.name + ' ' + req.body.description);
});

//when any put requests come in for /dishes
app.put('/dishes', (req, res, next) => {
    res.statusCode = 403; 
    res.end('PUT not supported on /dishes');
});

//when any delete requests come in for /dishes
app.delete('/dishes', (req, res, next) => {
    //TO DO - code to delete all dishes
    res.end('All dishes deleted (dangerous)');
});

//============
//when any get requests come in for /dishes/:dishId
app.get('/dishes/:dishId', (req, res, next) => {
    //TO DO - code to get dish
    res.end('Here is your dish for id ' + req.params.dishId);
});

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