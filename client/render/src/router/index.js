import Vue from 'vue';
import Router from 'vue-router';

import { getToken } from '@/js/token.js';

Vue.use(Router);

var router = new Router({
    routes: [
        {
            path: `/`,
            component: () => import('@/layout/panel.vue'),
            children: [
                {
                    path: 'login',
                    component: () => import('@/views/login/index.vue'),
                },
                {
                    path: 'home',
                    alias: '/',
                    component: () => import('@/views/home/index.vue'),
                },
                {
                    path: 'edit',
                    component: () => import('@/views/home/form.vue'),
                },
            ],
        },
    ],
});

router.beforeEach((to, from, next) => {
    const token = getToken();

    if (!token && to.path !== '/login') {
        next('/login');

        return;
    }

    next();
});

export default router;
