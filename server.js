var express = require('express');
var session = require('express-session');
var http = require('http');
var Hangman = require('./Hangman');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var app = express();

app.use(bodyParser.json());
app.use(cookieParser());


app.use(session({
	name: 'gameId',
	secret: 'datenut',
	resave: false,
	saveUninitialized: true
}));

var games = [];


app.get('/', function (req, res) {
	console.log(req.session.game);

 	if(!req.session.game) {
		newGame(req.session);

 	} else {
 		console.log('success');
 	}
 		res.send('Hello World!');

});

// app.post('/', function(req, res)) {

// }

function newGame(session) {
	http.get('http://randomword.setgetgo.com/get.php', function(res) {
	    var body = '';
        res.on('data', function(d) {
            body += d;
        });

        res.on('end', function() {
        	body = body.replace(/(\r\n|\n|\r)/gm,'');

    	 	var game = new Hangman(body);
 			console.log(game);
			session.game = game;
			session.save();
        });
	});
}

var port = process.env.PORT || 3000;
var server = app.listen(port, function () {

  var host = server.address().address || 'localhost';

  console.log('Example app listening at http://%s:%s', host, port);

  // game = {
  // 	'session': 'datenut',
  // 	'game': new Game(word);,
  // }

})