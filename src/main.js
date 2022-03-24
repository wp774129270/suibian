import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/global.css'
import axios from 'axios'
import './plugins/element.js'
import TreeTable from 'vue-table-with-tree-grid'
import Bread from './components/bread/bread.vue'
// import VueQuillEditor from 'vue-quill-editor'
// import 'quill/dist/quill.core.css' 
// import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css' 

// import { Form, FormItem, Input, Button } from 'element-ui'
// 配置请求的根路径
axios.defaults.baseURL = 'https://lianghj.top:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token') 
  return config
})
Vue.prototype.$http = axios

// Vue.component('quill-editor', VueQuillEditor)
Vue.component('tree-table', TreeTable)

// 面包屑
Vue.component('bread', Bread)
// 全局过滤器
Vue.filter('dataFormat', function (originVal) {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  // yyyy-mm-dd hh:mm:ss
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
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