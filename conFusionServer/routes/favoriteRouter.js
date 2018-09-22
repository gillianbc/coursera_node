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
.get(cors.cors, (req,res,next) => {
    Favorites.find({})
    .populate('user')
    .then((faves) => {
        success(faves,200,res);
    }, (err) => next(err))
    .catch((err) => next(err));
});

favoriteRouter.route('/')
.options(cors.corsWithOptions, authenticate.verifyUser, (req, res) => { res.sendStatus(200); })
.get(cors.cors,authenticate.verifyUser, (req,res,next) => {
    //db.favorites.findOne({user: ObjectId("5b9ebf8de9557c3374e8a255")})
    console.log("The user is " + req.user);
    Favorites.findOne({'user' : req.user._id})
    .populate('user')
    .populate('dishes')
    .then((faves) => {
        success(faves,200,res);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
    //Check if the user has a favourites list already
    Favorites.findOne({"user" : req.user._id})
    .then((faveList) => {
        if (faveList == null) {
            //Create favourite list
            //Note:  create is Mongoose, not Mongo
            Favorites.create({user : req.user._id})
            .then((newfaveList) => {
                console.log('Favourites list Created OK');
                // To do - loop through dishes in req.body
                for (var _id in req.body) { 
                    if (req.body.hasOwnProperty(_id)) { 
                        console.log(_id + " -> " + p[_id]); 
                    } 
                }
                if (!isDishInList(newfaveList,dish)) {
                    console.log('Adding dish');
                    newfaveList.dishes.push({_id : dish._id});
                    newfaveList.save()
                    .then((fave) => {
                        success(fave,200,res);               
                    }, (err) => next(err));
                }
                else {
                    success(newfaveList,200,res);  
                } 
            },(err) => next(err))
            .catch((err) => next(err));
        }
        else {
            // To do - loop through dishes in req.body
            for (var _id in req.body) { 
                if (req.body.hasOwnProperty(_id)) { 
                    console.log(_id + " -> " + req.body[_id]); 
                    if (!isDishInList(faveList,dish)) {
                        console.log('Adding dish');
                        faveList.dishes.push({_id : dish._id});
                        faveList.save()
                        .then((fave) => {
                            success(fave,200,res);                
                        }, (err) => next(err));
                    }
                    else {
                        success(faveList,200,res);
                    } 
                } 
            }
            
        }
        
        
    })
    .catch((err) => next(err));

    
})
.put(cors.corsWithOptions, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.remove({"user" : req.user._id})
    .then((resp) => {
        success(resp,200,res);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

favoriteRouter.route('/:dishId')
.get(cors.cors, authenticate.verifyUser, (req,res,next) => {
    res.statusCode = 403;
    res.end('GET operation not supported on //'+ req.params.dishId);
})
.post(cors.corsWithOptions, authenticate.verifyUser,  (req, res, next) => {
    addDishToFaveList(req, res, next);
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on //'+ req.params.dishId);
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findByIdAndRemove(req.params.dishId)
    .then((resp) => {
        success(resp,200,res);
    }, (err) => next(err))
    .catch((err) => next(err));
});

function isDishInList(favourites, dish){
    let position = -1;
    if (favourites.dishes && favourites.dishes.length > 0) {
        console.log('The favelist dishes are:' + favourites.dishes + ' looking for ' + dish._id);
        console.log('Index ' + favourites.dishes.indexOf(dish._id));
        position = favourites.dishes.indexOf(dish._id);
        console.log('Dish in fave list is ' + position);
        if (position < 0)
            return false;
        else
            return true; 
    }
};

function success(responseItem, httpStatus,res){
        res.statusCode = httpStatus;
        res.setHeader('Content-Type', 'application/json');
        res.json(responseItem);
};
function noDish(req,next){
    err = new Error('Dish ' + req.params.dishId + ' not found');
    err.status = 404;
    return next(err);
}
function addDishToFaveList(req, res, next){
    var dish;
    //Get the dish from Mongo
    Dishes.findById(req.params.dishId)
    .then((fetchedDish) => {
        if (fetchedDish == null) noDish(req,next);
        dish = fetchedDish;  //hang on to the dish, we'll need it later
        //return the result of fetching the user's favourites list
        return Favorites.findOne({"user" : req.user._id});
    })
    .then((favelist) => {
        if (favelist == null)
            //return the result of creating a favelist
            return Favorites.create({user : req.user._id})
        else
            // return the favelist
            return favelist;
    })
    .then((favelist) => {
        if (!isDishInList(favelist,dish)) {
            console.log('Adding dish');
            favelist.dishes.push({_id : dish._id});
            //return the result of saving the favelist
            return favelist.save();
        }
        else {
            //no need to error, just no need to add the dish
            console.log('Dish was already there');
            //return the favelist as is
            return favelist;
        }
    })
    .then((favelist) => success(favelist,200,res),(err) => next(err))
    .catch((err) => next(err));
}
module.exports = favoriteRouter;