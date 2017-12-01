import { GraphQLClient } from 'graphql-request'
import Auth0Lock from 'auth0-lock'
import EventEmitter from 'event-emitter'
import m from 'gql/mutations.js'
import q from 'gql/queries.js'

var lockOptions = {
  oidcConformant: true,
  autoclose: true,
  auth: {
    audience: 'https://boid.auth0.com/api/v2/'
  },
  params: { scope: 'openid email profile' }
}

var lock = new Auth0Lock(
  'HqssNzWgRXjc91QwWmj1HPAlLqh1Bjzq',
  'boid.auth0.com',
  lockOptions
)

var events = new EventEmitter()

var gqlEndpoint = 'https://api.graph.cool/simple/v1/boid'
var client = {}

function setupClient (token) {
  if (token) {
    client = new GraphQLClient(gqlEndpoint, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
  }
  else {
    client = new GraphQLClient(gqlEndpoint)
  }
}
setupClient()

var api = {
  events,
  auth: {
    login: async function () {
      lock.show()
    },
    logout () {
      localStorage.clear()
    },
    authenticateUser: async function (accessToken) {
      var result = (await client.request(m.auth.authenticateUser(), {
        accessToken
      })).authenticateUser
      console.log(result)
      setupClient(result.token)
      window.localStorage.setItem('token', result.token)
      window.localStorage.setItem('id', result.id)
      return result.id
    }
  },
  user: {
    get: async function (userId) {
      var result = (await client.request(q.user.get(), { userId })).User
      console.log(result)
      // location.reload()
      events.emit('thisUser', result)
      return result
    }
  }
}

lock.on('authenticated', async function (result) {
  console.log(result)
  events.emit('ready', result)
  window.localStorage.setItem('accessToken', result.accessToken)
  var id = await api.auth.authenticateUser(result.accessToken)
  api.user.get(id)
})

// export default new Vue({
//   data () {
//     return {}
//   }
// })
export default api
