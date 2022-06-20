var $moment = require('../miniprogram_npm/moment/index');
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

let isEmptyObj = (obj) => {
  for (let i in obj) {
    return false
  }
  return true
}

const moment = $moment

// 中国日期计算周几(新版周末为周日)
const weekDay = (date) => {
  if (!date) {
    return "--";
  }
  var dt = new Date(date.split("-")[0], date.split("-")[1] - 1, date = date.split("-")[2]);
  var weekDay = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  return weekDay[dt.getDay()];
}

module.exports = {
  isEmptyObj,
  formatTime,
  moment,
  weekDay
}