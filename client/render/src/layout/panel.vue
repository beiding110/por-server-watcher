<template>
    <div class="layout-panel">
        <header class="head">
            <div class="container">
                <div class="icon">
                    <img
                        src="static/logo.png"
                        alt=""
                    >

                    <!-- <div class="title">标题</div> -->
                </div>
            </div>

            <div class="btns">
                <userinfo
                    key="user"
                    v-if="userinfo"
                ></userinfo>

                <btn-login
                    key="btn"
                    v-if="!userinfo"
                ></btn-login>

                <div
                    class="btn-item minisize"
                    @click="minisizeWin"
                >
                    <icon-mini></icon-mini>
                </div>

                <!-- <div
                    class="btn-item"
                    @click="triggerSize"
                >
                    <icon-max v-if="!isMax"></icon-max>
                    <icon-resize v-if="isMax"></icon-resize>
                </div> -->

                <div
                    class="btn-item close"
                    @click="closeWin"
                >
                    <icon-close></icon-close>
                </div>
            </div>
        </header>

        <div class="body">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
import BtnLogin from '@/components/btn-login.vue';
import Userinfo from '@/components/userinfo.vue';

import IconMini from '@/components/icon/minisize.vue';
import IconClose from '@/components/icon/close.vue';
import IconMax from '@/components/icon/maxsize.vue';
import IconResize from '@/components/icon/resize.vue';

import { getToken } from '@/js/token.js';

export default {
    name: 'App',
    components: {
        BtnLogin,
        Userinfo,

        IconMini,
        IconMax,
        IconClose,
        IconResize,
    },
    data() {
        return {
            isMax: false,
        };
    },
    computed: {
        userinfo() {
            return this.$store.state.userinfo.user._id;
        },
    },
    methods: {
        minisizeWin() {
            window.remote.getCurrentWindow().minimize();
        },
        triggerSize() {
            const win = window.remote.getCurrentWindow(),
                state = win.isMaximized();

            if (state) {
                win.restore();
            } else {
                win.maximize();
            }
        },
        closeWin() {
            window.remote.getCurrentWindow().close();
        },
    },
    mounted() {
        window.addEventListener('online', () => {
            alert('网络畅通');

            let wb = document.querySelector('#view');
            wb.reload();
        });

        window.addEventListener('offline', () => {
            alert('网络连接失败，请保证使用期间网络连接状态畅通');
        });

        var token = getToken();

        if (token) {
            this.$store.dispatch('queryUserInfo');
        }

        if (!window.ipcRenderer) {
            return;
        }

        window.ipcRenderer.on('before-close-done', (e) => {
            window.remote.getCurrentWindow().close();
        });

        window.ipcRenderer.on('maximize', (e) => {
            this.isMax = true;
        });

        window.ipcRenderer.on('unmaximize', (e) => {
            this.isMax = false;
        });
    },
};
</script>

<style lang="scss" scoped>
@import '@/css/var.scss';

$headHeight: 60px;
$textColor: white;

.layout-panel {
    height: 100%;
    display: flex;
    flex-direction: column;

    .head {
        height: $headHeight;
        line-height: $headHeight;
        display: flex;
        padding-left: 10px;
        cursor: default;
        background: $primaryColor;
        color: $textColor;
        overflow: hidden;

        .container {
            display: flex;
            flex: 1;
            -webkit-app-region: drag;
            font-size: 13px;

            .icon {
                display: flex;
                align-items: center;
                justify-items: center;

                img {
                    height: 20px;
                    margin-right: 4px;
                }

                .title {
                }
            }

            .menu {
            }
        }

        .btns {
            .btn-item {
                display: inline-block;
                padding: 0 0.8em;
                transition: all 0.1s;
                font-size: 14px;

                &:hover {
                    color: white;
                    background: rgba(0, 0, 0, 0.1);
                }

                &.close:hover {
                    background: red;
                }
            }
        }
    }

    .body {
        flex: 1;
        overflow: hidden;

        #view {
            display: inline-flex;
            width: 100%;
            height: 100%;
        }
    }
}
</style>
