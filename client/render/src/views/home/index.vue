<template>
    <div class="page-home">
        <div
            class="btn-add"
            @click="addHandler"
        >
            <i class="el-icon-plus"></i>
        </div>

        <div class="list">
            <template v-for="(item, index) in tableData">
                <ListItem
                    :key="index"
                    :data="tableData[index]"
                    @reload="queryData"
                ></ListItem>
            </template>
        </div>
    </div>
</template>

<script>
import { $get } from '@/js/request.js';

import ListItem from './components/list-item.vue';

export default {
    components: {
        ListItem,
    },
    data() {
        return {
            tableData: [],
        };
    },
    methods: {
        addHandler() {
            this.$router.push('/edit');
        },
        queryData() {
            $get('/watcher/list', (data) => {
                this.tableData = data;
            });
        },
    },
    mounted() {
        this.queryData();
    },
};
</script>

<style lang="scss" scoped>
@import '@/css/var.scss';

.page-home {
    height: 100%;

    .list {
        height: 100%;
        display: flex;
        flex-direction: column;
        overflow: auto;
    }

    .btn-add {
        width: 3em;
        height: 3em;
        font-size: 16px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: $successColor;
        color: white;
        border-radius: 50%;
        position: absolute;
        right: 1em;
        bottom: 1em;
        cursor: pointer;
    }
}
</style>