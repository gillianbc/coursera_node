const express = require('express');
const bodyParser = require('body-parser');

const leaderRouter = express.Router();
leaderRouter.use(bodyParser.json());

leaderRouter.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
});

leaderRouter.route('/')
.get((req,res,next) => {
    res.end('Will send all the leaders to you!');
})
.post((req, res, next) => {
    res.end('Will add the leader: ' + req.body.name + ' with details: ' + req.body.description);
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /leaders');
})
.delete((req, res, next) => {
    res.end('Deleting all leaders');
});

leaderRouter.route('/:leaderId')
.get((req, res, next) => {
    //TO DO - code to get leader
    console.log(req.params.leaderId);
    res.end('Here is your leader for the id ' + req.params.leaderId);
})
.post((req, res, next) => {
    res.statusCode = 403; 
    res.end('POST not supported on /leaders/' + req.params.leaderId);
})
.put((req, res, next) => {
    res.write('Updating leader ' + req.params.leaderId 
        + ' with name ' + req.body.name + ' details ' + req.body.description + '. ');
    //TO DO - code for updating leader
    res.end('I have updated ' + req.params.leaderId);
})
.delete((req, res, next) => {
    //TO DO - code to delete leader
    res.end('Deleted ' + req.params.leaderId);
});
module.exports = leaderRouter;

