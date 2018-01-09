var sslRedirect = require('heroku-ssl-redirect');
var express = require('express')
var serveStatic = require('serve-static')
var history = require('connect-history-api-fallback');

var app = express()
// app.use(sslRedirect())
app.set('port', (process.env.PORT || 5000))
app.use(history())
app.use(serveStatic('dist'))

app.listen(app.get('port'), function () {
  console.log('Node app is running at localhost:' + app.get('port'))
})
