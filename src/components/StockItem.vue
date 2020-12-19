<template>
  <q-item dense clickable @dblclick="$emit('toTop')">
    <q-item-section>
      <q-item-label>
        <span v-show="!!item.isBadge" style="font-weight:bold">^</span>
        {{item.info.name}}
      </q-item-label>
      <q-item-label caption>{{item.info.code}}</q-item-label>
    </q-item-section>

    <q-item-section>
      <q-item-label :style="'color:'+item.info.color">{{item.info.price}}</q-item-label>
    </q-item-section>

    <q-item-section>
      <q-item-label :style="'color:'+item.info.color">{{item.info.rangeRate}}%</q-item-label>
    </q-item-section>

    <q-item-section>
      <q-item-label :style="'color:'+item.info.color">{{item.info.ripplePrice}}</q-item-label>
    </q-item-section>

    <q-item-section>
      <q-item-label>{{item.info.turnoverRate}}%</q-item-label>
    </q-item-section>

    <q-item-section side>
      <q-item-label>
        <!-- <q-btn size="xs" dense @click.stop="del(i)" round flat icon="delete" /> -->
        <q-btn dense @click.stop round flat icon="more_vert">
          <q-menu>
            <q-list dense style="min-width: 100px">
              <q-item
                clickable
                v-close-popup
                @click="$emit(item.isBadge ? 'cancelBadge' : 'setBadge')"
              >
                <q-item-section>{{item.isBadge ? '取消角标' : '设置角标'}}</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="$emit('notice')">
                <q-item-section>设置提醒</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="$emit('kline')">
                <q-item-section>K线图</q-item-section>
              </q-item>
              <q-item clickable v-close-popup :to="'https://baidu.com'">
                <q-item-section>股票资讯</q-item-section>
              </q-item>
              <q-separator inset class="q-my-xs" />
              <q-item clickable v-close-popup @click="$emit('remove')">
                <q-item-section>删除</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-item-label>
    </q-item-section>
    <q-menu>
      <div class="row no-wrap q-pa-md">
        <div class="column q-ma-xs" style="font-size:12px">
          <span>
            昨收:
            <font>{{item.info.closePrice}}</font>
          </span>
          <span>
            最高:
            <font>{{item.info.highPrice}}</font>
          </span>
          <span>
            成交量:
            <font>{{item.info.tradingVolume}}手</font>
          </span>
          <span>
            流通市值:
            <font>{{item.info.circulationVolume}}亿</font>
          </span>
          <span>
            换手率:
            <font>{{item.info.turnoverRate}}%</font>
          </span>
          <span>
            振 幅:
            <font>{{item.info.amplitude}}%</font>
          </span>
        </div>
        <div class="column q-ma-xs" style="font-size:12px">
          <span>
            今开:
            <font>{{item.info.openPrice}}</font>
          </span>
          <span>
            最低:
            <font>{{item.info.lowPrice}}</font>
          </span>
          <span>
            成交额:
            <font>{{item.info.businessVolume}}万</font>
          </span>
          <span>
            总市值:
            <font>{{item.info.totalValue}}亿</font>
          </span>
          <span>
            市净率:
            <font>{{item.info.pr}}</font>
          </span>
          <span>
            市盈率:
            <font>{{item.info.pe}}</font>
          </span>
        </div>

        <q-separator vertical inset class="q-mx-xs" />

        <div class="column q-ma-xs">
          <span style="font-size:12px" v-for="(p,k) in item.info.buy" v-bind:key="k">
            买{{k+1}}
            <font
              :style="'color:'+(p[0] == item.info.closePrice ? 'black' : (p[0] > item.info.closePrice ? 'red' : 'green'))"
            >{{p[0]}}</font> -
            <font>{{p[1]}}</font>
          </span>
          <span style="color:red;font-size:12px">外盘:{{item.info.outer}}</span>
        </div>

        <div class="column q-ma-xs">
          <span style="font-size:12px" v-for="(p,k) in item.info.sell" v-bind:key="k">
            卖{{k+1}}
            <font
              :style="'color:'+(p[0] == item.info.closePrice ? 'black' : (p[0] > item.info.closePrice ? 'red' : 'green'))"
            >{{p[0]}}</font> -
            <font>{{p[1]}}</font>
          </span>
          <span style="color:green;font-size:12px">内盘:{{item.info.invol}}</span>
        </div>
      </div>
    </q-menu>
  </q-item>
</template>

<script>
import { openURL } from 'quasar'
export default {
  name: "StockItem",
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  methods : {

    openUrl(url){
      openUrl(url)
    }
  }
};
</script>
