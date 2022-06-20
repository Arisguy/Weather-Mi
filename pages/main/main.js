// pages/main/main.js
let globalData = getApp().globalData
const key = globalData.key
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast.js';
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
import {
  api_weather_now,
  api_sun,
  api_weather_3d,
  api_weather_10d,
  api_weather_24h,
  api_indices_1d,
  api_air_5d,
  api_air_now,
  api_minutely
} from "../../api/weather"
import {
  BackgroundImageList,
} from '../../common/constant';
// 引用百度地图微信小程序JSAPI模块 
var bmap = require('../../libs/bmap-wx');
var wxMarkerData = [];
import {
  moment,
  weekDay,
  isEmptyObj
} from "../../utils/util"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bcgImg_index: 0, // 默认初始化背景图索引
    location_long_lat: "", // 当前位置经纬度
    currentWeatherInfo: {}, // 当前实时天气信息
    sunRiseTime: "", // 日出时间
    sunSetTime: "", // 日落时间
    BackgroundImageList: BackgroundImageList, // 背景图数据
    transparentClass: 'transparentClass', // 头部导航栏默认透明
    weatherIconUrl: globalData.weatherIconUrl, // 和风天气icon前缀
    forecast_24hours: [], // 24小时预测数据
    lifeStyleList: [], // 生活指数列表
    lifeStyleDetail: {}, // 查看生活指数
    show_popup: false, // 弹出层控制变量
    rainSummary: '你若安好，便是晴天',
    currentAirInfo: {}, // 当前空气质量情况
    showOrHideAlldays: false, // 查看10日天气控制变量
    tenDaysWeatherInfo: [], // 10天天气预报
    now_position_info: {}, // 当前位置信息
  },

  // 页面初始化开始 ==> 获取当前地理位置经纬度
  init(location) {
    let that_ = this
    // wx.getLocation({
    //   type: 'gcj02',
    //   success: (res) => {
    //     console.log(res);
    //   },
    //   fail: (res) => {
    //     this.fail(res)
    //   }
    // })
    console.log(location, '-------获取到经纬度信息----------');
    that_.setData({
      location_long_lat: location
    })
    let req_par = {
      location,
      key
    }
    that_.getCurrentWeather(req_par) // 实时天气
    that_.getThreeDaysWeather(req_par) // 三天天气
    that_.getSunRiseOrSet(req_par) // 日出日落
    that_.getOneDayForecast(req_par) // 24小时天气
    that_.getRainInfo(req_par) // 降水情况
    that_.getAirInfo(req_par) // 实时空气质量
    that_.getLifeStyleInfo(req_par) // 生活指数
    // wx.hideLoading()
  },

  // 获取当前位置信息之后获取相应的数据
  getCurrentWeather(req_par) {
    api_weather_now(req_par).then(res => {
      if (res.data.code == 200) {
        this.setData({
          currentWeatherInfo: res.data.now
        })

        switch (res.data.now.icon) {
          case "100":
            this.setData({
              bcgImg_index: 5
            })
            break;
          case "101":
          case "102":
          case "103":
            this.setData({
              bcgImg_index: 3
            })
            break;
          case "104":
            this.setData({
              bcgImg_index: 4
            })
            break;
          case "307":
          case "306":
          case "305":
          case "301":
            this.setData({
              bcgImg_index: 2
            })
            break;

          default:
            break;
        }
      } else {
        Toast('获取实时天气失败，请稍后再试')
      }
    })
  },

  // 获取日出日落时间
  getSunRiseOrSet(req_par) {
    api_sun({
      ...req_par,
      date: moment(new Date()).format("YYYYMMDD")
    }).then(res => {
      console.log(res.data);
      if (res.data.code == 200) {
        this.setData({
          sunRiseTime: this.formatDate_HHmm(res.data.sunrise),
          sunSetTime: this.formatDate_HHmm(res.data.sunset)
        })
      } else {
        Toast('数据加载失败，请稍后再试')
      }
    })
  },

  // 获取24小时天气
  getOneDayForecast(req_par) {
    api_weather_24h(req_par).then(res => {
      if (res.data.code == 200) {
        res.data.hourly.forEach(ele => {
          ele.forecaastTime = this.formatDate_HHmm(ele.fxTime)
        });
        this.setData({
          forecast_24hours: res.data.hourly
        })
        console.log(this.data.forecast_24hours, '处理后的数据=========');
      } else {
        Toast('数据加载失败，请稍后再试')
      }

    })
  },

  // 获取空气质量情况
  getAirInfo(req_par) {
    api_air_now(req_par).then(res => {
      if (res.data.code == 200) {
        this.setData({
          currentAirInfo: res.data.now
        })
        console.log(this.data.currentAirInfo, '处理后的数据=========');
      } else {
        Toast('数据加载失败，请稍后再试')
      }

    })
  },

  // 获取降水预测情况
  getRainInfo(req_par) {
    api_minutely(req_par).then(res => {
      if (res.data.code == 200) {
        console.log(res.data);
        this.setData({
          rainSummary: res.data.summary
        })
      } else {
        Toast('数据加载失败，请稍后再试')
      }

    })
  },

  // 获取10天天气情况
  getTenDaysWeather(req_par) {
    api_weather_10d(req_par).then(res => {
      if (res.data.code == 200) {
        console.log(res.data);
        res.data.daily.forEach(dailyItem => {
          dailyItem.week_day = weekDay(dailyItem.fxDate)
          dailyItem.mouth_day = moment(dailyItem.fxDate).format("MM月DD日")
        });
        this.setData({
          tenDaysWeatherInfo: res.data.daily
        })
      } else {
        Toast('数据加载失败，请稍后再试')
      }
    })
  },

  // 获取3天天气情况
  getThreeDaysWeather(req_par) {
    api_weather_3d(req_par).then(res => {
      if (res.data.code == 200) {
        console.log(res.data);
        res.data.daily.forEach(dailyItem => {
          dailyItem.week_day = weekDay(dailyItem.fxDate)
          dailyItem.mouth_day = moment(dailyItem.fxDate).format("MM月DD日")
        });
        this.setData({
          tenDaysWeatherInfo: res.data.daily
        })
      } else {
        Toast('数据加载失败，请稍后再试')
      }
    })
  },

  // 获取生活指数信息
  getLifeStyleInfo(req_par) {
    api_indices_1d({
      ...req_par,
      type: 0
    }).then(res => {
      if (res.data.code == 200) {
        console.log(res.data);
        this.setData({
          lifeStyleList: res.data.daily
        })
      } else {
        Toast('数据加载失败，请稍后再试')
      }
    })
  },

  // 格式化时间
  formatDate_HHmm(date) {
    return moment(date).format("HH:mm")
  },

  // 切换背景图事件
  changeBackImg(event) {
    console.log(event.currentTarget.dataset);
    this.setData({
      bcgImg_index: this.data.bcgImg_index == 11 ? 0 : this.data.bcgImg_index + 1
    })
    console.log(this.data.bcgImg_index);
    // if (event.currentTarget.dataset.arrow == 'left') {
    //   this.setData({
    //     bcgImg_index: this.data.bcgImg_index == 0 ? 6 : this.data.bcgImg_index - 1
    //   })
    // } else {
    //   this.setData({
    //     bcgImg_index: this.data.bcgImg_index == 6 ? 0 : this.data.bcgImg_index + 1
    //   })
    // }
  },

  // 去查询当前位置详细信息
  queryBaiduMap() {
    Dialog.confirm({
        zIndex: 101,
        title: '提示',
        message: '确认查看当前位置信息吗？',
      })
      .then(() => {
        // on confirm
        let pages = getCurrentPages()
        console.log(pages);
        let len = pages.length
        if (len == 10) {
          wx.redirectTo({
            url: '/pages/more/more',
          })
        } else {
          wx.navigateTo({
            url: '/pages/more/more',
          })
        }
      })
      .catch(() => {
        // on cancel
      });


  },

  // 选择城市页面
  selectCity() {
    let pages = getCurrentPages()
    console.log(pages);
    let len = pages.length
    if (len == 10) {
      wx.redirectTo({
        url: '/pages/cityList/cityList',
      })
    } else {
      wx.navigateTo({
        url: '/pages/cityList/cityList',
      })
    }

  },

  // 点击查询近10日天气预报
  queryMoreDays() {
    this.setData({
      showOrHideAlldays: this.data.showOrHideAlldays ? false : true
    })
    let reqParams = {
      location: this.data.location_long_lat,
      key
    }
    if (this.data.showOrHideAlldays) {
      this.getTenDaysWeather(reqParams)
    } else {
      this.getThreeDaysWeather(reqParams)
    }
  },

  // 弹出层展开
  showPopup(event) {
    console.log(event.currentTarget.dataset.info, '——-------要查询的生活指数信息');
    this.setData({
      lifeStyleDetail: event.currentTarget.dataset.info
    });
    this.setData({
      show_popup: true
    });

  },

  // 关闭弹出层
  onClose() {
    this.setData({
      show_popup: false
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

    var that = this;
    console.log(options);
    if (isEmptyObj(options.address) || options.address == 'local') {
      var BMap = new bmap.BMapWX({
        ak: 'Gxa70kYgfSu47AeYbWhFMzGgD1sCKVrG'
      });
      var fail = function (data) {
        console.log(data)
      };
      var success = function (data) {
        wxMarkerData = data.wxMarkerData;
        console.log('Baidu===========', wxMarkerData[0]);
        that.setData({
          now_position_info: wxMarkerData[0]
        });
        let location = `${wxMarkerData[0].longitude},${wxMarkerData[0].latitude}`
        that.init(location)
      }
      // 发起regeocoding检索请求 
      BMap.regeocoding({
        fail: fail,
        success: success,
        iconPath: '/images/location_no.png',
        iconTapPath: '/images/location_yes.png'
      });
    } else {
      wx.request({
        url: 'https://geoapi.qweather.com/v2/city/lookup',
        method: 'GET',
        data: {
          location: options.address,
          key
        },
        success: (res) => {
          let query_location = `${res.data.location[0].lon},${res.data.location[0].lat}`
          console.log(query_location, '+++当前位置');
          that.setData({
            now_position_info: {
              address: res.data.location[0].name
            }
          });
          that.init(query_location)
        }
      })
    }

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
    this.init(`${this.data.now_position_info.longitude},${this.data.now_position_info.latitude}`)
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