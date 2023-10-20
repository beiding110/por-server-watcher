<template>
    <div class="search">
        <input v-model="value" placeholder="请输入搜索内容"/>

        <div class="btn" @click="searchHandler"></div>
    </div>
</template>

<script>
import nav from '../config/nav.js';

export default {
    data() {
        return {
            value: '',
        };
    },
    methods: {
        searchHandler() {
            if (this.value) {
                window.ipcRenderer.send('nav', {
                    id: nav[0].id,
                    query: {
                        key: this.value,
                    },
                    hash: 'gonggao'
                });
            }
        },
    },
};
</script>

<style lang="scss" scoped>
    .search{
        display: inline-block;
        width: 238px;
        box-sizing: border-box;
        background: rgba(255, 255, 255, .2);
        height: 34px;
        line-height: 34px;
        border-radius: 17px;
        padding-left: 10px;
        margin-right: 26px;

        input{
            display: inline-block;
            width: calc(100% - 35px);
            height: 100%;
            background: none;
            border: none;
            outline: none;
            color: white;

            &::-webkit-input-placeholder{
                color: rgba(255, 255, 255, .7);
            }
        }

        .btn{
            display: inline-block;
            width: 16px;
            position: relative;

            &:before{
                content: '';
                display: block;
                width: 16px;
                height: 16px;
                box-sizing: border-box;
                border: 2px solid white;
                border-radius: 50%;
                position: relative;
            }

            &:after{
                content: '';
                display: block;
                position: absolute;
                width: 2px;
                height: 4px;
                background: white;
                right: -0;
                bottom: -0;
                transform: rotate(-45deg);
                border-radius: 1px;
            }
        }
    }
</style>