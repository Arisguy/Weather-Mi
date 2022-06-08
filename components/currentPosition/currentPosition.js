// components/currentPosition/currentPosition.js
import {
  storeBindingsBehavior
} from 'mobx-miniprogram-bindings'
import {
  store
} from '../../store/store'
Component({
  behaviors: [storeBindingsBehavior],
  storeBindings: {
    store, // 数据源
    fields: { // 指定要绑定的数据字段
      numberA: 'numberA',
      numberB: 'numberB',
      sum: 'sum'
    },
    actions: { // 指定要绑定的方法
      updatedNumberB: 'updatedNumberB'
    }
  },
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

    btnHandler_(e) {
      this.updatedNumberB(e.target.dataset.step)
    }
  }
})