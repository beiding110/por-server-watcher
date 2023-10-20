import Vue from 'vue';
import App from './App.vue';

import router from './router';
import store from './store';

import filters from './filters';
Vue.use(filters);

import '@/js/app-proto.js';

import '@/css/element-customize.scss';
import ElementUI from 'element-ui';
Vue.use(ElementUI);

//图标
import '@/css/iconfont.scss';
//清除样式
import '@/css/zh-common.scss';

Vue.config.productionTip = false;

new Vue({
    render: (h) => h(App),
    router,
    store,
}).$mount('#app');
