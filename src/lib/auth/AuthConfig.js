var callback = ''

if (DEV) {
  callback = 'http://localhost:8080/callback'
}

if (PROD) {
  callback = 'http://alphaboid.herokuapp.com/callback'
}

export const AUTH_CONFIG = {
  clientId: 'HqssNzWgRXjc91QwWmj1HPAlLqh1Bjzq',
  domain: 'boid.auth0.com',
  callbackUrl: callback,
  apiUrl: 'API_IDENTIFIER'
}
