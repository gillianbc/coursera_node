const assert = require('assert');

exports.insertDocument = (db, document, collection, callback) => {
    //return the result of the insert
    //When passed a single document, insert() returns a WriteResult object
    return db.collection(collection).insert(document);
};

exports.findDocuments = (db, collection, callback) => {
    //find() returns a cursor to the documents that match the query criteria.
    return db.collection(collection).find({}).toArray();
};

exports.removeDocument = (db, document, collection, callback) => {
    return db.collection(collection).deleteOne(document);
};

exports.updateDocument = (db, document, update, collection, callback) => {
    return db.collection(collection).updateOne(document, { $set: update }, null);
};
