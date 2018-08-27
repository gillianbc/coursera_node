const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const dboper = require('./operations');
//Don't forget to start your mongodb database before running this node module
//i.e. mongod --dbpath=data   in the mongodb folder above
const url = 'mongodb://localhost:27017/conFusion';
const dbname = 'conFusion';

MongoClient.connect(url, (err, client) => {

    assert.equal(err, null);

    console.log('Connected correctly to server');

    const db = client.db(dbname);
    const collection = db.collection("dishes");
    //INSERT A DOC
    dboper.insertDocument(db, { name: "Vadonut", description: "Test"},
        "dishes", (result) => {
            console.log("Insert Document:\n", result.ops);
            //FIND ALL DOCS
            dboper.findDocuments(db, "dishes", (docs) => {
                console.log("Found Documents:\n", docs);
                //UPDATE A DOC
                dboper.updateDocument(db, { name: "Vadonut" },
                    { description: "Updated Test" }, "dishes",
                    (result) => {
                        console.log("Updated Document:\n", result.result);
                        //FIND ALL DOCS
                        dboper.findDocuments(db, "dishes", (docs) => {
                            console.log("Found Updated Documents:\n", docs);
                            //DUMP ALL DOCS
                            db.dropCollection("dishes", (result) => {
                                console.log("Dropped Collection: ", result);

                                client.close();
                            });
                        });
                    });
            });
    });

});