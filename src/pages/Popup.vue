<style scoped>
.drag-item {
  border: 1px solid white;
}
.ghost {
  opacity: 0.7;
  border: 1px dashed #666;
}
.bg {
  color: #ccc;
  font-size: 18px;
}
font {
  font-weight: bold;
}
</style>
<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="flex">
        <div class="q-mx-md q-mb-xs q-mt-md" style="width:480px;height:360px">
          <q-input v-model="kw" class="q-mb-xs" label="股票名称/代码" dense>
            <template v-slot:append>
              <q-icon name="search" />
            </template>
            <q-menu fit v-model="searchList.length !== 0" no-parent-event no-focus>
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
          <q-list dense>
            <q-item dense>
              <q-item-section>
                <q-item-label>股票名</q-item-label>
              </q-item-section>

              <q-item-section @click="sortBy('price')">
                <q-item-label>
                  最新价
                  <span
                    v-show="sortByName == 'price'"
                  >{{sortByVal == 1 ? '↓' : (sortByVal == -1 ? "↑" :"")}}</span>
                </q-item-label>
              </q-item-section>

              <q-item-section @click="sortBy('rangeRate')">
                <q-item-label>
                  涨跌幅
                  <span
                    v-show="sortByName == 'rangeRate'"
                  >{{sortByVal == 1 ? '↓' : (sortByVal == -1 ? "↑" :"")}}</span>
                </q-item-label>
              </q-item-section>

              <q-item-section @click="sortBy('ripplePrice')">
                <q-item-label>
                  涨跌额
                  <span
                    v-show="sortByName == 'ripplePrice'"
                  >{{sortByVal == 1 ? '↓' : (sortByVal == -1 ? "↑" :"")}}</span>
                </q-item-label>
              </q-item-section>

              <q-item-section @click="sortBy('turnoverRate')">
                <q-item-label>
                  换手率
                  <span
                    v-show="sortByName == 'turnoverRate'"
                  >{{sortByVal == 1 ? '↓' : (sortByVal == -1 ? "↑" :"")}}</span>
                </q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-item-label>操作</q-item-label>
              </q-item-section>
            </q-item>
            <draggable v-model="dataList" group="people" v-bind="dragOptions" @end="dragEnd">
              <StockItem
                v-for="(item,i) in dataList"
                v-bind:key="i"
                class="drag-item"
                :item="item"
                @toTop="toTop(i)"
                @remove="del(i)"
                @setBadge="setBadge(i)"
                @cancelBadge="cancelBadge(i)"
                @notice="notice(i)"
                @kline="kline(i)"
              />
            </draggable>
          </q-list>
          <div class="q-ma-md" v-show="dataList.length == 0">
            <p class="bg">股市有风险，投资需谨慎!!!</p>
            <p class="bg">任意关键字搜索股票，单击添加到关注列表</p>
            <p class="bg">股票列表可以拖动进行排序，可以点击表头排序</p>
            <p class="bg">列表双击将置顶，且会将该股票涨幅显示到图标上</p>
            <p class="bg">数据来自第三方，只供学习使用</p>
            <p class="bg">作者：阿新 [opdss@qq.com]</p>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import * as service from "src/libraries/service";
import * as utils from "src/libraries/utils";
import draggable from "vuedraggable";
import StockItem from "src/components/StockItem";
const STOCK_KEY = "stocks";
const BADGE_KEY = "badge";
export default {
  name: "Popup",
  components: {
    draggable,
    StockItem,
  },
  data() {
    return {
      kw: "",
      dataList: [],
      searchList: [],
      timer: null,
      sortByName: null,
      sortByVal: null,
    };
  },
  methods: {
    //添加
    add(info) {
      let idx = _.findIndex(this.dataList, function (o) {
        return o.exCode == info.exCode;
      });
      if (idx == -1) {
        let data = this.dataList;
        data.unshift({
          exCode: info.exCode,
          isBadge: false,
          notice: {},
          info: info,
        });
        this.saveData(data, "添加成功");
      } else {
        if (idx > 0) {
          this.setToTop(this.dataList, idx);
        }
      }
      this.sortByName = null;
      this.kw = "";
      this.searchList = [];
    },
    //删除
    del(idx) {
      let data = this.dataList;
      data.splice(idx, 1);
      this.saveData(data, "移除成功");
    },
    notice(idx) {
      utils.success("开发中，稍后开放");
    },
    kline(idx) {
      utils.success("开发中，稍后开放");
    },
    //置顶
    toTop(idx) {
      this.sortByName = null;
      this.setToTop(this.dataList, idx, "置顶成功");
    },
    //设置角标
    setBadge(idx) {
      let data = this.dataList;
      _.each(data, (val) => {
        val.isBadge = false;
      });
      data[idx].isBadge = true;
      this.saveData(data, "设置角标成功");
    },
    //取消角标
    cancelBadge(idx) {
      let data = this.dataList;
      _.each(data, (val) => {
        val.isBadge = false;
      });
      this.saveData(data, "取消角标成功");
    },
    sortBy(sortName) {
      if (sortName == this.sortByName) {
        this.sortByVal = this.sortByVal == 1 ? -1 : 1;
      } else {
        this.sortByName = sortName;
        this.sortByVal = 1;
      }
      this.dataList = _.sortBy(this.dataList, [
        (o) => {
          return this.sortByVal == 1
            ? -o.info[this.sortByName]
            : o.info[this.sortByName];
        },
      ]);
    },
    //拖动结束
    dragEnd() {
      this.sortByName = null;
    },
    setToTop(data, idx, msg) {
      if (idx !== 0) {
        let obj = data[idx];
        data.splice(idx, 1);
        data.unshift(obj);
        this.saveData(data, msg);
      }
    },
    saveData(data, msg) {
      utils.storageSet(STOCK_KEY, data).then(() => {
        this.dataList = data;
        this.$q.bex.send("stock.update", this.dataList);
        if (msg) {
          utils.success(msg);
        }
      });
    },
    //初始化数据数据
    initData() {
      utils.storageGet(STOCK_KEY).then((data) => {
        this.dataList = data || [];
        this.timer = setInterval(() => {
          utils
            .getStocksInfo(
              this.dataList.map((d) => d.exCode),
              true
            )
            .then((data) => {
              let dd = this.dataList;
              _.each(dd, (val) => {
                val.info = data[val.exCode];
                //val.info["price"] = _.random(100, 999);
              });
              if (this.sortByName) {
                dd = _.sortBy(dd, [
                  (o) => {
                    return this.sortByVal == 1
                      ? -o.info[this.sortByName]
                      : o.info[this.sortByName];
                  },
                ]);
              }
              this.dataList = dd;
            });
        }, 1500);
      });
    },
  },
  //http://www.360doc.com/content/17/0307/15/1489589_634734789.shtml
  watch: {
    kw(v) {
      if (v) {
        utils.getSearchStocks(v).then((data) => {
          this.searchList = data;
        });
      } else {
        this.searchList = [];
      }
    },
  },

  computed: {
    dragOptions() {
      return {
        animation: 300,
        disabled: false,
        ghostClass: "ghost",
      };
    },
  },

  created() {
    this.initData();
  },

  beforeDestroy() {
    this.timer = null;
    utils.storageSet(STOCK_KEY, this.dataList);
  },
};
</script>
