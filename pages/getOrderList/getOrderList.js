import Api from "../../utils/api.js"
import request from "../../utils/request.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    option1: [{
        text: '正序',
        value: 1
      },
      {
        text: '倒序',
        value: 2
      }
    ],
    option2: [{
        text: '正序',
        value: 1
      },
      {
        text: '倒序',
        value: 2
      }
    ],
    chooseMeau: '', //1 按投标顺序 2 按价格
    value1: '',
    value2: '',
    choose: false,
    isToggleC: true, //是否可以选择
    safeBottom: Number(30 + wx.getStorageSync("safeBottom")) + 'rpx',
    title1: '投标顺序',
    title2: '价格',
    showModel: false,
    contModel: '',
    orderid: '',
    list: [],
    type: '', //1、定价，2、竞价
    chooseType: '', //1 淘汰
    userId: '',
    orderStatus: '',
    userNum: '', //人数要求
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderid: options.orderid,
      userId: wx.getStorageSync('userId') || '',
      type: options.type,
      orderStatus: options.orderStatus,
      userNum: options.userNum
    });
    this.post();
  },
  post() {
    let that = this;
    request.post(Api.orderBiddingList, {
      data: {
        orderId: this.data.orderid,
        sortType: this.data.chooseMeau == 1 ? this.data.value1 : this.data.value2,
        sort: this.data.chooseMeau,
        flag: 1
      }
    }).then(res => {
      if (res.code == 0) {
        res.data.map(item => {
          item['checked'] = false;
        })
        that.setData({
          list: res.data,
        });
      }
    })
  },
  chooseItem(e) {
    let index = e.currentTarget.dataset.index;
    this.data.list[index].checked = !this.data.list[index].checked;
    this.setData({
      list: this.data.list
    })
  },
  checkPeo() {
    //检查选择的人数
    let arr = [];
    this.data.list.map(item => {
      if (item.checked) {
        arr.push(item.id)
      }
    })
    if (arr.length <= 0) {
      wx.showToast({
        title: '请选择投标人',
        icon: 'none'
      })
      return false;
    } else {
      return arr;
    }
  },
  confirm(e) {
    if (this.checkPeo() == false) return;
    if (e.currentTarget.dataset.type == 1) {
      this.setData({
        contModel: '您确定淘汰勾选的人吗？'
      })
    } else if (e.currentTarget.dataset.type == 2) {
      if ((this.data.userNum - 0) < this.checkPeo().length) {
        wx.showToast({
          title: '超出所需人数',
          icon: 'none'
        });
        return;
      }
      this.setData({
        contModel: '您确定选择勾选的人吗？'
      })
    }
    this.setData({
      showModel: true,
      chooseType: e.currentTarget.dataset.type
    })
  },
  save() {
    this.closeModel();
    let that = this,
      url = '',
      data = {};
    if (this.checkPeo() == false) return;
    let arr = this.checkPeo();
    if (this.data.chooseType == 1) {
      url = Api.userTaotaiBidding;
      data = {
        userId: this.data.userId,
        biddingIds: arr.join(',')
      }
    } else {
      url = Api.userSelectBidding;
      data = {
        userId: this.data.userId,
        biddingIds: arr.join(','),
        orderId: this.data.orderid
      }
    }
    request.post(url, {
      data: data
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
          that.post();
          wx.navigateBack();
        }, 1500)
      }
    })
  },
  closeModel() {
    this.setData({
      showModel: false
    })
  },
  openMeau(e) {
    this.setData({
      isToggleC: false
    })
  },
  closeMeau() {
    this.setData({
      isToggleC: true
    })
  },
  onSwitch1Change(detail) {
    if (detail.detail == 2) {
      this.setData({
        title1: '倒序'
      })
    } else if (detail.detail == 1) {
      this.setData({
        title1: '正序'
      })
    }
    this.setData({
      value2: '',
      title2: '价格',
      chooseMeau: 1,
      value1: detail.detail
    });
    this.post();
  },
  onSwitch2Change(detail) {
    if (detail.detail == 2) {
      this.setData({
        title2: '倒序'
      })
    } else if (detail.detail == 1) {
      this.setData({
        title2: '正序'
      })
    }
    this.setData({
      value1: '',
      title1: '投标顺序',
      chooseMeau: 2,
      value2: detail.detail
    });
    this.post();
  },
  toggle() {
    if (!this.data.isToggleC) return;
    this.setData({
      choose: !this.data.choose
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