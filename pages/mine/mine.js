import Api from "../../utils/api.js"
import request from "../../utils/request.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order: [{
        img: "/image/order_01.png",
        name: '待付款',
        url: '/pages/order/order?activeNav=3'
      },
      {
        img: "/image/order_02.png",
        name: '待接单',
        url: '/pages/order/order?activeNav=1'
      },
      {
        img: "/image/order_03.png",
        name: '待完成',
        url: '/pages/order/order?activeNav=4'
      },
      {
        img: "/image/order_04.png",
        name: '待评价',
        url: '/pages/order/order?activeNav=5'
      },
      {
        img: "/image/order_05.png",
        name: '退款/售后',
        url: '/pages/order/order?activeNav=6'
      },
    ],
    msg: [{
        img: '/image/mine_02.png',
        name: '平台消息',
        url: '/pages/message/message?type=1'
      },
      {
        img: '/image/mine_03.png',
        name: '用户消息',
        url: '/pages/message/message?type=2'
      }, {
        img: '/image/mine_04.png',
        name: '工人消息',
        url: '/pages/message/message?type=3'
      }
    ],
    help: [{
        img: '/image/mine_05.png',
        name: '收费规则',
        url: '/pages/asidePage/asidePage?type=4&&elseType=5'
      },
      {
        img: '/image/mine_06.png',
        name: '竞标规则',
        url: '/pages/asidePage/asidePage?type=4&&elseType=6'
      }, {
        img: '/image/mine_07.png',
        name: '其他规则',
        url: '/pages/asidePage/asidePage?type=4&&elseType=7'
      }
    ],
    showPhone: false,
    userId: '',
    userInfo: {},
    service: {},
    showChat: false
  },
  openChat(){
    this.setData({
      showChat:true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userId: wx.getStorageSync('userId') || '',
    })
    if (!this.data.userId) {
      wx.reLaunch({
        url: '/pages/login/login',
      });
      return;
    }
    this.postUser();
  },
  postUser() {
    let that = this;
    request.post(Api.userInfo, {
      data: {
        userId: that.data.userId
      }
    }).then(res => {
      // console.log(res)
      if (res.code == 0) {
        wx.setStorageSync('userName', res.data.nickName || '')
        wx.setStorageSync('userAvatar', res.data.photo || '')
        that.setData({
          userInfo: res.data
        })
      }
    })
    request.post(Api.customerServiceInfo).then(res => {
      if (res.code == 0) {
        that.setData({
          service: res.data
        })
      }
    })
    // request.post(Api.videoCall, {
    //   data: {
    //     userId: 2,
    //   }
    // }).then(val => {
    //   if (val.code == 0) {
    //     wx.setStorageSync('userSig', val.data)
    //   }
    // })
  },
  toggleID() {
    wx.showToast({
      title: '请至应用市场下载app',
      icon: 'none'
    })
  },
  onClose() {
    this.setData({
      showPhone: false
    })
  },
  onClose2() {
    this.setData({
      showChat: false
    })
  },
  longpress() {
    //下载图片
    let that = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              that.downLoadImg()
            }
          })
        } else {
          that.downLoadImg()
        }
      }
    })
  },
  downLoadImg() {
    let that = this;
    wx.getImageInfo({
      src: that.data.service.serviceWechat,
      success(res) {
        console.log(res.path)
        wx.saveImageToPhotosAlbum({
          filePath: res.path,
          success(res) {
            wx.showToast({
              title: '保存成功',
              icon:'none'
            })
          },
          fail(){
            wx.showToast({
              title: '保存失败',
              icon:'none'
            })
          }
        })
      }
    })
  },
  showModel() {
    if (!this.data.service.servicePhone) {
      wx.showToast({
        title: '暂未获取到客服电话，请使用在线客服',
        icon: 'none'
      })
    }
    this.setData({
      showPhone: true
    })
  },
  makePhone() {
    wx.makePhoneCall({
      phoneNumber: this.data.service.servicePhone,
    })
  },
  outLogin() {
    // let roomMsg = this.selectComponent('#roomMsg');
    // roomMsg.outLogin();
    wx.clearStorageSync();
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
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