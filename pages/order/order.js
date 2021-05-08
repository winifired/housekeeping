import Api from "../../utils/api.js"
import request from "../../utils/request.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav: [{
      id: 9,
      name: '全部'
    }, {
      id: 3,
      name: '待付款'
    }, {
      id: 1,
      name: '待接单'
    }, {
      id: 4,
      name: '待完成'
    }, {
      id: 5,
      name: '待评价'
    }, {
      id: 6,
      name: '退款/售后'
    }],
    activeNav: 9,
    statusHeights: 0,
    orderList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      activeNav: options.activeNav || 9,
      userId: wx.getStorageSync('userId') || '',
    });
    this.post();
  },
  post() {
    let that = this;
    request.post(Api.userOrderList, {
      data: {
        orderStatus: this.data.activeNav == 9 ? '' : this.data.activeNav,
        userId: that.data.userId
      }
    }).then(res => {
      // console.log(res)
      if (res.code == 0) {
        res.data.map(item => {
          if (item.orderStatus == 0) {
            item.orderStatusT = '待审核';
          } else if (item.orderStatus == 1) {
            item.orderStatusT = '待接单';
          } else if (item.orderStatus == 2) {
            item.orderStatusT = '审核不通过';
          } else if (item.orderStatus == 3) {
            item.orderStatusT = '待付款';
          } else if (item.orderStatus == 4) {
            item.orderStatusT = '待完成';
          } else if (item.orderStatus == 5) {
            item.orderStatusT = '已完成';
          } else if (item.orderStatus == 6) {
            item.orderStatusT = '退款与售后';
          } else if (item.orderStatus = 7) {
            item.orderStatusT = '已取消';
          }
        })
        that.setData({
          orderList: res.data
        })
      }
    })
  },
  statusHeight(e) {
    this.setData({
      statusHeights: (e.detail - 0 - 2)
    });
  },
  toggel(e) {
    this.setData({
      activeNav: e.currentTarget.dataset.index
    });
    this.post();
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
    if (this.data.userId) {
      this.post();
    }
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1500)
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