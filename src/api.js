import EventEmitter from 'event-emitter'
import Axios from 'axios'
var events = new EventEmitter()

var baseURL = getEndpoint()
var axios = new Axios.create({ baseURL })
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

var getApi = async () => {
  try {
    const api = (await axios.post('util/getapi')).data
    return api
  } catch (error) {
    console.log(error.message)
    return {}
  }
}
var api = {
  axios,
  events,
  setupAxios,
  localUser () {
    if(JSON.parse(window.localStorage.getItem('rememberMe'))) {
      const localToken = window.localStorage.getItem('token')
      const localId = window.localStorage.getItem('id')
      if(localToken && localId) {
        setupAxios(localToken)
        return localId
      } else return false
    } else return false
  },
  logout () {
    localStorage.clear()
  },
  init () {
    return getApi().then(data => {
      var apiFunctions = {}
      data.forEach((el) => {
        apiFunctions[el] = async (vars) => {
          try {
            const result = (await axios.post(el, vars)).data
            if(!result) return false
            if(!result.error) {
              return result
            } else {
              console.error(result.error)
              return false
            }
          } catch (error) {
            console.error(error)
          }
        }
      })
      api = Object.assign(api, apiFunctions)
      api.events.emit('apiReady')
      // console.log('final API',api)
      return api
    }).catch(alert)
  }
};

function getEndpoint () {
  // return 'https://api.boid.com'
  if(process.env.NODE_ENV === 'development') return 'http://localhost:3000'
  else return 'https://api.boid.com'
}

function setupAxios (token) {
  if(token) {
    axios = Axios.create({
      baseURL,
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
  } else {
    axios = new Axios.create({ baseURL })
  }
  console.log('finished setting up axios', token)
}
setupAxios()

export default api