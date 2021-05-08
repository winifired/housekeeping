// component/pupupImg/img.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show:{
      type:Boolean,
      value:false
    },
    showList:{
      type:Array,
      value:[]
    },
    currentSwiper:{
      type:[Number,String],
      value:0
    }
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
    onClose(){
      this.setData({
        show:false
      })
      console.log(false)
      this.triggerEvent('hideImg',false)
    },
  }
})
