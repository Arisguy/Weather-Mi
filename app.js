// app.js
App({
  onLaunch() {
    // 登录
    // wx.login({
    //   success: res => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //   }
    // })

    wx.getSystemInfo({
      success: (res) => {
        this.globalData.StatusBar = res.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;
        this.globalData.CustomBar = custom.bottom + custom.top - res.statusBarHeight;
        this.globalData.systeminfo = res
        this.globalData.isIPhoneX = /iphonex/gi.test(res.model.replace(/\s+/, '')) // 判断是不是iphoneX
      },
    })
  },
  globalData: {
    // 在这里定义一些全局要用到的基础数据
    systeminfo: {},
    isIPhoneX: false,
    key: '7afd08d9fb8249ee869f809372365534', // 和风天气API key值  用于请求接口
    weatherIconUrl: 'https://cdn.heweather.com/cond_icon/', // 获取和风天气Icon 基础Url
    requestUrl: {
      weather: 'https://devapi.qweather.com/v7', // 天气相关查询api 基础Url
    }
  }
})