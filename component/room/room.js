import Api from "../../utils/api.js";
import request from "../../utils/request.js";
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    inviter: {
      type: Object,
      value: {},
      observer: function (newVal, oldVal) {
        this.setData({
          inviter: newVal,
        })
      },
    },
    invitee: {
      type: Object,
      value: {},
      observer: function (newVal, oldVal) {
        this.setData({
          invitee: newVal,
        })
      },
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    userIDToSearch: '',
    searchResultShow: false,
    callingFlag: false,
    invitation: null,
    incomingCallFlag: false,
    inviteCallFlag: false,
    pusherAvatar: '',
    loaclPhoneNumber: wx.getStorageSync('userId'),
    config: {
      sdkAppID: wx.$globalData.sdkAppID,
      userID: wx.getStorageSync('userId') ? String(wx.getStorageSync('userId')) : '',
      userSig: wx.getStorageSync('userSig'),
      type: 2,
    },
    getInvitation: {}
  },
  lifetimes: {
    attached: function () {
      setTimeout(() => {
        console.log(wx.getStorageSync('userSig'))
        console.log(wx.getStorageSync('userId'))
        this.TRTCCalling = this.selectComponent('#TRTCCalling-component')
        this.bindTRTCCallingRoomEvent();
        this.TRTCCalling.login();
      }, 1000)
      wx.onAppShow({
        success() {
          this.TRTCCalling.logout()
        }
      })
    },
  },
  pageLifetimes: {
    hide: function () {
      // 页面被隐藏s
      this.TRTCCalling = this.selectComponent('#TRTCCalling-component')
      this.TRTCCalling.logout()
    },
  },
  methods: {
    // outLogin(){
    //   this.TRTCCalling.logout()
    // },
    call: function () {
      if (this.data.config.userID === this.data.invitee.userID) {
        wx.showToast({
          title: '不可呼叫本机',
          icon: 'none',
        })
        return
      }
      this.data.config.type = 2
      this.setData({
        callingFlag: true,
        inviteCallFlag: true,
        config: this.data.config,
      })
      this.TRTCCalling.call({
        userID: this.data.invitee.userID,
        type: 2
      })
    },
    bindTRTCCallingRoomEvent: function () {
      let that = this;
      const TRTCCallingEvent = this.TRTCCalling.EVENT;
      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 1];
      this.TRTCCalling.on(TRTCCallingEvent.INVITED, (event) => {
        console.log(event.data.sponsor)
        request.post(Api.userInfo, {
          data: {
            userId: event.data.sponsor
          }
        }).then(res => {
          // console.log(res)
          if (res.code == 0) {
            that.setData({
              getInvitation: res.data
            })
          }
        })
        this.setData({
          invitation: event.data,
          incomingCallFlag: true,
        })
        if (prevPage.route == 'pages/index/index' || prevPage.route == 'pages/add/add' || prevPage.route == 'pages/mine/mine') {
          wx.hideTabBar();
        }
      })
      // 处理挂断的事件回调
      this.TRTCCalling.on(TRTCCallingEvent.HANG_UP, () => {
        this.setData({
          callingFlag: false,
        })
        this.showBar()
      })
      this.TRTCCalling.on(TRTCCallingEvent.REJECT, () => {
        this.setData({
          callingFlag: false,
          inviteCallFlag: false,
        })
        wx.showToast({
          title: '对方已拒绝',
          icon: 'none',
        })
        this.TRTCCalling.hangup()
        this.showBar()
      })
      this.TRTCCalling.on(TRTCCallingEvent.USER_LEAVE, () => {
        this.TRTCCalling.hangup()
        wx.showToast({
          title: '对方已挂断',
          icon: 'none',
        })
        this.showBar()
      })
      this.TRTCCalling.on(TRTCCallingEvent.NO_RESP, () => {
        this.setData({
          incomingCallFlag: false,
          inviteCallFlag: false,
        })
        wx.showToast({
          title: '对方不在线',
          icon: 'none',
        })
        this.TRTCCalling.hangup()
        this.showBar()
      })
      this.TRTCCalling.on(TRTCCallingEvent.CALLING_TIMEOUT, () => {
        console.log('CALLING_TIMEOUT')
        this.setData({
          incomingCallFlag: false,
          inviteCallFlag: false,
        })
        wx.showToast({
          title: '无应答超时',
          icon: 'none',
        })
        this.TRTCCalling.hangup()
        this.showBar()
      })
      this.TRTCCalling.on(TRTCCallingEvent.LINE_BUSY, () => {
        this.setData({
          incomingCallFlag: false,
          inviteCallFlag: false,
        })
        wx.showToast({
          title: '对方忙线中',
          icon: 'none',
        })
        this.TRTCCalling.hangup()
        this.showBar()
      })
      this.TRTCCalling.on(TRTCCallingEvent.CALLING_CANCEL, () => {
        this.setData({
          incomingCallFlag: false,
        })
        wx.showToast({
          title: '通话已取消',
          icon: 'none',
        })
        this.showBar()
      })
      this.TRTCCalling.on(TRTCCallingEvent.USER_ENTER, () => {
        this.setData({
          inviteCallFlag: false,
        })
        this.showBar()
      })
    },

    handleOnAccept: function () {
      this.data.config.type = this.data.invitation.inviteData.callType
      this.setData({
        callingFlag: true,
        incomingCallFlag: false,
        config: this.data.config,
      }, () => {
        this.TRTCCalling.accept()
      })
      this.showBar()
    },

    handleOnReject: function () {
      this.setData({
        incomingCallFlag: false,
      }, () => {
        this.TRTCCalling.reject()
      })
      this.showBar()
    },

    handleOnCancel: function () {
      this.TRTCCalling.hangup()
      this.setData({
        inviteCallFlag: false,
      })
      this.showBar()
    },
    showBar() {
      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 1];
      if (prevPage.route == 'pages/index/index' || prevPage.route == 'pages/add/add' || prevPage.route == 'pages/mine/mine') {
        wx.showTabBar();
      }
    }
  }
})