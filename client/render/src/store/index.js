import Vue from 'vue';
import Vuex from 'vuex';

import userinfo from './modules/userinfo.js';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {},
    getters: {},
    mutations: {},
    actions: {},
    modules: {
        userinfo,
    },
});
