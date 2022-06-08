// 主文件中创建store实例对象
import {
  action,
  observable
} from 'mobx-miniprogram'

export const store = observable({

  numberA: 1,
  numberB: 2,
  activeTabBarIndex: 0,
  // 计算属性
  get sum() {
    return this.numberA + this.numberB
  },

  // action函数： 修改store中的数据
  updatedNumberA: action(function (step) {
    this.numberA += step
  }),

  updatedNumberB: action(function (step) {
    this.numberB += step
  }),

  updatedActiveTabBarIndex: action(function (index) {
    this.activeTabBarIndex += index
  })
})