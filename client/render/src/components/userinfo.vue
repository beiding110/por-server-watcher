<template>
    <div class="userinfo">
        <div class="name">
            {{reName}}
        </div>

        <div
            class="btn"
            @click="clickHandler"
        >
            <i class="el-icon-switch-button"></i>
        </div>
    </div>
</template>

<script>
export default {
    computed: {
        reName() {
            return this.$store.state.userinfo.user.truename;
        },
    },
    methods: {
        clickHandler() {
            this.$store.dispatch('logout');
        },
    },
};
</script>

<style lang="scss" scoped>
.userinfo {
    display: inline-block;
    margin-right: 18px;

    .name {
        display: inline-block;
        font-size: 16px;
        cursor: pointer;
    }

    .btn {
        display: inline-block;
        font-size: 12px;
        margin-left: 10px;
        cursor: pointer;

        &:hover {
            font-weight: bold;
        }
    }
}
</style>