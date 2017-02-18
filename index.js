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
    if (req.query['hub.verify_token'] === 'shantabai_bot') {
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
const token = "EAAGEYA9BANUBAFuhhHrhNQjzz4XamsBZBOWxtr2qZBEDpiPRXyplLsZCE1QAOtFyzZAcz4e18ZBwUJqcNi8UGdKIdf18YD6uBfAFVmyjykWFWvUDaqQ30thkN2yA5jNGkUkQc0sWCDFSGAZC9inztA073DoscBJbEsBdE98apk2AZDZD"

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
