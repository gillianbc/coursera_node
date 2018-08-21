var rect = require('./rectangle');

function solveRectangle(length,width){
    console.log("Solving for rec with length " + length + " and width " + width);

    rect(length,width,(err,rectangle) => {
        if (err){
            console.log("ERROR " + err.message);
        }
        else {
            console.log("Perim for length " + length + " width " + width + " is " + rectangle.perimeter());
        }
    });

    console.log("After the call to rect");

};

solveRectangle(2,4);
solveRectangle(3,5);
solveRectangle(0,6);
solveRectangle(-1,2);