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
  readFile('./index.html', 'utf8', (err,html) => {
      if(err){
          res.status(500).send('ERROR');
      }
      res.send(html);

    })
  }

);

app.get('/playlist-creator.html', (req, res) => {
  readFile('./playlist-creator.html', 'utf8', (err,html) => {
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