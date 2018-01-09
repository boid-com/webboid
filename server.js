var express = require('express')
var history = require('connect-history-api-fallback')
var sslRedirect = require('heroku-ssl-redirect');
var port = process.env.PORT || 8080
var app = express()

app.use(history())
app.use(sslRedirect())
app.use(express.static('./dist'))

app.listen(port, (event) => {
  console.log(event)
})
console.log('server started ' + port)
