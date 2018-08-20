var rect = require('./rectangle');

function solveRectangle(l,b){
    console.log("Solving for rec with length " + l + " and width " + b);

    if(l<=0 || b <=0) {
        console.log("Dimensions should be greater than 0");
    }
    else
    {
        console.log("Area is " +   rect.area(l,b));
        console.log("Perimeter is " + rect.perimeter(l,b));
    }

};

solveRectangle(2,4);
solveRectangle(3,5);
solveRectangle(0,6);
solveRectangle(-1,2);