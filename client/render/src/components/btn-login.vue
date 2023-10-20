<template>
    <div
        v-if="$route.path !== '/login'"
        class="btn-login"
        @click="clickHandler"
    >
        登录
    </div>
</template>

<script>
export default {
    methods: {
        clickHandler() {
            this.$router.push('/login');
        },
    },
};
</script>

<style lang="scss" scoped>
.btn-login {
    display: inline-block;
    font-size: 16px;
    padding: 8px 12px;
    line-height: 1em;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.2);
    margin-right: 18px;
    transition: all 0.1s;

    &:hover {
        background: rgba(255, 255, 255, 0.3);
    }
}
</style>