const express = require('express');
const bodyParser = require('body-parser');

const dishRouter = express.Router();
dishRouter.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
});
dishRouter.route('/')
.get((req,res,next) => {
    res.end('Will send all the dishes to you!');
})
.post((req, res, next) => {
    res.end('Will add the dish: ' + req.body.name + ' with details: ' + req.body.description);
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
})
.delete((req, res, next) => {
    res.end('Deleting all dishes');
});

dishRouter.route('/:dishId')
.get((req, res, next) => {
    //TO DO - code to get dish
    console.log(req.params.dishId);
    res.end('Here is your dish for the id ' + req.params.dishId);
});

module.exports = dishRouter;

