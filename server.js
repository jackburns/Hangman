var express = require('express');
var session = require('express-session');

var app = express();

app.use(session({secret: 'datenut'}));

var session;

app.get('/', function (req, res) {
	session = req.session;
	console.log(session);
 	res.send('Hello World!' + session);
})

var port = process.env.PORT || 3000;
var server = app.listen(port, function () {

  var host = server.address().address || 'localhost';

  console.log('Example app listening at http://%s:%s', host, port);

})