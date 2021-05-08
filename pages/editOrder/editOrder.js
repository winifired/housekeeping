const date = new Date();
const years = date.getFullYear();
const month = date.getMonth() + 1;
const day = date.getDate();
const hour = date.getHours();
const minute = date.getMinutes();
import Api from "../../utils/api.js";
import request from "../../utils/request.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    codeVal: '',
    phone: '',
    onlineCode: '',
    dateTimeArray1: null, //活动时间
    dateTime1: null,
    active_time: '',
    show: false,
    safeBottom: Number(30 + wx.getStorageSync("safeBottom")) + 'rpx',
    showModel: false,
    contModel: '',
    minDate: '',
    maxDate: '',
    showDate: false,
    filter(type, options) {
      if (type === 'minute') {
        return options.filter((option) => option % 30 === 0);
      }
      return options;
    },
    userId: '',
    orderid: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userId: wx.getStorageSync('userId') || '',
      orderid: options.orderid,
    });
    this.getOrder();
    this.getDate();
  },
  getOrder() {
    let that = this;
    request.post(Api.orderInfo, {
      data: {
        orderId: this.data.orderid,
      }
    }).then(res => {
      if (res.code == 0) {
        if (res.data.demandUrl) {
          res.data.demandUrl = JSON.parse(res.data.demandUrl)
        }
        that.setData({
          orderInfo: res.data,
          phone: res.data.contactsPhone
        });
      }
    })
  },
  getDate() {
    //获取本年最后一天
    let dayLast = years + '/12/31 23:30:00';
    let dayFirst = new Date().getTime();
    if (minute >= 30) {
      let qT = years + '/' + month + '/' + day + ' ' + (hour + 1) + ':00:00';
      dayFirst = new Date(qT).getTime()
    }
    if (minute == 0) {
      let qT = years + '/' + month + '/' + day + ' ' + (hour + 1) + ':30:00';
      dayFirst = new Date(qT).getTime()
    }
    this.setData({
      maxDate: new Date(dayLast).getTime(),
      minDate: dayFirst
    })
  },
  changePriceType(e) {
    this.setData({
      priceTypeValue: e.detail.value
    })
  },
  formSubmit(e) {
    let that = this,
      data = e.detail.value;
    data['demandUrl'] = this.data.orderInfo.demandUrl.length > 0 ? JSON.stringify(this.data.orderInfo.demandUrl) : '';
    data['categoryId'] = this.data.orderInfo.categoryId;
    data['classifyId'] = this.data.orderInfo.classifyId;
    data['type'] = this.data.orderInfo.type;
    data['demand'] = this.data.orderInfo.demand;
    data['id'] = this.data.orderid;
    for (let i in data) {
      if (i != 'demandUrl' && i != 'detailAddress' && data[i] == '') {
        wx.showToast({
          title: '请填写发布信息',
          icon: 'none'
        });
        return;
      }
    }
    if (!this.data.codeVal) {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      });
      return;
    }
    if (this.data.codeVal != this.data.onlineCode) {
      wx.showToast({
        title: '验证码错误',
        icon: 'none'
      });
      return;
    }
    request.post(Api.updateOrder, {
      data: data
    }).then(res => {
      // console.log(res)
      if (res.code == 0) {
        wx.showToast({
          title: '修改成功',
          icon: 'none',
        });
        let pages = getCurrentPages();
        let prevPage = pages[pages.length - 2],
          nextprevPage = pages[pages.length - 3];
        if (nextprevPage.route == 'pages/order/order') {
          nextprevPage.post();
        }
        prevPage.post();
        setTimeout(() => {
          wx.navigateBack();
        }, 1500)

      }
    })
  },
  chooseAddr() {
    let that = this;
    wx.chooseLocation({
      success(res) {
        that.setData({
          'orderInfo.address': res.address + res.name
        })
      },
    })
  },
  removeOrder(e) {
    this.setData({
      contModel: '您确定要取消订单吗？'
    })
    this.setData({
      showModel: true
    })
  },
  save() {
    this.closeModel();
    let that = this;
    wx.showLoading({
      mask: true
    });
    request.post(Api.cancelOrder, {
      data: {
        orderId: this.data.orderid
      }
    }).then(res => {
      // console.log(res)
      if (res.code == 0) {
        wx.hideLoading({
          success: () => {
            wx.showToast({
              title: '取消成功',
              icon: 'none',
            });
            let pages = getCurrentPages();
            let nextprevPage = pages[pages.length - 3];
            if (nextprevPage.route == 'pages/order/order') {
              nextprevPage.post();
            }
            setTimeout(() => {
              wx.navigateBack({
                delta: 3
              });
            }, 1500)
          },
        })
      }
    })
  },
  closeModel() {
    this.setData({
      showModel: false
    })
  },
  onClose() {
    this.setData({
      show: false
    })
  },
  onInput(event) {
    let val = new Date(event.detail);
    let year = val.getFullYear();
    let timeValue = `${year}-${this.fiflTime(val.getMonth() + 1)}-${this.fiflTime(val.getDate())} ${this.fiflTime(val.getHours())}:${this.fiflTime(val.getMinutes())}`
    this.setData({
      'orderInfo.appointTime': timeValue,
    });
    this.oncancel();
  },
  fiflTime(data) {
    if (data < 10) {
      return `0${data}`
    } else {
      return `${data}`
    }
  },
  oncancel() {
    this.setData({
      showDate: false
    })
  },
  chooseTime() {
    this.setData({
      showDate: true
    })
  },
  getCode(e) {
    this.setData({
      onlineCode: e.detail
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