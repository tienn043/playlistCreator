const express = require('express');
const querystring = require('querystring');
const request = require('request');
const port= 3000;
const path = require('path');
const fs = require('fs');
var app = express();


app.use(express.static('public'));
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/fonts', express.static(path.join(__dirname, 'public/fonts')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));

//app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  fs.readFile('./index.html', 'utf8', (err,html) => {
      if(err){
          res.status(500).send('ERROR');
      }
      res.send(html);

    })
  }

);

app.get('/playlist-creator.html', (req, res) => {
  fs.readFile('./playlist-creator.html', 'utf8', (err,html) => {
      if(err){
          res.status(500).send('ERROR');
      }
      res.send(html);
    })
  }

);

// Serve static files from the "images" directory
app.use('/images', express.static(path.join(__dirname, 'images')));

app.get('/images', (req, res) => {
    const coversDir = path.join(__dirname, 'images', 'covers');
    
    fs.readdir(coversDir, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Unable to scan directory' });
        }

        const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));

        let arr = [];
        for(image of imageFiles){
          const imagePath = path.join(coversDir, image);
          
          const data = fs.readFileSync(imagePath);

          const base64String = Buffer.from(data).toString('base64');

          arr.push(base64String);
        }

        res.json(arr);

    });
});


app.get('/refresh_token', function(req, res) {

  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
    },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token,
          refresh_token = body.refresh_token;
      res.send({
        'access_token': access_token,
        'refresh_token': refresh_token
      });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}/`);
});