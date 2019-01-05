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
    { path: '/desktop/', component: load('Device'), name: 'Desktop' },
    { path: '/local', component: load('Bus'), name: 'Local' },
    { path: '/auth/', component: load('Auth'), name: 'Auth' },
    { path: '/scatter/', component: load('Scatter'), name: 'Scatter' },
    { path: '/changeaccount/:requestId', component: load('ChangeAccount'), name: 'ChangeAccount' },
    { path: '*', component: load('Index') }
  ]
})
