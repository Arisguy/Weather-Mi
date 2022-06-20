import {
  allCitiesList,
  HotCities
} from '../../common/constant';
let utils = require('../../utils/util')
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast.js';
let globalData = getApp().globalData
const key = globalData.key
Page({
  data: {
    alternative: null,
    cities: [],
    showItems: null,
    inputText: '',
    hotCities: HotCities,
  },

  cancel() {
    this.setData({
      inputText: '',
      showItems: this.data.cities,
    })
  },

  inputFilter(e) {
    let alternative = {}
    let cities = this.data.cities
    let value = e.detail.value.replace(/\s+/g, '')
    if (value.length) {
      for (let i in cities) {
        let items = cities[i]
        for (let j = 0, len = items.length; j < len; j++) {
          let item = items[j]
          if (item.name.indexOf(value) !== -1) {
            if (utils.isEmptyObj(alternative[i])) {
              alternative[i] = []
            }
            alternative[i].push(item)
          }
        }
      }
      if (utils.isEmptyObj(alternative)) {
        alternative = null
      }
      this.setData({
        alternative,
        showItems: alternative,
      })
    } else {
      this.setData({
        alternative: null,
        showItems: cities,
      })
    }
  },

  // 按照字母顺序排序
  sortHandle(areas) {
    areas = areas.sort((a, b) => {
      if (a.letter > b.letter) {
        return 1
      }
      if (a.letter < b.letter) {
        return -1
      }
      return 0
    })
    let obj = {}
    for (let i = 0, len = areas.length; i < len; i++) {
      let item = areas[i]
      delete item.districts
      let letter = item.letter
      if (!obj[letter]) {
        obj[letter] = []
      }
      obj[letter].push(item)
    }
    // 返回一个对象，直接用 wx:for 来遍历对象，index 为 key，item 为 value，item 是一个数组
    return obj
  },

  // 选中事件处理
  selectedHandle(e) {
    console.log(e);
    let pages = getCurrentPages()
    console.log(pages);
    let len = pages.length
    console.log(len);
    switch (e.currentTarget.dataset.name) {
      case 'local':
        wx.removeStorage({
          key: 'storage_location',
        })
        if (len == 10) {
          wx.redirectTo({
            url: `/pages/main/main?address=${e.currentTarget.dataset.name}`,
          })
        } else {
          wx.navigateTo({
            url: `/pages/main/main?address=${e.currentTarget.dataset.name}`,
          })
        }
        break;
      default:
        console.log(e.currentTarget.dataset.name);
        wx.setStorage({
          key: 'storage_location',
          data: e.currentTarget.dataset.name,
        })
        if (len == 10) {
          wx.redirectTo({
            url: `/pages/main/main?address=${e.currentTarget.dataset.name}`,
          })
        } else {
          wx.navigateTo({
            url: `/pages/main/main?address=${e.currentTarget.dataset.name}`,
          })
        }

        wx.request({
          url: 'https://geoapi.qweather.com/v2/city/lookup',
          method: 'GET',
          data: {
            location: e.currentTarget.dataset.name,
            key
          },
          success: (res) => {
            console.log(res, '+++当前位置');
          }
        })
        break;
    }
  },


  onLoad() {
    let cities = this.sortHandle(allCitiesList.cities || [])
    this.setData({
      cities,
      showItems: cities,
    })
  },
})