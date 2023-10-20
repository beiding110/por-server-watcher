<template>
    <div class="nav-menu">
        <div 
        v-for="item in nav"
        :key="item.id"
        class="menu-item"
        :class="{active: item.id === activeName}"
        @click="clickHandler(item)"
        >
            {{item.name}}
        </div>
    </div>
</template>

<script>
import storage from '../js/storage.js';

const {nav} = require('../../../config/main.js');

export default {
    props: {
        select: {
            type: [Function, Boolean],
            default: false,
        }
    },
    data() {
        return {
            nav,

            activeName: nav[0].id,
        };
    },
    methods: {
        clickHandler(item) {
            if (item.meta && item.meta.login) {
                const userinfo = storage.getLocal('userinfo');

                if (userinfo) {
                    window.ipcRenderer.send('nav', item);
                } else {
                    window.ipcRenderer.send('main-view', {
                        name: 'login',
                    });
                }
                
                return;
            }

            window.ipcRenderer.send('nav', item);
        },
    },
    mounted() {
        var that = this;

        window.ipcRenderer.on('nav-done', (e, {id, url}) => {
            that.activeName = id;
            that.$emit('select', url);
        });
    },
};
</script>

<style lang="scss" scoped>
    .nav-menu{
        display: flex;
        margin-left: 2em;
        -webkit-app-region: no-drag;

        .menu-item{
            padding: 0 1em;
            position: relative;

            &:hover{
                background: rgba(0, 0, 0, .1);
            }

            &.active:after{
                content: '';
                display: block;
                width: 34%;
                height: 3px;
                background: white;
                position: absolute;
                bottom: 12px;
                left: 50%;
                transform: translateX(-50%);
            }
        }
    }
</style>