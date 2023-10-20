<template>
    <div class="page-form">
        <el-form
            ref="form"
            :model="form"
        >
            <el-form-item
                prop="name"
                required
            >
                <el-input
                    v-model="form.name"
                    placeholder="*名称"
                ></el-input>
            </el-form-item>

            <el-form-item
                prop="url"
                required
            >
                <div class="input-btn-con">
                    <div class="input-con">
                        <el-input
                        v-model="form.url"
                        placeholder="*校验地址"
                        ></el-input>
                    </div>

                    <div class="btn-con">
                        <el-button 
                            slot="append" 
                            :icon="testBtnIcon"
                            :type="testBtnType"
                            @click="testHandler"
                        >
                            {{testBtnText}}
                        </el-button>
                    </div>
                </div>
            </el-form-item>

            <el-form-item prop="keys">
                <el-select
                class="block-input"
                v-model="form.keys"
                multiple
                filterable
                allow-create
                placeholder="标签">
                    <el-option
                        v-for="(key, index) in keyList"
                        :key="index"
                        :label="key"
                        :value="key"
                    ></el-option>
                </el-select>
            </el-form-item>

            <el-form-item>
                <div class="btn-con">
                    <div class="btn">
                        <el-button
                            type="success"
                            class="btn-submit"
                            @click="submitHandler"
                        >提交</el-button>
                    </div>

                    <div class="btn">
                        <el-button
                            class="btn-submit"
                            @click="backHandler"
                        >返回</el-button>
                    </div>
                </div>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { $post, $get } from '@/js/request.js';

export default {
    data() {
        return {
            form: {
                name: '',
                url: '',
                keys: [],
            },

            testBtnText: '测试',
            testBtnIcon: 'el-icon-question',
            testBtnType: '',

            keyList: ['前端', '后端', '静态资源', '服务端', 'nginx', '接口'],
        };
    },
    methods: {
        submitHandler() {
            this.$refs.form.validate((valid) => {
                if (!valid) {
                    return;
                }

                this.form.keys = this.form.keys.join(',');

                $post('/watcher/add', this.form, (data) => {
                    this.backHandler();
                });
            });
        },
        backHandler() {
            this.$router.go(-1);
        },
        queryDetail() {
            const { _id } = this.$route.query;

            if (!_id) {
                return;
            }

            $get(
                '/watcher/detail',
                {
                    _id,
                },
                (data) => {
                    data.keys = data.keys.split(',');

                    this.form = data;
                }
            );
        },
        testHandler() {
            this.testBtnText = '';
            this.testBtnIcon = 'el-icon-loading';
            this.testBtnType = 'info';
            
            try {
                window.electronApi.request({
                    url: this.form.url,
                    success: () => {
                        this.testBtnText = '可用';
                        this.testBtnIcon = 'el-icon-success';
                        this.testBtnType = 'success';
                    },
                    error: () => {
                        this.testBtnText = '异常';
                        this.testBtnIcon = 'el-icon-error';
                        this.testBtnType = 'warning';
                    },
                });
            } catch(e) {
                this.testBtnText = '失败';
                this.testBtnIcon = 'el-icon-error';
                this.testBtnType = 'danger';
            }
        },
    },
    mounted() {
        this.queryDetail();
    },
};
</script>

<style lang="scss" scoped>
.page-form {
    padding: 1em;

    .btn-submit {
        width: 100%;
    }

    .input-btn-con{
        display: flex;

        .input-con{
            flex: 1;
        }

        .btn-con{
            margin-left: 10px;
        }
    }

    .btn-con{
        display: flex;

        .btn{
            flex: 1;

            & + .btn{
                margin-left: 10px;
            }
        }
    }

    .block-input{
        width: 100%;
    }
}
</style>