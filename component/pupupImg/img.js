import Api from "../../utils/api.js";
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
    closeImg:''
  },
  ready: function () {
    let that=this;
    wx.getImageInfo({
      src: '/image/remove.png',
      success (res) {
        wx.uploadFile({
          url: Api.upload_file,
          filePath: res.path,
          name: 'file',
          success: (uploadFileRes) => {
            console.log(uploadFileRes)
            that.setData({
              closeImg:JSON.parse(uploadFileRes.data).url
            })
          },
        });
      }
    })
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
