import Vue from 'vue'
import VueRouter from 'vue-router'

// 解决vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
};

Vue.use(VueRouter)
const routes = [
  { path: '*', redirect: '/home', name: '默认'},

  { path:'/home', component: ()=> import('../pages/index') },
]

export default new VueRouter({
  mode: 'hash',
  routes
})
