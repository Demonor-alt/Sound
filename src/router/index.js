import { createRouter, createWebHistory, createWebHashHistory } from "vue-router"
const routes = [
    {
        path: '/',
        component: () => import("@/views/bank/Discover.vue"),
    },
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
        path: '/createbank',
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
const router = createRouter({
    history: createWebHistory(),
    //history: createWebHashHistory(),
    routes: routes
})

export default router;