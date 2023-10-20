import Vue from 'vue';
import router from '@/router/index';
import store from '@/store/index';

import storage from '@/js/storage.js';
import { setToken } from '@/js/token.js';

import { $post, $get } from '@/js/request.js';
import { removeToken } from '../../js/token';

export default {
    state: {
        user: storage.getSession('user') || {},
    },
    mutations: {
        setUser(state, n) {
            state.user = n;
            storage.setSession('user', n);
        },
    },
    actions: {
        login({ commit, dispatch, }, form) {
            $post(`/user/login`, form, data => {
                setToken(data._id);

                dispatch('queryUserInfo', true);

                router.push('/home');
            });
        },
        logout({ commit, dispatch, }) {
            // $post(`/user/logout`, () => {
                    
            //     commit('setUser', {});

            //     router.push('/login');
            // });

            commit('setUser', {});
            removeToken();

            router.push('/login');
        },

        /**
         * 获取用户信息
         * @param {Object} param0 store实例
         * @param {Boolean} requery 是否强制请求
         * @returns 
         */
        queryUserInfo({ state, dispatch }, requery) {
            $get(`/user/info`, data => {
                store.commit('setUser', data);
            });
        },
    },
};
