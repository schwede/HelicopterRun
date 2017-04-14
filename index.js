var bodyParser = require('body-parser');
var express = require('express');
var HighScores = require('./server/highScores.js');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(function(request, response, next) {
  console.log(new Date(), request.ip, request.method, request.url);
  next();
});

app.use(express.static(__dirname + '/public', {
  maxage: 10 * 1000,
}));

app.use(bodyParser.json());

app.get('/api/clearHighScores', function(request, response) {
  HighScores.clearAll();
  response.status(200);
  response.setHeader('content-type', 'application/json');
  response.send(JSON.stringify(HighScores.getAll()));
});

app.get('/api/getHighScores', function(request, response) {
  response.status(200);
  response.setHeader('content-type', 'application/json');
  response.send(JSON.stringify(HighScores.getAll()));
});

app.post('/api/addHighScore', function(request, response) {
  let success = HighScores.add({
    username: request.body.username,
    value: request.body.value,
    location: request.body.location,
  });

  if(success) {
    response.status(200);
    response.send('High score added.');
  } else {
    response.status(400);
    response.send('Failed to add high score.');
  }
});

app.listen(app.get('port'), function() {
  console.log('Node app is running at localhost:' + app.get('port'));
});
