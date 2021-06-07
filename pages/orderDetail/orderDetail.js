import Api from "../../utils/api.js"
import request from "../../utils/request.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    safeBottom: Number(30 + wx.getStorageSync("safeBottom")) + 'rpx',
    showModel: false,
    contModel: '',
    modelType: -1, //1取消
    orderid: '',
    userId: '',
    orderInfo: {},
    appealBidding: [],
    show: false,
    showList: [],
    currentSwiper: 0,
    bottom: 0,
    biddingList: [], //选择的工人
    userInfo: {},
    showPay: false,
    totalP: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const syStem = wx.getSystemInfoSync();
    this.setData({
      bottom: (syStem.safeArea.bottom) * 2,
      orderid: options.orderid,
      userId: wx.getStorageSync('userId') || '',
    });
    this.post();
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
          userInfo: res.data
        })
      }
    })
  },
  post() {
    let that = this;
    request.post(Api.orderInfo, {
      data: {
        orderId: this.data.orderid,
      }
    }).then(res => {
      if (res.code == 0) {
        if (res.data.orderStatus == 0) {
          res.data.orderStatusT = '待审核';
        } else if (res.data.orderStatus == 1) {
          res.data.orderStatusT = '待接单';
        } else if (res.data.orderStatus == 2) {
          res.data.orderStatusT = '审核不通过';
        } else if (res.data.orderStatus == 3) {
          res.data.orderStatusT = '待付款';
        } else if (res.data.orderStatus == 4) {
          res.data.orderStatusT = '待完成';
        } else if (res.data.orderStatus == 5) {
          res.data.orderStatusT = '已完成';
        } else if (res.data.orderStatus == 6) {
          res.data.orderStatusT = '退款与售后';
        } else if (res.data.orderStatus = 7) {
          res.data.orderStatusT = '已取消';
        }
        if (res.data.demandUrl) {
          res.data.demandUrl = JSON.parse(res.data.demandUrl)
        }
        that.setData({
          orderInfo: res.data
        });
        if (res.data.orderStatus != 1 && res.data.orderStatus != 2 && res.data.orderStatus != 0) {
          that.orderBiddingList(); //工人详情
        } else {
          that.setData({
            biddingList: []
          })
        }
        if (that.data.orderInfo.orderStatus == 6) {
          that.bidding();
        } else {
          that.setData({
            appealBidding: []
          })
        }
      }
    })
  },
  orderBiddingList() {
    let that = this;
    request.post(Api.orderBiddingList, {
      data: {
        orderId: this.data.orderid,
        flag: 2
      }
    }).then(res => {
      if (res.code == 0) {
        that.setData({
          biddingList: res.data,
        });
      }
    })
  },
  bidding() {
    //工人申诉
    let that = this;
    request.post(Api.appealBidding, {
      data: {
        orderId: this.data.orderid,
      }
    }).then(res => {
      if (res.code == 0) {
        res.data.map(item => {
          if (item.appealUrl) {
            item.appealUrl = JSON.parse(item.appealUrl)
          }
        })
        that.setData({
          appealBidding: res.data
        })
      }
    })
  },
  hideImg(e) {
    this.setData({
      show: false,
    })
  },
  showImgVideo(e) {
    this.setData({
      show: true,
      showList: e.currentTarget.dataset.list,
      currentSwiper: e.currentTarget.dataset.index
    })
  },
  goEva() {
    if (this.data.orderInfo.score) {
      wx.showToast({
        title: '您已经评价过，不得再次评价',
        icon: 'none'
      });
      return;
    }
    wx.navigateTo({
      url: '/pages/evaluate/evaluate?orderid=' + this.data.orderid + '&orderTitle=' + this.data.orderInfo.title + '&classifyName=' + this.data.orderInfo.classifyName + '&address=' + this.data.orderInfo.address + '&detailAddress=' + this.data.orderInfo.detailAddress + '&orderStatusT=' + this.data.orderInfo.orderStatusT,
    })
  },
  complaint() {
    //投诉
    wx.navigateTo({
      url: '/pages/complaint/complaint?orderid=' + this.data.orderid,
    })
  },
  removeOrder(e) {
    if (e.currentTarget.dataset.type == 1) {
      this.setData({
        contModel: '您确定要取消订单吗？'
      })
    } else if (e.currentTarget.dataset.type == 2) {
      this.setData({
        contModel: '您确定要完成订单吗？'
      })
    } else if (e.currentTarget.dataset.type == 3) {
      this.setData({
        contModel: '您确定要撤销投诉吗？'
      })
    }
    this.setData({
      modelType: e.currentTarget.dataset.type,
      showModel: true
    })
  },
  toPay() {
    let totalP = 0;
    if (this.data.orderInfo.type == 1) {
      //定价
      totalP = this.data.orderInfo.price;
    } else {
      this.data.biddingList.map(item => {
        if ((item.totalMoney - 0) <= 0) {
          totalP
        } else {
          totalP += (item.totalMoney - 0)
        }
      })
      totalP = totalP.toFixed(2)
      //竞价
    }
    this.setData({
      totalP: totalP
    })
    this.setData({
      showPay: true
    })
  },
  confirmPay() {
    //支付
    let that = this,
      arr = [];
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    this.data.biddingList.map(item => {
      arr.push(item.id)
    })
    request.post(Api.userPayBidding, {
      data: {
        userId: this.data.userId,
        payType: 1,
        orderId: this.data.orderid,
        classifyId: this.data.orderInfo.classifyId,
        biddingIds: arr.join(',')
      }
    }).then(res => {
      if (res.code == 0) {
        let data = JSON.parse(res.msg);
        wx.requestPayment({
          timeStamp: data.timeStamp,
          nonceStr: data.nonceStr,
          package: data.package,
          signType: 'MD5',
          paySign: data.paySign,
          success() {
            that.setData({
              showPay: false
            })
            wx.showToast({
              title: '支付成功',
              icon: 'none'
            })
            if (prevPage.route == 'pages/order/order') {
              prevPage.setData({
                activeNav: 4
              })
              prevPage.post();
            }
            setTimeout(() => {
              wx.navigateBack();
            }, 1500)
          },
          fail() {
            wx.showToast({
              title: '支付失败',
              icon: 'none'
            });
            return;
          }
        })
      }
    })
  },
  save() {
    this.closeModel();
    let that = this,
      url = '',
      data = {},
      pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    if (this.data.modelType == 1) {
      //取消订单
      url = Api.cancelOrder;
      data = {
        orderId: this.data.orderid,
      }
    } else if (this.data.modelType == 2) {
      //完成订单
      url = Api.completelOrder;
      data = {
        orderId: this.data.orderid,
      }
    } else if (this.data.modelType == 3) {
      //撤销投诉
      url = Api.complaintOrder;
      data = {
        id: this.data.orderid,
        complaintStatus: 2,
      }
    }
    request.post(url, {
      data: data
    }).then(res => {
      if (res.code == 0) {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
        if (prevPage.route == 'pages/order/order') {
          prevPage.post();
        }
        setTimeout(() => {
          if (that.data.modelType == 1) {
            wx.navigateBack();
          } else {
            that.post();
          }
        }, 1500)
      }
    })
  },
  closeModel() {
    this.setData({
      showModel: false
    })
  },
  onClosepay() {
    this.setData({
      showPay: false
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