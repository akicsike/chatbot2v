var express = require("express");
var request = require("request");
var bodyParser = require("body-parser");

// const express = require('express');
// const app = express();
const path = require('path');
const port = process.env.PORT || 3000;

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
// const PAGE_ACCESS_TOKEN = 'EAADevKQwm2wBAMCLpIIKTNocMBS4eibWthS0x3awcV4AZAZCCi7Gydj3LxvYbUMCMOrLCWYknoszRL0OShMCYR9jMbgWigt44VDeu6AlOpKF8aLqFI9N8tWZCODropiqeqpsbv6SkWbZA5Su55H68d9zF9a1Lh1HSJK9ZAZCTUMxvZBZCN448Ao5';

var app = express();
// app.use(bodyParser.urlencoded({extended: false}));
// app.use(bodyParser.json());
// // app.listen((process.env.PORT || 5000));

// // Server index page
// // app.get("/", function (req, res) {
// //   res.send("Deployed!");
// // });

// app.get('/', function(req, res) {
//   res.sendFile(path.join(__dirname + '/index.html'));
// });

// app.listen(port, () => console.log(`url-shortener listening on port ${port}!`));

// // Facebook Webhook
// // Used for verification
// app.get("/webhook", function (req, res) {
//   if (req.query["hub.verify_token"] === "this_is_my_token") {
//     console.log("Verified webhook");
//     res.status(200).send(req.query["hub.challenge"]);
//   } else {
//     console.error("Verification failed. The tokens do not match.");
//     res.sendStatus(403);
//   }
// });

app.get('/webhook', (req, res) => {
  
  const VERIFY_TOKEN = "this_is_my_token";
  
  // Parse the request body from the POST
  let body = req.body;

  // Check the webhook event is from a Page subscription
  if (body.object === 'page') {

    // Iterate over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {

      // Gets the body of the webhook event
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);


      // Get the sender PSID
      let sender_psid = webhook_event.sender.id;
      console.log('Sender PSID: ' + sender_psid);

      // Check if the event is a message or postback and
      // pass the event to the appropriate handler function
      if (webhook_event.message) {
        handleMessage(sender_psid, webhook_event.message);        
      } else if (webhook_event.postback) {
        handlePostback(sender_psid, webhook_event.postback);
      }
      
    });

    // Return a '200 OK' response to all events
    res.status(200).send('EVENT_RECEIVED');

  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

  
});


// Handles messages events
function handleMessage(sender_psid, received_message) {

  let response;

  // Check if the message contains text
  if (received_message.text) {    

    // Create the payload for a basic text message
    response = {
      "text": `You sent the message: "${received_message.text}". Now send me an image!`
    }
  }  
  
  // Sends the response message
  callSendAPI(sender_psid, response); 

}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {

}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {

  // Construct the message body
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }

  // Send the HTTP request to the Messenger Platform
  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": process.env.PAGE_ACCESS_TOKEN },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!')
    } else {
      console.error("Unable to send message:" + err);
    }
  });
  
}