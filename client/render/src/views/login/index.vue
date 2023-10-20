<template>
    <div class="page-login">
        <div class="card">
            <el-form
                ref="form"
                :model="form"
            >
                <el-form-item
                    prop="loginname"
                    required
                >
                    <el-input
                        v-model="form.loginname"
                        placeholder="用户名"
                    ></el-input>
                </el-form-item>

                <el-form-item
                    prop="pwd"
                    required
                >
                    <el-input
                        v-model="form.pwd"
                        placeholder="密码"
                        type="password"
                    ></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button
                        type="success"
                        class="btn-login"
                        @click="loginHandler"
                    >登录</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            form: {
                loginname: '',
                pwd: '',
            },
        };
    },
    methods: {
        loginHandler() {
            this.$refs.form.validate((valid) => {
                if (!valid) {
                    return;
                }

                this.$store.dispatch('login', this.form);
            });
        },
    },
};
</script>

<style lang="scss" scoped>
@import '@/css/var.scss';

.page-login {
    height: 100%;
    background-color: $primaryColor9;

    .card {
        padding: 20px;

        .btn-login {
            width: 100%;
        }
    }
}
</style>