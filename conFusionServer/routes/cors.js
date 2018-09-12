const express = require('express');
const cors = require('cors');
const app = express();  //Why has he put this in?

const whitelist = ['http://localhost:3000', 'https://localhost:3443'];
var corsOptionsDelegate = (req, callback) => {

    var corsOptions;
    console.log('corsOptionsDelegate: Origin: ' + req.header('Origin'));

    if (whitelist.indexOf(req.header('Origin')) !== -1) {
        console.log("corsOptionsDelegate: In whitelist");
        corsOptions = { origin: true };
        callback(null, corsOptions);
    }
    else {
        console.log("corsOptionsDelegate: Not in whitelist");
        corsOptions = { origin: false };
        callback(new Error('Not allowed by CORS'), corsOptions);
    }
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);