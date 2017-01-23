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
	client.query('SELECT facebook_url FROM users', function(err, result) {
		//call `done()` to release the client back to the pool
		done();

		if(err) {
			return console.error('error running query', err);
		}
		//console.log(result.rows[0].facebook_url);
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

app.post('/webhook/', function (req, res) {
	var state = 0 ;
	let messaging_events = req.body.entry[0].messaging;
	for (let i = 0; i < messaging_events.length; i++) {
		let event = req.body.entry[0].messaging[i];
		let sender = event.sender.id;
		//MAKE THIS sender and messenger_id
		pool.query('SELECT state FROM users WHERE user_id = 1',  function (err, result) {
			state = result.rows[0].state; // STATE IS NOT PROPERLY SET ON THE GLOBAL states
			if (event.message && event.message.text) {
				let text = event.message.text;
				console.log(state);
				if(state === 1){
					console.log("hello");
					var facebook_urls = [];
					var array = text.split(','); // send array[0] to esri API -- return coordinates, add array[1] IS DATE
					console.log(array[1]);
					console.log(array);
					pool.query('UPDATE users SET state = 2 WHERE user_id = 1 OR message_id=1793179830899605;',function(err, result){
					});
					pool.query('SELECT facebook_url, route FROM users WHERE date=$1', [array[1].toString()], function(err, result){
						console.log(result);
						//finalize facebook_urls with relevant algorithm
					});
					// filter routes with results THEN return all facebook_urls in array
					//search the database where  every entry in the database and write route algorithm
					sendTextMessage(sender, "Below is a list of all people you could reach out to!: ")
					facebook_urls.forEach(function(element) {
						sendTextMessage(sender, element);
					});
				}
				else if (text === 'hey' || text === 'hi' || text === 'whats up' || text === 'yo') {
					sendTextMessage(sender, "Hey! Where are you trying to go? And at what time? e.g. UCSB, 2017-28-01");
					pool.query('UPDATE users SET state = 1 WHERE user_id = 1 OR message_id=1237576872989203;',function(err, result){
					});
					/*pool.query("INSERT INTO users (facebook_url, date, destination, origin, notified, route) VALUES ('https://www.facebook.com/aaron.veronese?fref=nf', '01/24/2017', POINT(0,0), POINT(0,1), 1, PATH(polygon '(34.414899, -119.84312), (0,0)'));" ,  function(err, result){
					 });
					 */
					//contacted = 1, message_id = that person, Facebook URL/id
					//ALWAYS GOING TO BE NEW USER Final product -- query database to see if that user exists already, add user if not
					continue;
				}
				sendTextMessage(sender, "Sorry not sure what you mean by " + text.substring(0, 200))
			}
		});
		if (event.postback) {
			let text = JSON.stringify(event.postback)
			sendTextMessage(sender, "Postback received: " + text.substring(0, 200), token)
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


/*

 if (text === 'Generic') {
 console.log("welcome to chatbot")
 sendGenericMessage(sender)
 continue
 }
 */
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
