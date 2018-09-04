//Authentication
function auth (req, res, next) {
    console.log(req.session);
    
    const authHeader = req.headers.authorization;

    if (!req.session.user && !authHeader) {
        var err = new Error('Computer says no - tell me who you are!');
        res.setHeader('WWW-Authenticate', 'Basic');              
        err.status = 401;
        next(err);
    }
    
    //Has a session user, but is it the right one?
    if (req.session.user) {
        console.log("User found in session: " + req.session.user);
        if (req.session.user === 'admin') {
            next();
            //Need this return here or you'll get errors if you try a request with the wrng password
            return; 
        }
        else {
            var err = new Error('I checked your session but you are not the one!');
            err.status = 401;
            next(err);
        }
    }
    
    if (authHeader){
        //Get the user and password from the header and set the session user
        var auth = new Buffer(authHeader.split(' ')[1], 'base64').toString().split(':');
        var user = auth[0];
        var pass = auth[1];
        if (user == 'admin' && pass == 'password') {
            req.session.user = 'admin';
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