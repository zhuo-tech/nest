<template>
<div class="webapp">
    <basic-container>
        <avue-form-design :options="option" @submit="handleSubmit"></avue-form-design>
    </basic-container>
</div>
</template>

<script>

export default {
    data() {
        return {
            option: {
                column: [],
            },
        }
    },
    created() {

    },
    methods: {
        handleSubmit(json) {

        },
    },
}
</script>
<style lang="scss">
.webapp {
    background-color: #fff;
    position: relative;
    width: 100%;
    height: 100%;

    .form-designer {
        height: 800px;
        overflow-y: scroll;
    }

    .form-designer .widget-config-container .el-tabs__header {
        position: relative;
    }
}
</style>
