import { AUTH_CONFIG } from './AuthConfig'
import auth0 from 'auth0-js'

// const ID_TOKEN_KEY = 'id_token'
const ACCESS_TOKEN_KEY = 'access_token'

// const CLIENT_ID = AUTH_CONFIG.clientId
// const CLIENT_DOMAIN = AUTH_CONFIG.domain
const REDIRECT = AUTH_CONFIG.callbackUrl
// const SCOPE = 'openid email profile user_metadata'
// const AUDIENCE = `https://${AUTH_CONFIG.domain}/userinfo`

var auth = new auth0.WebAuth({
  audience: 'https://boid.auth0.com/api/v2/',
  clientID: 'HqssNzWgRXjc91QwWmj1HPAlLqh1Bjzq',
  domain: 'boid.auth0.com',
  redirectUri: REDIRECT,
  responseType: 'token',
  scope: 'openid email profile'
})

export default {
  login () {
    auth.authorize()
  },
  getToken () {
    return localStorage.getItem(ACCESS_TOKEN_KEY)
  },
  clearToken () {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
  },
  setToken () {
    auth.parseHash(function (err, authResult) {
      if (err) return console.error(err)
      console.log(authResult)
      if (authResult && authResult.accessToken) {
        window.location.hash = ''
        localStorage.setItem(ACCESS_TOKEN_KEY, authResult.accessToken)
        console.log('set Access Token')
      }
    })
  }
}
