import Api from "../../utils/api.js"
import request from "../../utils/request.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    customStyle: 'background:none;',
    onlineCode: '',
    info: {},
    phone: '',
    codeVal: '',
    userId: '',
    getUser: false,
    encryptedData: '',
    iv: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.post();
  },
  post() {
    let that = this;
    request.post(Api.ruleInfo, {
      data: {
        ruleId: 1
      }
    }).then(res => {
      // console.log(res)
      if (res.code == 0) {
        res.data.ruleContent = res.data.ruleContent.replace(/\<table/gi, '<table class="table_rich"');
        res.data.ruleContent = res.data.ruleContent.replace(/\<img/gi, '<img class="img_rich"');
        that.setData({
          info: res.data
        })
      }
    })
  },
  save() {
    let that = this;
    if (!this.data.phone || !this.data.codeVal) {
      wx.showToast({
        title: '请输入登录内容',
        icon: 'none'
      });
      return;
    }
    if (this.data.onlineCode != this.data.codeVal) {
      wx.showToast({
        title: '验证码错误',
        icon: 'none'
      });
      return;
    }
    request.post(Api.appLogin, {
      data: {
        phone: this.data.phone
      }
    }).then(res => {
      if (res.code == 0) {
        wx.setStorageSync('userId', res.data.id)
        wx.setStorageSync('userName', res.data.nickName || '')
        wx.setStorageSync('userAvatar', res.data.photo || '')
        request.post(Api.videoCall, {
          data: {
            userId: res.data.id,
          }
        }).then(val => {
          if (val.code == 0) {
            wx.setStorageSync('userSig', val.data)
            that.setData({
              userId: res.data.id
            })
          }
        })
        wx.showToast({
          title: '登录成功',
          icon: 'none'
        })
        setTimeout(() => {
          wx.reLaunch({
            url: '/pages/index/index',
          })
        }, 1500)
      }
    })
  },
  getCode(e) {
    this.setData({
      onlineCode: e.detail
    })
  },
  onClose() {
    this.setData({
      show: false
    })
  },
  showAgree() {
    this.setData({
      show: true
    })
  },
  getWXUser(nickName, avatar) {
    let that = this;
    wx.login({
      success(data) {
        if (data.code) {
          //发起网络请求
          request.post(Api.wechatLogin, {
            data: {
              encryptedData: that.data.encryptedData,
              iv: that.data.iv,
              code: data.code,
              nickName: nickName,
              avatar: avatar,
            }
          }).then(res => {
            if (res.code == 0) {
              that.setData({
                userId: res.data.id
              })
              wx.setStorageSync('userId', res.data.id)
              wx.setStorageSync('userName', res.data.nickName || '')
              wx.setStorageSync('userAvatar', res.data.photo || '')
              request.post(Api.videoCall, {
                data: {
                  userId: res.data.id,
                }
              }).then(res => {
                if (res.code == 0) {
                  wx.setStorageSync('userSig', res.data)
                }
              })
              wx.showToast({
                title: '登录成功',
                icon: 'none'
              })
              setTimeout(() => {
                wx.reLaunch({
                  url: '/pages/index/index',
                })
              }, 1500)
            }
          })
        } else {
          wx.showToast({
            title: '登录失败,请稍候重试',
            icon: 'none'
          })
        }
      }
    })
  },
  getphonenumber(e) {
    if (e.detail.encryptedData) {
      this.setData({
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
        getUser: true
      })
    }
  },
  refuseUser() {
    let that = this;
    that.setData({
      getUser: false
    });
    that.getWXUser('', '');
  },
  getUserProfile() {
    let that = this;
    that.setData({
      getUser: false
    })
    wx.getUserProfile({
      lang: 'zh_CN',
      desc: '用于完善会员资料',
      success: (res) => {
        that.getWXUser(res.userInfo.nickName, res.userInfo.avatarUrl);
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