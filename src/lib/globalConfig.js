
  var apiAddress
  if (PROD){
    apiAddress = 'http://api.boid.com/'
  }
  if (DEV){
    apiAddress = 'http://localhost:4040/'
  }

export default {
    api:apiAddress
  }
