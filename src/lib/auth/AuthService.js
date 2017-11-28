import auth0 from 'auth0-js'
import { AUTH_CONFIG } from './AuthConfig'
import Emitter from 'event-emitter'

export default class AuthService {
  authenticated = this.isAuthenticated()
  authNotifier = new Emitter()

  constructor () {
    this.login = this.login.bind(this)
    this.join = this.join.bind(this)
    this.setSession = this.setSession.bind(this)
    this.logout = this.logout.bind(this)
    this.isAuthenticated = this.isAuthenticated.bind(this)
    this.getProfile = this.getProfile.bind(this)
  }

  profile = {}

  auth0 = new auth0.WebAuth({
    domain: AUTH_CONFIG.domain,
    clientID: AUTH_CONFIG.clientId,
    redirectUri: AUTH_CONFIG.callbackUrl,
    audience: `https://${AUTH_CONFIG.domain}/userinfo`,
    responseType: 'token id_token',
    scope: 'openid email profile user_metadata'
  })

  join () {
    this.auth0.authorize({
      initialScreen: 'signUp',
      refID: 'THISISREFID'
    })
  }

  login () {
    this.auth0.authorize({
      initialScreen: 'login',
      refID: 'THISISREFID'
    })
  }

  handleAuthentication () {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult)
      }
      else if (err) {
        // router.replace('/')
        console.log(err)
        alert(`Error: ${err.error}. Contact us at support@boid.com`)
      }
    })
  }

  setSession (authResult) {
    // Set the time that the access token will expire at
    let expiresAt = JSON.stringify(
      authResult.expiresIn * 1000 + new Date().getTime()
    )
    localStorage.setItem('access_token', authResult.accessToken)
    localStorage.setItem('id_token', authResult.idToken)
    localStorage.setItem('expires_at', expiresAt)
    this.authNotifier.emit('authChange', {
      authenticated: true
    })
    this.getProfile(authResult)
  }

  logout () {
    // Clear access token and ID token from local storage
    localStorage.removeItem('access_token')
    localStorage.removeItem('id_token')
    localStorage.removeItem('expires_at')
    this.authNotifier.emit('authChange', false)
    // navigate to the home route
    // router.replace('/')
  }

  isAuthenticated () {
    // Check whether the current time is past the
    // access token's expiry time
    let expiresAt = JSON.parse(localStorage.getItem('expires_at'))
    // if (new Date().getTime() < expiresAt) this.getProfile()
    return new Date().getTime() < expiresAt
  }

  getProfile (authResult) {
    if (!authResult) {
      try {
        this.auth0.client.userInfo(
          localStorage.getItem('access_token'),
          (err, profile) => {
            if (err) return err
            if (profile) {
              this.authNotifier.emit('profileReady', profile)
            }
          }
        )
      }
      catch (error) {
        this.logout()
      }
    }
    else {
      this.auth0.client.userInfo(authResult.accessToken, (err, profile) => {
        if (err) return err
        if (profile) {
          this.authNotifier.emit('profileReady', profile)
        }
      })
    }
  }
}
