// component/chooseModel/chooseModel.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showModel:{
      type:Boolean,
      value:false
    },
    title:{
      type:String,
      value:''
    },
    cont:{
      type:String,
      value:''
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
        showModel:false
      });
      this.triggerEvent('closeModel',false)
    },
    save(){
      this.setData({
        showModel:false
      });
      this.triggerEvent('save',true)
    }
  }
})
