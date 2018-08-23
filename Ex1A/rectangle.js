module.exports = (x,y,callback) => {
    if (x<=0 || y<=0) {
        setTimeout(() => callback(new Error("Length and width must be greater than zero"),
        null),
        2000);
    }
    else {
        setTimeout( () => callback(null,
            { 
                // Do not use func args here - forces it to use x and y from outer scope
                perimeter: () => 2 * (x + y),
                area: () => x * y
            }),
            2000);
    }
}
