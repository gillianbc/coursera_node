const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const Favorites = require('../models/favorites');
const Dishes = require('../models/dishes');
const authenticate = require('../authenticate');
const cors = require('./cors'); 
const favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());


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
.get(cors.cors, (req,res,next) => {
    Favorites.find({})
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
                // ************
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
        
        
    })
    .catch((err) => next(err));

    
})
.put(cors.corsWithOptions, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.remove({})
    .then((resp) => {
        success(resp,200,res);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

favoriteRouter.route('/:dishId')
.get(cors.cors, authenticate.verifyUser, (req,res,next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on //'+ req.params.dishId);
})
.post(cors.corsWithOptions, authenticate.verifyUser,  (req, res, next) => {
    // =====

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

module.exports = favoriteRouter;

