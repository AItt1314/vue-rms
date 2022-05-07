import Vue from 'vue'
import VueRouter from 'vue-router'
//导入登录组件
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/Users/Users.vue'
import rights from '../components/Rights/rights.vue'
import roles from '../components/Rights/roles.vue'
import goods from '../components/Goods/goods.vue'
import params from '../components/Goods/params.vue'
import categories from '../components/Goods/categories.vue'
import orders from '../components/Orders/orders.vue'
import reports from '../components/Reports/reports.vue'


Vue.use(VueRouter)

const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
        path: '/home',
        component: Home,
        redirect: '/welcome',
        children: [
            { path: '/welcome', component: Welcome },
            { path: '/users', component: Users },
            { path: '/rights', component: rights },
            { path: '/roles', component: roles },
            { path: '/goods', component: goods },
            { path: '/params', component: params },
            { path: '/categories', component: categories },
            { path: '/orders', component: orders },
            { path: '/reports', component: reports },
        ]
    }
]

const router = new VueRouter({
        routes
    })
    // 挂载导航守卫  router.beforeEach((to, from, next)=>{})  注to：目标路由，from：来源路由，next：放行函数
    //思路：如果用户访问的是登录页，则直接放行。如果用户访问的是其他页面，则检查是否存在token，若存在，则放行，否则跳转到登录页
router.beforeEach((to, from, next) => {
    if (to.path === '/login') {
        return next()
    } else {
        const tokenStr = window.sessionStorage.getItem('token');
        if (!tokenStr) return next('/login');
        next();
    }

})
export default router