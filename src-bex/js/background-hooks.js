// Hooks added here have a bridge allowing communication between the BEX Background Script and the BEX Content Script.
// Note: Events sent from this background script using `bridge.send` can be `listen`'d for by all client BEX bridges for this BEX

// More info: https://quasar.dev/quasar-cli/developing-browser-extensions/background-hooks

import * as utils from "src/libraries/utils";
import * as service from "src/libraries/service";
import _ from 'lodash'

const STOCK_KEY = "stocks";

var STICK_LIST = [];
var TIMER = null;

const running = () => {
  utils.storageGet(STOCK_KEY).then((data) => {
    STICK_LIST = data || [];
    console.log(data)
    TIMER = setInterval(() => {
      utils.getStocksInfo(
        STICK_LIST.map(d => d.exCode),
        true
      ).then((data) => {
        let badge = null;
        _.each(STICK_LIST, item => {
          if (item.isBadge) {
            badge = data[item.exCode].rangeRate;
          }
        })
        utils.showBadge(badge)
      });
    }, 1500);
  });
}

running();

export default function attachBackgroundHooks(bridge /* , allActiveConnections */) {
  //股票信息操作的存储，全部放在这个事件操作
  bridge.on('stock.update', event => {
    utils.storageSet(STOCK_KEY, event.data).then(() => {
      STICK_LIST = event.data;
      bridge.send(event.eventResponseKey, event.data)
    })
  })
}
