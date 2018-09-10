import { GraphQLClient } from 'graphql-request'
import EventEmitter from 'event-emitter'
import m from 'gql/mutations.js'
import q from 'gql/queries.js'
import { error } from 'util';

var events = new EventEmitter()

var gqlEndpoint = 'https://api.boid.com/simple/v1/cjjyr2gyf000i0192g53uoze3'
var client = {}

function setupClient (token) {
  if (token) {
    client = new GraphQLClient(gqlEndpoint, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
    // console.log(token)
  }
  else {
    client = new GraphQLClient(gqlEndpoint)
  }
}
setupClient()

var api = {
  client,
  events,
  init () {
    // if (window.local) {
    //   console.log('need local token')
    //   var token = window.local.ipcRenderer.sendSync('getTokenSync')
    //   if (token) return true
    //   else return false
    // }
    // else {
    if (JSON.parse(window.localStorage.getItem('rememberMe'))) {
      setupClient(window.localStorage.getItem('token'))
      return true
    }
    else {
      return false
    }
    // }
  },
  auth: {
    validatePayoutAccountRequest: async function(requestId){
      try {
        return await client.request(`
          mutation($requestId:ID){updatePayoutAccount(requestId:$requestId){payoutAccount}}
        `,{requestId})
      } catch (err) {
        console.error(err.response.errors[0].functionError)
        return {error: err.response.errors[0].functionError}
      }
    },
    updatePayoutAccount: async function(payoutAccount){
      try {
        return await client.request(`
          mutation($payoutAccount:String){updatePayoutAccount(payoutAccount:$payoutAccount){payoutAccount}}
        `,{payoutAccount})
      } catch (err) {
        console.error(err.response.errors[0].functionError)
        return {error: err.response.errors[0].functionError}
      }
    },
    login: async function (formData) {
      console.log(formData)
      try {
        var result = (await client.request(m.auth.authenticateUser(), formData)).authenticateUser
        console.log(result)

        setupClient(result.token)

        window.localStorage.setItem('token', result.token)
        window.localStorage.setItem('id', result.id)

        return result
      }
      catch (err) {
        console.error(err.response.errors[0].functionError)
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
        console.log('formData', formData)
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
        console.error(err.response)
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
      try{
        var result = (await client.request(q.user.get(), { userId })).User
        // console.log('get user', result)
        if (window.local) window.local.thisUser = result
        events.emit('thisUser', result)
        return result
      }catch(error){
        console.error('gerUserError')
        console.log(error)
        // Promise.reject(error)
        return null
      }

    },
    getByUsername: async function (username) {
      try {
        var result = (await client.request(q.user.getByUsername(), { username })).User
        return result
      } catch (error) {
        console.error(error)
        // Promise.reject(error)
        return null
      }

    },
    checkValidUsername: async function (username) {
      var result = (await client.request(q.user.checkUsername(), { username }).catch(console.error)).User
      if (result) {
        return true
      }
      else return false
    },
    updateProfile: async function (params) {
      var result = await client.request(m.user.updateProfile(), params).catch(console.error)
      return result
    }
  },
  device: {
    get: async function (deviceId) {
      var result = (await client.request(q.device.get(), {
        deviceId
      }).catch(console.error)).Device
      if (!result) return null
      // console.log(result)
      // location.reload()
      // events.emit('thisUser', result)
      return result
    },
    getByCpid: async function (cpid) {
      try {
        var result = await client.request(q.device.getByCpid(), {cpid})
        if (result.Device) return result.Device
        else return 'none'
      } catch (error) {
        console.error(error)
        return null
      }

      if (!result.Device) return null
      console.log('GOT CPID DEVICE',result)
      return result.Device
    },
    updateStatus: async function (device) {
      // console.log('apiDevice', device)
      var result = (await client.request(m.device.updateStatus(), device).catch(console.error)).updateDevice
      if (!result) return null
      // console.log(result)
      // location.reload()
      // events.emit('thisUser', result)
      return result
    },
    updateWcgid: async function (device) {
      // console.log('UPDATE WCGID',device)
      var result = (await client.request(m.device.updateWcgid(), device).catch(console.error)).updateDevice

      return result
    },
    create: async function (deviceData) {
      var result = await client.request(m.device.create(), deviceData).catch(console.error)
      console.log(JSON.stringify(result))
      return result.createDevice
    },
    add: async function (deviceData){
      try {
        var result = (await client.request(m.device.add(),deviceData)).addUserDevice2
        return result
      } catch (error) {
        return null
      }
    },
    remove: async function(deviceId){
      try {
        var result = (await client.request(`mutation($deviceId:ID!){deleteDevice(id:$deviceId){id}}`,
        {deviceId}))
        // console.log(result)
        return result
      } catch (error) {
        return Promise.reject(error)
      }
    }
  },
  leaderboard: {
    global: async function (teamId) {
      return (await client.request(q.leaderboard.global(), { teamId }).catch(console.error)).allUsers
    },
    team: async function (teamId) {
      return (await client.request(q.leaderboard.team(), { teamId }).catch(console.error)).allUsers
    },
    teams: async function (teamId) {
      return (await client.request(q.leaderboard.teams()).catch(console.error)).allTeams
    }
  },
  team: {
    getByName: async function (teamName) {
      return (await client.request(q.team.getByName(), { teamName }).catch(console.error)).Team
    }
  }
}

export default api
