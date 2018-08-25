const express = require('express');
const bodyParser = require('body-parser');

const promoRouter = express.Router();
promoRouter.use(bodyParser.json());

promoRouter.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
});

promoRouter.route('/')
.get((req,res,next) => {
    res.end('Will send all the promos to you!');
})
.post((req, res, next) => {
    res.end('Will add the promo: ' + req.body.name + ' with details: ' + req.body.description);
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promos');
})
.delete((req, res, next) => {
    res.end('Deleting all promos');
});

promoRouter.route('/:promoId')
.get((req, res, next) => {
    //TO DO - code to get promo
    console.log(req.params.promoId);
    res.end('Here is your promo for the id ' + req.params.promoId);
})
.post((req, res, next) => {
    res.statusCode = 403; 
    res.end('POST not supported on /promos/' + req.params.promoId);
})
.put((req, res, next) => {
    res.write('Updating promo ' + req.params.promoId 
        + ' with name ' + req.body.name + ' details ' + req.body.description + '. ');
    //TO DO - code for updating promo
    res.end('I have updated ' + req.params.promoId);
})
.delete((req, res, next) => {
    //TO DO - code to delete promo
    res.end('Deleted ' + req.params.promoId);
});
module.exports = promoRouter;

