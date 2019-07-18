/* 
  header slot 
*/
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    title: {
      type: String,
      value: ''
    },
    desc: {
      type: String,
      value: ''
    },
    extra: {
      type: String,
      value: ''
    },
    useSlotExtra: {
      type: Boolean
    }
  },
  methods: {}
})