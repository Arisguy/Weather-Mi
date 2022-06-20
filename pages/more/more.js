// pages/more/more.js
// 引用百度地图微信小程序JSAPI模块 
var bmap = require('../../libs/bmap-wx');
var wxMarkerData = [];
let globalData = getApp().globalData
import {
  moment,
} from "../../utils/util"
const key = globalData.key
import {
  api_weather_now
} from "../../api/weather"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    markers: [],
    latitude: '',
    longitude: '',
    rgcData: {}
  },


  // 百度地图api
  makertap: function (e) {
    console.log(e);
    var that = this;
    var id = e.markerId;
    that.showSearchInfo(wxMarkerData, id);
  },

  // 百度地图api解析地址
  showSearchInfo: function (data, id) {
    console.log(data, id);
    var that = this;
    that.setData({
      rgcData: {
        address: '街道：' + data[id].address + '\n',
        desc: '位置：' + data[id].desc + '\n',
        business: '商圈：' + data[id].business
      }
    });
  },

  // 获取当前位置信息之后获取相应的数据
  getCurrentWeather(req_par) {
    api_weather_now(req_par).then(res => {
      if (res.data.code == 200) {
        this.setData({
          rgcData: {
            address: '地址：' + wxMarkerData[0].address + '\n',
            desc: '方位：' + wxMarkerData[0].desc + '\n',
            business: '区域：' + wxMarkerData[0].business,
            date: moment(new Date()).format("YYYY-MM-DD"),
            text: res.data.now.text,
            temp: res.data.now.temp,
            feelsLike: res.data.now.feelsLike,
            windDir: res.data.now.windDir,
            windScale: res.data.now.windScale,
          }
        })
      } else {
        Toast('获取实时天气失败，请稍后再试')
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this;
    var BMap = new bmap.BMapWX({
      ak: 'Gxa70kYgfSu47AeYbWhFMzGgD1sCKVrG'
    });
    var fail = function (data) {
      console.log(data)
    };
    var success = function (data) {
      wxMarkerData = data.wxMarkerData;
      console.log('Baidu===========', wxMarkerData[0]);
      let req_par = {
        location: `${wxMarkerData[0].longitude},${wxMarkerData[0].latitude}`,
        key
      }
      that.getCurrentWeather(req_par) // 实时天气
      that.setData({
        markers: wxMarkerData
      });
      that.setData({
        latitude: wxMarkerData[0].latitude
      });
      that.setData({
        longitude: wxMarkerData[0].longitude
      });
    }
    // 发起regeocoding检索请求 
    BMap.regeocoding({
      fail: fail,
      success: success,
      iconPath: '',
      iconTapPath: ''
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})