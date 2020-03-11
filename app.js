var express = require("express");
var request = require("request");
var bodyParser = require("body-parser");

// const express = require('express');
// const app = express();
const path = require('path');
const port = process.env.PORT || 3000;

var app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
// app.listen((process.env.PORT || 5000));

// Server index page
// app.get("/", function (req, res) {
//   res.send("Deployed!");
// });

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(port, () => console.log(`url-shortener listening on port ${port}!`));

// Facebook Webhook
// Used for verification
app.get("/webhook", function (req, res) {
  if (req.query["hub.verify_token"] === "this_is_my_token") {
    console.log("Verified webhook");
    res.status(200).send(req.query["hub.challenge"]);
  } else {
    console.error("Verification failed. The tokens do not match.");
    res.sendStatus(403);
  }
});