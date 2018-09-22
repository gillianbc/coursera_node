const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const Favorites = require('../models/favorites');
const Dishes = require('../models/dishes');
const authenticate = require('../authenticate');
const cors = require('./cors');
const favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());

// All callbacks in Mongoose use the pattern: callback(error, result)
// if you pass in a callback function the operation will be executed immediately 
// with the results passed to the callback
// A query also has a .then() function, and thus can be used as a promise.

//Just for my benefit - not part of the assignment
favoriteRouter.route('/all')
    .options(cors.corsWithOptions, authenticate.verifyUser, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
        Favorites.find({})
            .populate('user')
            .then((faves) => {
                successResponse(faves, 200, res);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

favoriteRouter.route('/')
    .options(cors.corsWithOptions, authenticate.verifyUser, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        //db.favorites.findOne({user: ObjectId("5b9ebf8de9557c3374e8a255")})
        Favorites.findOne({ 'user': req.user._id })
            .populate('user')
            .populate('dishes')
            .then((resp) => {
                if (resp)
                    successResponse(resp, 200, res);
                else
                    notFound('Favourites list not found for ' + req.user.username);
            })
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        console.log('post user is ' + req.user._id);
        addDishToFaveList(req, res, next, null, req.body);
    })
    .put(cors.corsWithOptions, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.remove({ "user": req.user._id })
            .then((resp) => {
                if (resp)
                    successResponse(resp, 200, res);
                else
                    notFound('Favourites list not found for ' + req.user.username);
            })
            .catch((err) => next(err));
    });

favoriteRouter.route('/:dishId')
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('GET operation not supported on //' + req.params.dishId);
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        addDishToFaveList(req, res, next, req.params.dishId, null);
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on //' + req.params.dishId);
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        console.log('In delete by dishId');
        Favorites.findOne({ "user": req.user._id })
        .then((favelist) => {
            if (!favelist)
                notFound("Favourite list not found for " + req.user.username);
            if (isDishInList(favelist, req.params.dishId)) {
                console.log('removing dish');
                favelist.dishes.remove(req.params.dishId);
                return favelist.save();
            }
            else
                notFound("Dish not found in list");
        })
        .then((resp) => {
            successResponse(resp, 200, res);
        })
        .catch((err) => next(err));
    });


function pushDish(favelist, dishId) {
    if (favelist.dishes && favelist.dishes.indexOf(dishId) < 0){
        console.log('Pushing dish');
        favelist.dishes.push({ _id: dishId });
    }
    else {
        console.log('No work for me to do');
    }
    return favelist;
}
// This isn't right but surely I shouldn't need this anyhow
// Schema validation should prevent an invalid dish being saved
async function isValidDish(dishId) {
    var dish = await Dishes.findById(dishId);
    if (dish){
        console.log('Dish is valid');
        return true;
    }
    else {
        console.log('Dish is not valid');
        return false;
    }
        
}
function isDishInList(favourites, dishId) {
    if (favourites.dishes && favourites.dishes.length > 0) {
        return favourites.dishes.indexOf(dishId) >= 0;
    }
};

function successResponse(responseItem, httpStatus, res) {
    res.statusCode = httpStatus;
    res.setHeader('Content-Type', 'application/json');
    res.json(responseItem);
};
function notFound(errorText) {
    err = new Error(errorText);
    err.status = 404;
    throw err;
    // return next(err);
}
function addDishToFaveList(req, res, next, dishId, dishIds) {
    console.log('Dish id is ' + dishId);
    Favorites.findOne({ "user": req.user._id })
        .then((favelist) => {
            if (!favelist) {
                //return the result of creating a favelist
                console.log('Creating favelist');
                return Favorites.create({ user: req.user._id })
            }
            else
                return favelist;
        })
        .then((favelist) => {
            if (dishId) {
                pushDish(favelist, dishId);
            }
            if (dishIds) {
                for (var i in dishIds) {
                    if (dishIds[i].hasOwnProperty('_id')) {
                        pushDish(favelist, dishIds[i]._id);
                    }
                }
            }
            return favelist.save();
        })
        .then((favelist) => {
            successResponse(favelist, 200, res), (err) => next(err);
        })
        .catch((err) => next(err));



}
module.exports = favoriteRouter;