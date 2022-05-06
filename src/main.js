import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '../src/assets/css/globalCss.css';
import axios from 'axios';

Vue.use(ElementUI);
Vue.config.productionTip = false
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
    // 设置axios拦截器  目的：让那些需要权限的api接口可以调用成功
axios.interceptors.request.use(config => {
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
})
Vue.prototype.$http = axios

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')