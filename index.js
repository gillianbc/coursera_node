var rect = require('./rectangle');

function solveRectangle(length,width){
    console.log("Solving for rec with length " + length + " and width " + width);
    var myfunc = (err,rectangle) => {
        if (err){
            console.log("ERROR " + err.message);
        }
        else {
            console.log("Perim for length " + length + " width " + width + " is " + rectangle.perimeter());
        };
    };
    rect(length,width,myfunc);

    console.log("After the call to rect");
};

solveRectangle(2,4);
solveRectangle(3,5);
solveRectangle(0,6);
solveRectangle(-1,2);