const express = require('express');
const querystring = require('querystring');
const request = require('request');
const port= 3000;
const path = require('path');
const {readFile} = require('fs');

var app = express();


app.use(express.static('public'));
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/fonts', express.static(path.join(__dirname, 'public/fonts')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));

//app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  readFile('./indexCopy.html', 'utf8', (err,html) => {
      if(err){
          res.status(500).send('ERROR');
      }
      res.send(html);

    })
  }

);




/*
app.get('/login', function(req, res) {

  var state = generateRandomString(16);
  var scope = 'user-top-read, user-read-private, user-read-email, playlist-read-private, playlist-modify-private';

  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));

});

app.get('/playlist-creator', function(req, res) {

  var code = req.query.code || null;
  var state = req.query.state || null;

  if (state === null) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        access_token = body.access_token;
        var access_token = body.access_token,
          refresh_token = body.refresh_token;

        res.redirect(
          
          '/#' +
            querystring.stringify({
              client: 'spotify',
              access_token: access_token,
              refresh_token: refresh_token,
            })
        );
      
      } else {
        res.send('There was an error during authentication.');
      }
    });
  }
});
*/
app.get('/playlist-creator.html', (req, res) => {
  readFile('./playlist-creator.html', 'utf8', (err,html) => {
      if(err){
          res.status(500).send('ERROR');
      }
      res.send(html);
    })
  }

);
/*
app.get('/test.html', (req, res) => {
  readFile('./test.html', 'utf8', (err,html) => {
      if(err){
          res.status(500).send('ERROR');
      }
      res.send(html);
    })
  }

);
*/

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}/`);
});