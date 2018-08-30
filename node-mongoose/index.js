const mongoose = require("mongoose");

const url = "mongodb://localhost:27017/conFusion";

const Dishes = require("./models/dishes");

mongoose
  .connect(
    url,
    { useNewUrlParser: true }
  )
  .then(() => {
    const db = mongoose.connection;

    Dishes.create({
      name: "Uthapizza",
      description: "Test"
    })
    .then(dish => {
      console.log(dish);

      return Dishes.findByIdAndUpdate(
        dish._id,
        {
          $set: {
            description: "Updated Test"
          }
        },
        { new: true }
      );
    })
    .then(dish => {
      console.log(dish);
      return db.collection("dishes").drop();
    })
    .then(() => {
      return db.close();
    });
  })
  .catch(e => {
    console.log('Problem connecting');
    console.log(e);
  });
