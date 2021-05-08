import Api from "../../utils/api.js"
import request from "../../utils/request.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msgId:'',
    info:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      msgId:options.msgId
    });
    this.post();
  },
  post(){
    let that = this;
    request.post(Api.jzMessageInfo,{
      data:{
        messageId:this.data.msgId,
        userId: wx.getStorageSync('userId')
      }
    }).then(res => {
      if (res.code == 0) {
        res.data.content = res.data.content.replace(/\<table/gi, '<table class="table_rich"');
        res.data.content = res.data.content.replace(/\<img/gi, '<img class="img_rich"');
        that.setData({
          info: res.data
        });
      }
    });
  },
  toOrder(){
    wx.navigateTo({
      url: '/pages/orderDetail/orderDetail?orderid='+this.data.info.orderId,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})