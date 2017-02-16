'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot')
})

let token = "EAAGEYA9BANUBAG262TNE1QhOrOTPRpIpydxdjm9QnWBcvPoxMQqpMJqwq9Ht3drBjC4KkWn36qdfaEgnGctOP7jiEThC24w6Q2sB8sbQHobffBF6oLqBEfCUzgybGdsDq3WMZBGIKAQYG1ZCacZAdaUkXrC4UMoztkxT3VSOAZDZD"

// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'shantabai_bot') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})

// handler receiving messages
app.post('/webhook', function (req, res) {  
    var events = req.body.entry[0].messaging;
    for (i = 0; i < events.length; i++) {
        var event = events[i];
        if (event.message && event.message.text) {
            sendMessage(event.sender.id, {text: "Echo: " + event.message.text});
        }
    }
    res.sendStatus(200);
})


// generic function sending messages
function sendMessage(recipientId, message) {  
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: token},
        method: 'POST',
        json: {
            recipient: {id: recipientId},
            message: message,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
};

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})