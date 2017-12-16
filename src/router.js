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
    { path: '/:username?', component: load('Index'), name: 'Index' },
    { path: '/u/:username?', component: load('User'), name: 'User' },
    { path: '*', component: load('Error404') } // Not found
  ]
})
