const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const Favorites = require('../models/favorites');
const Dishes = require('../models/dishes');
const authenticate = require('../authenticate');
const cors = require('./cors'); 
const favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions, authenticate.verifyUser, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
    Favorites.find({})
    .then((faves) => {
        console.log('Get favourites');
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(faves);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
    Favorites.create(req.body)
    .then((favorite) => {
        console.log('Favorite Created ', favorite);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorite);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

favoriteRouter.route('/:dishId')
.get(cors.cors, authenticate.verifyUser, (req,res,next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on //'+ req.params.dishId);
})
.post(cors.corsWithOptions, authenticate.verifyUser,  (req, res, next) => {
    //Check if the dish exists
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if (dish != null) {
            //Check if the user has a favourites list already
            Favorites.findOne({"user" : req.user._id})
            .then((faveList) => {
                if (faveList == null) {
                    //Create favourite list
                    //Note:  create is Mongoose, not Mongo
                    Favorites.create({user : req.user._id})
                    .then((newfaveList) => {
                        console.log('Favourites list Created OK');
                        faveList = newfaveList;
                    },(err) => next(err))
                    .catch((err) => next(err));
                }
                let found = false;
                if (faveList.dishes.length > 0) {
                    console.log('The favelist dishes are:' + faveList.dishes);
                    found = faveList.dishes.includes(dish._id);
                    console.log('Dish in fave list is ' + found);
                }
                if (found == false) {
                    console.log('Adding dish');
                    faveList.dishes.push({_id : dish._id});
                    faveList.save()
                    .then((fave) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(fave);                
                    }, (err) => next(err));
                }
            })
            .catch((err) => next(err));
        } else {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
    

})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on //'+ req.params.dishId);
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findByIdAndRemove(req.params.dishId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = favoriteRouter;

