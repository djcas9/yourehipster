/*eslint-disable no-console, no-var */

var express = require('express')

var app = express()

var fs = require('fs')
var path = require('path')
var engine = require('ejs-locals');

app.engine( 'html', engine );
app.set( 'views', path.join(__dirname, 'build'));
app.set( 'view engine', 'html' );
app.use(express.static('build'));

app.get('*', function(req, res){
  res.render('index.html', {});
});

app.listen(8080, function () {
  console.log('Server listening on http://localhost:8080, Ctrl+C to stop')
})

