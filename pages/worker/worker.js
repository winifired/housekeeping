import Api from "../../utils/api.js"
import request from "../../utils/request.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusHeights: 0,
    safeBottom: Number(30 + wx.getStorageSync("safeBottom")) + 'rpx',
    showModel: false,
    contModel: '',
    biddingId: '',
    workerInfo: {},
    type: '', //1、定价，2、竞价
    orderStatus: '',
    chooseType: '', //1 淘汰
    orderNo: '',
    userSig: '',
    invitee: {},
    inviter: {},
    config: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      biddingId: options.biddingId,
      type: options.type || '',
      orderStatus: options.orderStatus || '',
      orderNo: options.orderNo || '',
      userAvater: options.userAvater || '',
    })
    this.post();
    // this.houseId(); //房间号
  },
  post() {
    let that = this;
    request.post(Api.biddingInfo, {
      data: {
        biddingId: this.data.biddingId,
      }
    }).then(res => {
      if (res.code == 0) {
        if (res.data.jzUser.major) {
          res.data.jzUser.major = res.data.jzUser.major.split(',')
        }
        res.data.remarkUrl = res.data.remarkUrl ? JSON.parse(res.data.remarkUrl) : [];
        that.setData({
          workerInfo: res.data
        });
      }
    })
  },
  confirm(e) {
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    let list = prevPage.data.list,
      userNum = prevPage.data.userNum;
    let arr = [];
    list.map(item => {
      //获取已选的工人
      if (item.checked) {
        arr.push(item.id)
      }
    })
    if (e.currentTarget.dataset.type == 1) {
      this.setData({
        contModel: '您确定淘汰此人吗？'
      })
    } else if (e.currentTarget.dataset.type == 2) {
      if ((userNum - 0) < arr.length) {
        wx.showToast({
          title: '超出所需人数',
          icon: 'none'
        });
        return;
      }
      this.setData({
        contModel: '您确定选择此人吗？'
      })
    }
    this.setData({
      showModel: true,
      chooseType: e.currentTarget.dataset.type
    })
  },
  save() {
    this.closeModel();
    let that = this;
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    let list = prevPage.data.list;
    list.map((item, index) => {
      if (item.id == that.data.biddingId) {
        if (that.data.chooseType == 1) {
          list[index].checked = false;
        } else {
          list[index].checked = true;
        }
      }
    })
    prevPage.setData({
      choose: true,
      list: list
    })
    wx.navigateBack();
  },
  closeModel() {
    this.setData({
      showModel: false
    })
  },
  statusHeight(e) {
    this.setData({
      statusHeights: e.detail
    })
  },
  getWorkAddr() {
    if (!this.data.workerInfo.workerLatitude || !this.data.workerInfo.workerLongitude) {
      wx.showToast({
        title: '未获取到经纬度，不能查看微信信息',
        icon: 'none',
        mask: true,
      });
      return;
    }
    wx.openLocation({
      latitude: this.data.workerInfo.workerLatitude,
      longitude: this.data.workerInfo.workerLongitude,
      scale: 18
    })
  },
  houseId() {
    let that = this,
      userid = wx.getStorageSync('userId');
    request.post(Api.videoCall, {
      data: {
        userId: userid,
      }
    }).then(res => {
      if (res.code == 0) {
        wx.setStorageSync('userSig', res.data)
        that.setData({
          userSig: res.data
        })
      }
    })
  },
  //腾讯云
  //进入房间
  audioCall() {
    if (!this.data.workerInfo.jzUser.phone) {
      wx.showToast({
        title: '未获取到工人电话',
        icon: 'none',
        mask: true,
      });
      return;
    }
    wx.makePhoneCall({
      phoneNumber: this.data.workerInfo.jzUser.phone,
    })
  },
  enterRoom: function () {
    let that = this;
    if (!this.data.userSig) {
      wx.showToast({
        title: '正在获取通话信息，请稍后重试',
        icon: 'none',
        duration: 2000,
      })
      return;
    }
    const child = this.selectComponent('#roomMsg');
    console.log(child)
    // const url = `/pages/trtcRoom/trtcRoom?workerId=${this.data.workerInfo.userId}&userID=${wx.getStorageSync('userId')}&userSig=${this.data.userSig}&workerName=${this.data.workerInfo.jzUser.nickName||''}&workerAvater=${this.data.workerInfo.jzUser.photo||''}&userAvater=${this.data.userAvater}`
    this.checkDeviceAuthorize().then((result) => {
      console.log('授权成功', result)
      let workerId = '';
      if ((typeof this.data.workerInfo.userId) == 'number') {
        workerId = String(this.data.workerInfo.userId)
      } else {
        workerId = this.data.workerInfo.userId
      }
      that.setData({
        invitee: {
          userID: '9',
          avatar: this.data.workerInfo.jzUser.photo || '',
          name: this.data.workerInfo.jzUser.nickName || '',
        },
        inviter: {
          userID: String(wx.getStorageSync('userId')),
          avatar: this.data.userAvater
        },
      })
      setTimeout(() => {
        child.call();
      }, 1000)
      // wx.navigateTo({
      //   url: url
      // })
    }).catch((error) => {
      console.log('没有授权', error)
    })
  },
  checkDeviceAuthorize: function () {
    return new Promise((resolve, reject) => {
      wx.getSetting().then((result) => {
        console.log('getSetting', result)
        if (result.authSetting['scope.camera'] && result.authSetting['scope.record']) {
          // 授权成功
          resolve()
        } else {
          console.log('getSetting 没有授权，弹出授权窗口', result)
          wx.authorize({
            scope: 'scope.record',
          }).then((res) => {
            console.log('authorize mic', res)
            resolve()
          }).catch((error) => {
            console.log('authorize mic error', error)
          })
          wx.authorize({
            scope: 'scope.camera',
          }).then((res) => {
            console.log('authorize camera', res)
            resolve()
          }).catch((error) => {
            console.log('authorize camera error', error)
            this.openConfirm()
            reject(new Error('authorize fail'))
          })
        }
      })
    })
  },
  openConfirm: function () {
    return wx.showModal({
      content: '您没有打开麦克风和摄像头的权限，是否去设置打开？',
      confirmText: '确认',
      cancelText: '取消',
      success: (res) => {
        console.log(res)
        // 点击“确认”时打开设置页面
        if (res.confirm) {
          console.log('用户点击确认')
          wx.openSetting({
            success: (res) => {},
          })
        } else {
          console.log('用户点击取消')
        }
      },
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