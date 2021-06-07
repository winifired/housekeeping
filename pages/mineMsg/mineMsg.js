import Api from "../../utils/api.js"
import request from "../../utils/request.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName: '',
    userPhoto: '',
    userInfo: {},
    safeBottom: Number(30 + wx.getStorageSync("safeBottom")) + 'rpx',
    show: false,
    userId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userId: wx.getStorageSync('userId') || '',
    })
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
        that.setData({
          userInfo: res.data,
          userPhoto: res.data.photo,
          userName: res.data.nickName
        })
      }
    })
  },
  onClose() {
    this.setData({
      show: false,
      userName: this.data.userInfo.nickName
    })
  },
  showModel() {
    this.setData({
      show: true
    })
  },
  onShow() {
    this.setData({
      userInfo: wx.getStorageSync('DJUser')
    });
  },
  chooseImg() {
    let that = this;
    wx.chooseImage({
      count: 1,
      success(res) {
        const tempFilePaths = res.tempFilePaths;
        wx.uploadFile({
          url: Api.upload_file, //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          success(res) {
            const data = JSON.parse(res.data);
            that.setData({
              userPhoto: data.url
            });
          }
        })
      }
    })
  },
  save() {
    this.setData({
      show: false
    })
  },
  edit(data) {
    let that = this;
    request.post(Api.updateUserInfo, {
      data: {
        id: this.data.userInfo.id,
        photo: this.data.userPhoto||'',
        nickName: this.data.userName||'',
      }
    }).then(res => {
      if (res.code == 0) {
        wx.showToast({
          title: '修改成功',
          icon: 'none'
        });
        wx.setStorageSync('userName', this.data.userName || '')
        wx.setStorageSync('userAvatar', this.data.userPhoto || '')
        setTimeout(() => {
          that.postUser();
          let pages = getCurrentPages();
          let prevPage = pages[pages.length - 2];
          prevPage.postUser();
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