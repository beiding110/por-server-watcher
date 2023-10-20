import dateFormat from './dateFormat.js';

export default {
    install(Vue) {
        Vue.filter('dateFormat', dateFormat);
    },
};
