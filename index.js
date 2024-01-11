const express = require('express');
const querystring = require('querystring');
const request = require('request');
const port= 3000;
const path = require('path');
const {readFile} = require('fs');

var app = express();


app.use(express.static('public'));
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/html', express.static(path.join(__dirname, 'public/html')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));

//app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  readFile('./index.html', 'utf8', (err,html) => {
      if(err){
          res.status(500).send('ERROR');
      }
      res.send(html);
    })
  }

);




//spotify tutorial to use auth flow
const generateRandomString = (length) => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

const codeVerifier  = generateRandomString(64);

const sha256 = async (plain) => {
  const encoder = new TextEncoder()
  const data = encoder.encode(plain)
  return window.crypto.subtle.digest('SHA-256', data)
}

const base64encode = (input) => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

const hashed = await sha256(codeVerifier)
const codeChallenge = base64encode(hashed);



var client_id = '350bb843292c48ae8ecece947c2ed01d';
var redirect_uri = 'http://localhost:3000/playlist-creator';
//var client_secret = 'deaef9ed8b554c8abd8b99df67252dad';


app.get('/login', function(req, res) {

  //var state = generateRandomString(16);
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

app.get('/playlist-creator.html', (req, res) => {
  readFile('./playlist-creator.html', 'utf8', (err,html) => {
      if(err){
          res.status(500).send('ERROR');
      }
      res.send(html);
    })
  }

);

app.get('/test.html', (req, res) => {
  readFile('./test.html', 'utf8', (err,html) => {
      if(err){
          res.status(500).send('ERROR');
      }
      res.send(html);
    })
  }

);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}/`);
});