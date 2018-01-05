import {GraphQLClient} from 'graphql-request'
import EventEmitter from 'event-emitter'
import m from 'gql/mutations.js'
import q from 'gql/queries.js'

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
  init () {
    if (JSON.parse(window.localStorage.getItem('rememberMe'))) {
      setupClient(window.localStorage.getItem('token'))
      return true
    }
    else {
      return false
    }
  },
  auth: {
    login: async function (formData) {
      console.log(formData)
      try {
        var result = (await client.request(m.auth.authenticateUser(), formData)).authenticateUser
        console.log(result)

        setupClient(result.token)
        if (JSON.parse(window.localStorage.getItem('rememberMe'))) {
          window.localStorage.setItem('token', result.token)
          window.localStorage.setItem('id', result.id)
        }
        return result
      }
      catch (err) {
        // console.log(err.response.errors[0].functionError)
        return {
          error: err.response.errors[0].functionError
        }
      }
    },
    logout () {
      localStorage.clear()
      setupClient()
    },
    authenticateUser: async function (formData) {
      try {
        var result = (await client.request(m.auth.signupUser(), formData)).signupUser
        console.log(result)
        setupClient(result.token)
        if (JSON.parse(window.localStorage.getItem('rememberMe'))) {
          window.localStorage.setItem('token', result.token)
          window.localStorage.setItem('id', result.id)
        }
        return result
      }
      catch (err) {
        console.log(err.response)
        if (err.response) {
          return {
            error: err.response.errors[0].functionError
          }
        }
      }
    }
  },
  user: {
    get: async function (userId) {
      var result = ((await client.request(q.user.get(), {userId}))).User
      console.log('get user', result)
      events.emit('thisUser', result)
      return result
    },
    getByUsername: async function (username) {
      // console.log('get user', userId)
      var result = ((await client.request(q.user.getByUsername(), {username}))).User
      // events.emit('thisUser', result)
      return result
    }
  },
  device: {
    get: async function (deviceId) {
      var result = (await client.request(q.device.get(), {
        deviceId
      })).Device
      console.log(result)
      // location.reload()
      // events.emit('thisUser', result)
      return result
    },
    updateStatus: async function (device) {
      console.log('apiDevice', device)
      var result = (await client.request(m.device.updateStatus(), device)).updateDevice
      console.log(result)
      // location.reload()
      // events.emit('thisUser', result)
      return result
    }
  },
  leaderboard: {
    global: async function (teamId) {
      return (await client.request(q.leaderboard.global(),
        {teamId: teamId})).leaderboard.users
    },
    teams: async function (teamId) {
      return (await client.request(q.leaderboard.teams())).allTeams
    }
  }
}

// export default new Vue({
//   data () {
//     return {}
//   }
// })
export default api
