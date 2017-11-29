import { AUTH_CONFIG } from './AuthConfig'
import auth0 from 'auth0-js'
import Auth0Lock from 'auth0-lock'
const ACCESS_TOKEN_KEY = 'access_token'
const REDIRECT = AUTH_CONFIG.callbackUrl

var authOptions = {
  audience: 'https://boid.auth0.com/api/v2/',
  clientID: 'HqssNzWgRXjc91QwWmj1HPAlLqh1Bjzq',
  domain: 'boid.auth0.com',
  redirectUri: REDIRECT,
  responseType: 'token id_token',
  scope: 'openid email profile'
}

var lockOptions = {
  oidcConformant: true,
  auth: {
    audience: 'https://boid.auth0.com/api/v2/'
  },
  params: {
    scope: 'openid email profile'
  }
}

var auth = new auth0.WebAuth(authOptions)

var lock = new Auth0Lock(
  'HqssNzWgRXjc91QwWmj1HPAlLqh1Bjzq',
  'boid.auth0.com',
  lockOptions
)

lock.on('authenticated', function (authResult) {
  console.log(authResult)
  window.location.hash = ''

  localStorage.setItem('accessToken', authResult.accessToken)
})

export default {
  lock,
  setupApollo (apolloInstance) {

  },
  login () {
    // auth.authorize()
    lock.show()
  },
  getToken () {
    return localStorage.getItem(ACCESS_TOKEN_KEY)
  },
  clearToken () {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
  },
  setToken () {
    return new Promise((resolve, reject) => {
      auth.parseHash(function (err, authResult) {
        if (err) reject(err)
        console.log(authResult)
        if (authResult && authResult.accessToken) {
          window.location.hash = ''
          localStorage.setItem(ACCESS_TOKEN_KEY, authResult.accessToken)
          resolve(authResult.accessToken)
        }
      })
    })
  },
  m: {
    authenticateUser: async function () {}
  }
}
