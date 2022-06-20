const app = getApp();
Component({
  /**
   * 组件的一些选项
   */
  options: {
    addGlobalClass: true,
    multipleSlots: true
  },
  /**
   * 组件属性值
   */
  properties: {
    bg_color: {
      type: String,
      default: ''
    },
    isCustom: {
      type: [Boolean, String],
      default: false
    },
    isBack: {
      type: [Boolean, String],
      default: false
    },
    bg_image: {
      type: String,
      default: ''
    },
    titleLeft: {
      type: Boolean,
      default: false,
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom
  },
  /**
   * 组件的方法列表
   */
  methods: {
    BackPage() {
      let pages = getCurrentPages()
      let len = pages.length
      wx.getStorage({
        key: 'storage_location',
        success: (res) => {
          console.log("==================>   ", res.data);
          if (len == 10) {
            wx.redirectTo({
              url: `/pages/main/main?address=${res.data}`,
            })
          } else {
            wx.navigateTo({
              url: `/pages/main/main?address=${res.data}`,
            })
          }
        },
        fail: (res) => {
          if (len == 10) {
            wx.redirectTo({
              url: '/pages/main/main',
            })
          } else {
            wx.navigateTo({
              url: '/pages/main/main',
            })
          }
        }
      })

    },
  }
})