<template>
<q-input v-model="kw" class="q-mb-xs" label="股票名称/代码" dense>
    <template v-slot:append>
        <q-icon name="search" />
    </template>
    <q-menu fit v-model="showBox" no-parent-event no-focus>
        <q-list dense>
            <template v-for="(item, i) in searchList">
                <q-item v-bind:key="i" clickable @click="add(item.info)">
                    <q-item-section>{{item.code}}</q-item-section>
                    <q-item-section>{{item.name}}</q-item-section>
                    <q-item-section>{{item.no}}</q-item-section>
                </q-item>
            </template>
            <q-item>
                <q-item-section></q-item-section>
                <q-item-section side>
                    <q-btn flat dense color="primary" @click="searchList = []" label="关闭" />
                </q-item-section>
            </q-item>
        </q-list>
    </q-menu>
</q-input>
</template>

<script>
export default {
    name: "StockSearch",
    data() {
        return {
            kw: "",
            searchList: [],
        }
    },
    computed: {
        showBox() {
            return this.searchList.length !== 0
        }
    },
    methods: {
        add(info) {
            this.$emit('addStock', {
                exCode: info.exCode,
                isBadge: false,
                notice: {},
                info: info,
            })
            this.kw = "";
            this.searchList = [];
        }
    },
    watch: {
        kw(v) {
            if (v) {
                this.$utils.getSearchStocks(v).then((data) => {
                    this.searchList = data;
                });
            } else {
                this.searchList = [];
            }
        },
    },
};
</script>
