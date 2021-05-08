import Api from "../../utils/api.js"
import request from "../../utils/request.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 1, //平台消息1 2用户消息 3工人消息
    userId: '',
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      type: options.type,
      userId: wx.getStorageSync('userId')
    });
    if (this.data.type == 1) {
      wx.setNavigationBarTitle({
        title: '平台消息',
      })
    } else if (this.data.type == 2) {
      wx.setNavigationBarTitle({
        title: '用户消息',
      })
    } else if (this.data.type == 3) {
      wx.setNavigationBarTitle({
        title: '工人消息',
      })
    }
    if (this.data.userId) {
      this.post();
    } else {
      wx.reLaunch({
        url: '/pages/login/login',
      })
    }
  },
  post() {
    let that = this;
    request.post(Api.jzMessageList, {
      data: {
        type: this.data.type,
        userId: this.data.userId,
      }
    }).then(res => {
      if (res.code == 0) {
        res.rows.map(item => {
          item.content = item.content.replace(/\<table/gi, '<table class="table_rich"');
          item.content = item.content.replace(/\<img/gi, '<img class="img_rich"');
        })
        that.setData({
          list: res.rows
        })
      }
    });
  },
  toMsg(e){
    this.data.list[e.currentTarget.dataset.index].readFlag=1;
    this.setData({
      list:this.data.list
    });
    wx.navigateTo({
      url: '/pages/messageDetail/messageDetail?msgId='+e.currentTarget.dataset.id,
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
  onPullDownRefresh: function() {
    this.post();
    setTimeout(()=>{
      wx.stopPullDownRefresh();
    },1500)
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