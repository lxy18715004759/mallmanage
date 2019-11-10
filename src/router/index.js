import Vue from 'vue'
import Router from 'vue-router'

const Login = () =>
    import('@/views/login')
const Home = () =>
    import('@/views/home')
const User = () =>
    import('@/views/user/user')
const Rights = () =>
    import('@/views/roles/rights')
const Roles = () =>
    import('@/views/roles/roles')
const { Message } = () => 'element-ui'
const Categories = () =>
    import('@/views/goods/categories')
const Goodslist = () =>
    import('@/views/goods/goodslist')
const GoodsAdd = () =>
    import('@/views/goods/goodsadd')
const Params = () =>
    import('@/views/goods/params')
const Orders = () =>
    import('@/views/orders/orders')
const Reports = () =>
    import('@/views/reports/reports')

Vue.use(Router)

const router = new Router({
  routes: [{
    name: 'home',
    path: '/',
    component: Home,
    children: [{
      name: 'users',
      path: '/users',
      component: User
    }, {
      name: 'rights',
      path: '/rights',
      component: Rights
    }, {
      name: 'roles',
      path: '/roles',
      component: Roles
    }, {
      name: 'categories',
      path: '/categories',
      component: Categories
    }, {
      name: 'goodslist',
      path: '/goods',
      component: Goodslist
    }, {
      name: 'goodsadd',
      path: '/goodsadd',
      component: GoodsAdd
    }, {
      name: 'params',
      path: '/params',
      component: Params
    }, {
      name: 'orders',
      path: 'orders',
      component: Orders
    }, {
      name: 'reports',
      path: 'reports',
      component: Reports
    }]
  },
  {
    name: 'login',
    path: '/login',
    component: Login
  }
  ]
})
// 路由的前置守卫
// router.beforeEach((to, from, next) => {
//   // console.log(to, from)
//   if (to.name === 'login') {
//     next()
//   } else {
//     const token = sessionStorage.getItem('token')
//     if (!token) {
//       router.push({
//         'name': 'login'
//       })
//       Message.warning('请先登录')
//       return
//     }
//     next()
//   }
// })
export default router
