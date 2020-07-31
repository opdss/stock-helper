import _ from 'lodash'
import * as service from 'src/libraries/service'
import { Notify } from 'quasar'

//保存数据
export const storageSet = (key, data, sync) => {
  return new Promise((resolve, reject) => {
    if (_.isPlainObject(key)) {
      chrome.storage[sync ? 'sync' : 'local'].set(key, resolve)
    } else {
      chrome.storage[sync ? 'sync' : 'local'].set({ [key]: data }, resolve)
    }
  })
}
//获取数据
export const storageGet = (key, sync) => {
  return new Promise((resolve, reject) => {
    if (key === null || key === undefined) {
      reject(key)
    } if (_.isArray(key)) {
      chrome.storage[sync ? 'sync' : 'local'].get(key, r => {
        resolve(r)
      })
    } else {
      chrome.storage[sync ? 'sync' : 'local'].get([key], r => {
        resolve(r[key])
      })
    }
  })
}
//删除数据
export const storageRemove = (key, sync) => {
  return new Promise((resolve, reject) => {
    chrome.storage[sync ? 'sync' : 'local'].remove(key, resolve)
  })
}

//解析搜索出来的股票数据
export const parseSearchData = (str, retObj) => {
  let data = retObj ? {} : [];
  const allowType = ['GP-A', 'ZS' /*'GP', 'KJ'*/]; //只支持这几种类型
  if (str) {
    let reg = /v_hint=\"([^\"]*)\"/g
    let d = reg.exec(str)[1]
    d.split("^").forEach(element => {
      let r = element.split("~");
      //console.log(r)
      if (r.length === 5) {
        r[2] = unescape(r[2].replace(/\\u/g, "%u"));
        if (allowType.indexOf(r[4]) !== -1) {
          let exCode = r[0] + r[1]
          let obj = {
            'exCode': exCode,
            'ex': r[0],
            'code': r[1],
            'name': r[2],
            'no': r[3],
            'type': r[4]  // GP-A: a股， GP：股票， ZS：指数，ETF: ETF指数， KJ：基金，LOF:未知，FJ_CX: 未知
          };
          if (retObj) {
            data[exCode] = obj;
          } else {
            data.push(obj)
          }
        }
      }
    })
  }
  //console.log('parseSearchData', str, data)
  return data
}

//解析获取的股票信息
export const parseStocksInfo = (str, retObj) => {
  let data = retObj ? {} : [];
  if (str) {
    str.split(";").forEach(element => {
      let res = /v_(.*)=\"([^\"]*)\"/g.exec(element)
      if (res && res.length === 3 && res[2]) {
        let d = res[2].split('~')
        let ex = res[1].replace(d[2], '')
        let exCode = ex + d[2]
        let obj = {
          'exCode': exCode,
          'ex': ex,
          'code': d[2],
          'name': d[1],
          'price': Number(d[3]).toFixed(2),//当前价格
          'ripplePrice': Number(d[31]).toFixed(2), //涨跌额
          'rangeRate': Number(d[32]).toFixed(2),//涨跌幅
          'pe': d[39],//市盈率
          'pr': d[46],//市净率
          'turnoverRate': Number(d[38]).toFixed(2),//换手率
          'tradingVolume': d[36],//成交量
          'businessVolume': d[37],//成交额
          'circulationVolume': d[44],//流通市值
          'totalValue': d[45],//总市值
          'closePrice': d[4], //昨收
          'openPrice': d[5], //今开
          'highPrice': d[33], //最高
          'lowPrice': d[34], //最低
          'amplitude': d[43], //振幅
          'outer': d[7],
          'invol': d[8],
          'buy': [
            [d[9], d[10]],
            [d[11], d[12]],
            [d[13], d[14]],
            [d[15], d[16]],
            [d[17], d[18]],
          ],
          'sell': [
            [d[19], d[20]],
            [d[21], d[22]],
            [d[23], d[24]],
            [d[25], d[26]],
            [d[27], d[28]],
          ],
          'win': d[31] > 0 ? 1 : (d[31] == 0 ? 0 : -1),
          'color': d[31] > 0 ? 'red' : (d[31] == 0 ? 'black' : 'green'),
        }
        //console.log(d)
        if (retObj) {
          data[exCode] = obj
        } else {
          data.push(obj)
        }
      }
    })
  }
  //console.log(data)
  return data
}

//根据股票代码直接获取处理好的数据
export const getStocksInfo = (exCodes, retObj) => {
  return new Promise((resolve, reject) => {
    service.getStocksInfo(exCodes).then((res) => {
      let data = parseStocksInfo(res.data, retObj);
      resolve(data);
    }, reject);
  })
}

//直接获取搜索股票信息
export const getSearchStocks = (kw, retObj) => {
  return new Promise((resolve, reject) => {
    service.searchStock(kw).then((res) => {
      let data = parseSearchData(res.data, retObj);
      let exCodes = retObj ? _.keys(data) : data.map((d) => d.exCode)
      service.getStocksInfo(exCodes, true).then(res => {
        let dd = parseStocksInfo(res.data, true)
        if (retObj) {
          _.forIn(data, function (obj, key) {
            obj['info'] = dd[key] || {}
          });
        } else {
          _.each(data, obj => {
            obj['info'] = dd[obj.exCode] || {}
          })
        }
        resolve(data);
      }, reject);
    })
  })
}
//成功提示
export const success = (msg) => {
  Notify.create({
    position: "center",
    message: msg,
    timeout: 500
  });
}

//显示角标
export const showBadge = rage => {
  if (rage === null || rage === undefined) {
    chrome.browserAction.setBadgeText({ text: '' });
    return
  }
  let color = rage > 0 ? 'red' : (rage < 0 ? 'green' : 'blue');
  chrome.browserAction.setBadgeText({ text: String(Math.abs(rage).toFixed(2)) });
  chrome.browserAction.setBadgeBackgroundColor({ color: color });
}