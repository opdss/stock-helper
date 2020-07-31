import { axios } from 'src/boot/axios'

//根据关键词搜索股票
export const searchStock = kw => {
  return axios({
    url: "https://smartbox.gtimg.cn/s3/?q=" + kw + "&t=all&cb=cb_" + (new Date()).valueOf(),
    method: "get"
  });
}

export const getDayData = (exCode) => {
  // http://data.gtimg.cn/flashdata/hushen/latest/daily/sz000002.js?maxage=43201
  return axios({
    url: "http://data.gtimg.cn/flashdata/hushen/latest/daily/" + exCode + ".js?maxage=43201&cb=cb_" + (new Date()).valueOf(),
    method: "get"
  })
}

//获取股票数据
export const getStocksInfo = (excodes) => {
  let api = 'http://sqt.gtimg.cn/utf8/?_t=' + (new Date()).valueOf() + '&q='
  return axios({
    url: api + excodes.join(','),
    method: "get"
  });
}