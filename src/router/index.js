import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Page from '../components/Page.vue'
import Home from '../components/Home.vue'
Vue.use(VueRouter)

const router = new VueRouter({
  routes: [{
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/page',
      component: Page
    },
    {
      path: '/home',
      component: Home
    }

  ]
})
// 挂载路由导航守卫
router.beforeEach((to, form, next) => {
  // to表示将要访问的路径
  // form代表从哪个路径跳转过来
  // next是一个函数，表示放行
  //  next（）放行 next（'/login'）强制跳转
  if (to.path == '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})


export default router