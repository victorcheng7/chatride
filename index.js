//This is still work in progress
/*
Please report any bugs to nicomwaks@gmail.com

i have added console.log on line 48 




 */
'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
var  pg = require('pg');
var config = {
	user: 'gxtazabgagnnhg', //env var: PGUSER
	database: 'dct2b6f7sgpbd6', //env var: PGDATABASE
	password: 'cbbd1bee740b2ea329657af09b2e2545c1bfb34a99132b650d7701337dfedde2', //env var: PGPASSWORD
	host: 'ec2-54-235-177-45.compute-1.amazonaws.com', // Server hosting the postgres database
	port: 5432, //env var: PGPORT
	max: 10, // max number of clients in the pool
	ssl: true
//	idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};
var pool = new pg.Pool(config);

pool.connect(function(err, client, done) {
	if(err) {
		return console.error('error fetching client from pool', err);
	}
	client.query('SELECT $1::int AS number', ['1'], function(err, result) {
		//call `done()` to release the client back to the pool
		done();

		if(err) {
			return console.error('error running query', err);
		}
		console.log(result.rows[0].number);
		//output: 1
	});
});

pool.on('error', function (err, client) {
	console.error('idle client error', err.message, err.stack)
});



app.set('port', (process.env.PORT || 5000));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// parse application/json
app.use(bodyParser.json());

// index
app.get('/', function (req, res) {
	res.send('hello world i am a secret bot')
});

// for facebook verification
app.get('/webhook/', function (req, res) {
	if (req.query['hub.verify_token'] === process.env.RIDECHAT_TOKEN) {
		res.send(req.query['hub.challenge'])
	} else {
		res.send('Error, wrong token')
	}
});


// to post data
app.post('/webhook/', function (req, res) {
	let messaging_events = req.body.entry[0].messaging;
	for (let i = 0; i < messaging_events.length; i++) {
		let event = req.body.entry[0].messaging[i]
		let sender = event.sender.id
		if (event.message && event.message.text) {
			let text = event.message.text;
			if(text === 'hey' || text === 'hi' || text === 'whats up' || text ==='yo'){
				sendTextMessage(sender, "Hey! Where are you trying to go? And at what time? e.g. UCSB, 01/28/2017");
				continue;
			}
			if (text === 'Generic'){
				console.log("welcome to chatbot")
				sendGenericMessage(sender)
				continue
			}
			sendTextMessage(sender, "Sorry not sure what you mean by " + text.substring(0, 200))
		}
		if (event.postback) {
			let text = JSON.stringify(event.postback)
			sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
			continue
		}
	}
	res.sendStatus(200)
});


// recommended to inject access tokens as environmental variables, e.g.
const token = process.env.RIDECHAT_TOKEN
//const token = "<FB_PAGE_ACCESS_TOKEN>"

function sendTextMessage(sender, text) {
	let messageData = { text:text }
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
}

function sendGenericMessage(sender) {
	let messageData = {
		"attachment": {
			"type": "template",
			"payload": {
				"template_type": "generic",
				"elements": [{
					"title": "First card",
					"subtitle": "Element #1 of an hscroll",
					"image_url": "http://messengerdemo.parseapp.com/img/rift.png",
					"buttons": [{
						"type": "web_url",
						"url": "https://www.messenger.com",
						"title": "web url"
					}, {
						"type": "postback",
						"title": "Postback",
						"payload": "Payload for first element in a generic bubble",
					}],
				}, {
					"title": "Second card",
					"subtitle": "Element #2 of an hscroll",
					"image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
					"buttons": [{
						"type": "postback",
						"title": "Postback",
						"payload": "Payload for second element in a generic bubble",
					}],
				}]
			}
		}
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
}

// spin spin sugar
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'))
})
