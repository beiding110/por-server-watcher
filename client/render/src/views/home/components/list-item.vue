<template>
    <div class="item">
        <div class="head">
            <div class="left">
                <div
                    class="state"
                    :class="`state-${innerData.state}`"
                ></div>
                <div class="name">
                    {{innerData.name}}
                </div>
            </div>

            <div class="right">
                <div class="lasttime">
                    {{innerData.lasttime | dateFormat}}
                </div>

                <div class="delay">
                    {{innerData.speed}}ms
                </div>
            </div>
        </div>

        <div class="body">
            <div class="left">
                {{innerData.keys}}
            </div>

            <div class="right">
                <div class="lasttime">
                    上次校验时间：{{innerData.lasttime}}
                </div>
            </div>
        </div>

        <div class="footer">
            <div class="left btns">
                <el-button
                    class="btn"
                    size="mini"
                    type="primary"
                    icon="el-icon-edit"
                    circle
                    @click="editHandler"
                ></el-button>

                <el-button
                    class="btn"
                    size="mini"
                    type="danger"
                    icon="el-icon-delete"
                    circle
                    @click="delHandler"
                ></el-button>
            </div>

            <div class="right">
                <el-button
                    class="btn"
                    size="mini"
                    type="success"
                    icon="el-icon-refresh"
                    circle
                    @click="queryHandler"
                ></el-button>
            </div>
        </div>
    </div>
</template>


<script>
import { $ajax, $post } from '@/js/request.js';
import app from '@/js/app-node.js';

export default {
    props: {
        data: {
            type: Object,
            default: () => ({}),
        },
    },
    data() {
        return {
            innerData: {},

            timer: null,
        };
    },
    watch: {
        data: {
            handler(n) {
                this.innerData = n;
            },
            deep: true,
            immediate: true,
        },
    },
    methods: {
        editHandler() {
            this.$router.push({
                path: '/edit',
                query: {
                    _id: this.innerData._id,
                },
            });
        },
        delHandler() {
            $post(
                '/watcher/del',
                {
                    _id: this.innerData._id,
                },
                (data) => {
                    this.$emit('reload');
                }
            );
        },
        queryHandler(cb) {
            try {
                clearTimeout(this.timer);
            } catch (e) {}

            const { _id } = this.innerData;

            var state = 0,
                speed = 0;

            new app.Chain()
                .link((next) => {
                    var startTime = new Date().getTime(),
                        endTime;

                    try {
                        window.electronApi.request({
                            url: this.innerData.url,
                            success: () => {
                                state = 1;
                            },
                            error: () => {
                                state = 2;

                                window.electronApi.notify(`异常项名称：${this.innerData.name}`, '服务校验异常');
                            },
                            complete: () => {
                                endTime = new Date().getTime();
                                speed = endTime - startTime;

                                next();
                            },
                        });
                    } catch (e) {
                        state = 0;

                        next();
                    }
                })
                .link((next) => {
                    $ajax({
                        type: 'post',
                        url: '/watcher/add',
                        data: {
                            _id,
                            state,
                            lasttime: new Date().pattern('yyyy-MM-dd HH:mm:ss'),
                            speed,
                        },
                        success: (data) => {
                            this.innerData = data;
                        },
                        complete: () => {
                            setTimeout(() => {
                                this.queryHandler();
                            }, 60000);
                        },
                    });
                })
                .run();
        },
    },
    mounted() {
        this.queryHandler();
    },
};
</script>

<style lang="scss" scoped>
@import '@/css/var.scss';

.item {
    display: flex;
    flex-direction: column;
    padding: 1em;
    position: relative;

    & + .item:before {
        content: '';
        display: block;
        width: 90%;
        height: 1px;
        background: #dcdfe6;
        position: absolute;
        top: 0;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .head {
        display: flex;

        .state {
            border-radius: 50%;
            width: 1.2em;
            height: 1.2em;
            background: $infoColor;
            margin-right: 0.5em;

            &.state-0 {
                background: $infoColor;
            }

            &.state-1 {
                background: $successColor;
            }

            &.state-2 {
                background: $dangerColor;
            }
        }

        .name {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .lasttime {
            color: #909399;
        }

        .delay {
            margin-left: 0.5em;
            color: $successColor;
        }
    }

    .body {
        display: flex;
        margin-top: 10px;
        font-size: 14px;
        color: #c0c4cc;
    }

    .footer {
        display: flex;
        margin-top: 10px;
    }

    .left {
        flex: 1;
        display: flex;
        align-items: center;
    }

    .right {
        display: flex;
    }

    .btns {
        .btn {
            cursor: pointer;

            & + .btn {
                margin-left: 1em;
            }
        }
    }
}
</style>