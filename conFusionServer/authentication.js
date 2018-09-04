//Authentication
function auth (req, res, next) {
    const authHeader = req.headers.authorization;
    //No cookie and no auth details in header - bye bye
    if (!req.signedCookies.user && !authHeader) {
        var err = new Error('Computer says no - tell me who you are!');
        res.setHeader('WWW-Authenticate', 'Basic');              
        err.status = 401;
        next(err);
        // return;  //do we need this?
    }
    
    //Has a cookie, but is it the right one?
    if (req.signedCookies.user) {
        console.log("User found in cookie: " + req.signedCookies.user);
        if (req.signedCookies.user === 'admin') {
            next();
        }
        else {
            var err = new Error('I checked your cookie but you are not the one!');
            err.status = 401;
            next(err);
        }
    }
    
    if (authHeader){
        //Get the user and password from the header and set the cookie
        var auth = new Buffer(authHeader.split(' ')[1], 'base64').toString().split(':');
        var user = auth[0];
        var pass = auth[1];
        if (user == 'admin' && pass == 'password') {
            res.cookie('user','admin',{signed: true});
            console.log("Set the cookie on the response: " + res);
            next(); // authorized
        } 
        else {
            var err = new Error('I said no! You are not authenticated!');
            res.setHeader('WWW-Authenticate', 'Basic');              
            err.status = 401;
            next(err);
        }
    }
    console.log("End of authentication");
  };

  module.exports = auth;