import Api from "../../utils/api.js"
import request from "../../utils/request.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    star: 5,
    imagesUrl: [],
    orderid: '',
    orderTitle: '',
    classifyName: '',
    address: '',
    orderStatusT: '',
    cont:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderid: options.orderid,
      orderTitle: options.orderTitle,
      classifyName: options.classifyName,
      address: options.address+options.detailAddress,
      orderStatusT: options.orderStatusT
    })
  },
  onChange(event) {
    this.setData({
      star: event.detail,
    });
  },
  getImg(e){
    this.setData({
      imagesUrl:e.detail
    })
  },
  save(){
    let that = this;
    if(!this.data.cont&&this.data.imagesUrl.length<=0){
      wx.showToast({
        title: '请输入评价内容或者评价图片',
        icon:'none'
      });
      return;
    }
    request.post(Api.evaluateOrder, {
      data: {
        id: this.data.orderid,
        score: this.data.star,
        evaluate: this.data.cont,
        evaluateUrl: this.data.imagesUrl.length>0?JSON.stringify(this.data.imagesUrl):''
      }
    }).then(res => {
      if (res.code == 0) {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        });
        let pages = getCurrentPages();
        let prevPage = pages[pages.length - 2];
        let prevPageN = pages[pages.length - 3];
        prevPage.post();
        prevPageN.post();
        setTimeout(() => {
          wx.navigateBack();
        }, 1500)
      }
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