import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/global.css'
import axios from 'axios'
import './plugins/element.js'

// import { Form, FormItem, Input, Button } from 'element-ui'
// 配置请求的根路径
axios.defaults.baseURL = 'https://lianghj.top:8888/api/private/v1/'

axios.interceptors.request.use(config => {
  console.log(config)
  return config
})
Vue.prototype.$http = axios

// Vue.use(Form)
// Vue.use(FormItem)
// Vue.use(Input)
// Vue.use(Button)

Vue.config.productionTip = false

const app = new Vue({
  router,
  render: h => h(App)
})

app.$mount('#app')
