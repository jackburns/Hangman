"use strict";

var express = require('express');
var session = require('express-session');
var redisStore = require('connect-redis')(session);
var http = require('http');
var Hangman = require('./hangman');
var path = require('path');
var redis = require('redis');

var app = express();

var redisClient = redis.createClient();

app.use(session({
    store: new redisStore({
        client: redisClient
    }),
    name: 'gameId',
    secret: 'datenut',
    resave: false,
    saveUninitialized: true
}));

// load static files
app.use(express.static(__dirname + '/public'));

var activeGame,
    gameStats = {
        'won': 0,
        'lost': 0
    };

redisClient.exists('gameStats', function (err, reply) {
    if (reply === 1) {
        console.log('exists');
        redisClient.hget('gameStats', 'won', function (err, reply) {
            console.log(reply);
            gameStats.won = reply;
        });
        redisClient.hget('gameStats', 'lost', function (err, reply) {
            gameStats.lost = reply;
        });

    } else {
        redisClient.hmset('gameStats', {
            'won': 0,
            'lost': 0
        });
    }
})

// sends previous game information or starts a new game
app.get('/game', function (req, res) {

    if (req.session && req.session.game) {
        loadGame(req.session.game);
        res.send({
            'type': 'old',
            'guessedLetters': activeGame.guessedLetters,
            'validList': activeGame.validList,
            'remainingAttempts': activeGame.maxWrongAnswers - activeGame.attempts,
            'gameStats': gameStats
        });
    } else {
        newGame(req.session, function (validList) {
            res.send({
                'type': 'new',
                'validList': validList,
                'gameStats': gameStats
            });
        });
    }
});

//
app.post('/letter/:letter', function (req, res) {
    if (req.session.game) {
        loadGame(req.session.game);
        var json = activeGame.validateLetter(req.params.letter);
        req.session.game = activeGame;
        req.session.save();

        if (json.isGameOver) {
            req.session.game = null;
            req.session.save();

            if (json.gameOverType === 'win') {
                gameStats.won++;
                redisClient.hincrby('gameStats', 'won', 1);

            } else {
                gameStats.lost++;
                redisClient.hincrby('gameStats', 'lost', 1);
            }

        }
        json.gameStats = gameStats;
        res.send(json);

    } else {
        res.status(412).end();
    }

});

function newGame(session, callback) {
    http.get('http://randomword.setgetgo.com/get.php', function (res) {
        var body = '';
        res.on('data', function (d) {
            body += d;
        });

        res.on('end', function () {
            body = body.replace(/(\r\n|\n|\r)/gm, '');

            var game = new Hangman(body);
            session.game = game;
            session.save();
            callback(session.game.validList);
        });
    });
}

function loadGame(gameSession) {
    activeGame = new Hangman(gameSession.word, gameSession.guessedLetters, gameSession.validList, gameSession.attempts);
}


var port      = process.env.OPENSHIFT_NODEJS_PORT || 3000;
var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var server    = app.listen(port, ipaddress);
