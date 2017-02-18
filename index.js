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
    res.send('Testing Shantabai Bot')
})


// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'shantabai') {
        res.send(req.query['hub.challenge'])
    }
    else {
    	res.send('Error, wrong token')
    }
})


// handler receiving messages
app.post('/webhook/', function (req, res) {
	let messaging_events = req.body.entry[0].messaging
	for (let i = 0; i < messaging_events.length; i++) {
		let event = req.body.entry[0].messaging[i]
		let sender = event.sender.id
		if (event.message && event.message.text) {
			let text = event.message.text
			if (text === 'Generic'){ 
				console.log("welcome to chatbot")
				//sendGenericMessage(sender)
				continue
			}
			sendMessage(sender, "Text received, echo: " + text.substring(0, 200))
		}
		if (event.postback) {
			let text = JSON.stringify(event.postback)
			sendMessage(sender, "Postback received: "+text.substring(0, 200), token)
			continue
		}
	}
	res.sendStatus(200)
})


/**
 *  function to send messages
 */ 

// Facebook Token
const token = "EAAGtfX4zApMBAP979CFOmfmfIqbmbi52u8F49FeT2dQsMhBdA7bvqqiQuZCoH6xXxiJXmcmM9tguAcr1mCEZBlnbl4zPMlw1iLuFolvLgeIjkEpp3NLqTA6d7y8U47BHQXy2HWDyekXabYN9S9PDI0YtKZCfS09CdVqTZBhpiwZDZD"

function sendMessage(recipientId, message) {
    messageData = {
        text:text
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
};

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})
