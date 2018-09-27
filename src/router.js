import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

function load (component) {
  return () => import(`@/${component}.vue`)
}

export default new VueRouter({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),

  routes: [
    { path: '/', component: load('Index'), name: 'Index' },
    { path: '/confirmPayoutAccount/:requestId/:accountName', component: load('Index'), name:'confirmPayoutAccount'},
    { path: '/u/:username?', component: load('User'), name: 'User' },
    { path: '/t/:teamname?', component: load('Team'), name: 'Team' },
    { path: '/leaderboards/', component: load('Leaderboards'), name: 'Leaderboards' },
    { path: '/device/', component: load('Device'), name: 'Device' },
    { path: '/device2/', component: load('Device'), name: 'Device2' },
    { path: '/device3/', component: load('Device'), name: 'Device3' },
    { path: '/device4/', component: load('Device'), name: 'Device4' },
    { path: '/device5/', component: load('Device'), name: 'Device5' },
    { path: '/device6/', component: load('Device'), name: 'Device6' },
    { path: '/local', component: load('Bus'), name: 'Local' },
    { path: '/auth/', component: load('Auth'), name: 'Auth' },
    { path: '*', component: load('Index') } // Not found
  ]
})
