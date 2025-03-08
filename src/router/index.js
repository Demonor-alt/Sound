import { createRouter, createWebHistory, createWebHashHistory } from "vue-router"
const routes = [
    {
        path: '/',
        component: () => import("@/views/Main.vue"),
    },
    {
        path: '/login',
        component: () => import("@/views/Login.vue"),
    },
    {
        path: '/main',
        component: () => import("@/views/Main.vue"),
        redirect: '/main/discover',
        children: [
            {
                path: '/detail/:id?',
                component: () => import("@/views/bank/Detail.vue"),
            },
            {
                path: '/discover',
                component: () => import("@/views/bank/Discover.vue"),
            },
            {
                path: '/collect',
                component: () => import("@/views/bank/Collect.vue"),
            },
            {
                path: '/mybank',
                component: () => import("@/views/bank/MyBank.vue"),
            },
            {
                path: '/createbank/:id?',
                component: () => import("@/views/bank/CreateSound.vue"),
            },
            {
                path: '/explanation/:id?',
                component: () => import("@/views/Explanation.vue"),
            },
            {
                path: '/teach',
                component: () => import("@/views/teach/Teach.vue"),
            },
            {
                path: '/teach/step1',
                component: () => import("@/views/teach/Step1.vue"),
            },
            {
                path: '/teach/step2',
                component: () => import("@/views/teach/Step2.vue"),
            },
            {
                path: '/teach/step3',
                component: () => import("@/views/teach/Step3.vue"),
            },
            {
                path: '/teach/shop',
                component: () => import("@/views/teach/Shop.vue"),
            },
            {
                path: '/teach/practise',
                component: () => import("@/views/teach/Practise.vue"),
            },
            {
                path: '/courseware',
                component: () => import("@/views/Courseware.vue"),
            },
            {
                path: '/teacher',
                component: () => import("@/views/Teacher.vue"),
            },
            {
                path: '/voice',
                component: () => import("@/views/Voice.vue"),
            },
        ]

    },

]
const router = createRouter({
    history: createWebHashHistory("/Sound"),
    //history: createWebHashHistory(),
    routes: routes
})
// import { ElMessage } from 'element-plus';
// router.beforeEach((to, from, next) => {
//     if (to.path === '/' || to.path === '/login') {
//         next();
//     } else {
//         const isLoggedIn = localStorage.getItem('user');
//         if (!isLoggedIn) {
//             ElMessage.error('请先登录！');
//             next('/login');
//         } else {
//             next();
//         }
//     }
// });
export default router;