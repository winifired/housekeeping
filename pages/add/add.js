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
    imagesUrl: [],
    priceType: ['竞价发布', '定价发布'],
    priceTypeValue: -1,
    codeVal: '',
    phone: '',
    onlineCode: '',
    dateTimeArray1: null, //活动时间
    dateTime1: null,
    active_time: '',
    minDate: '',
    maxDate: '',
    currentDate: '',
    showDate: false,
    filter(type, options) {
      if (type === 'minute') {
        return options.filter((option) => option % 30 === 0);
      }
      return options;
    },
    categoryId: '',
    classifyId: '',
    showType: [],
    typeIndex: [0, 0],
    typeList: [],
    typeListChild: [],
    classifyType: '',
    demandUrl: [],
    address: '',
    userId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userId: wx.getStorageSync('userId') || '',
      categoryId: options.categoryId || '',
      classifyId: options.classifyId || ''
    });
    
    if (!this.data.userId) {
      wx.reLaunch({
        url: '/pages/login/login',
      })
      return;
    }
    this.getDate();
    this.postType();
  },
  getImg(e) {
    this.setData({
      demandUrl: e.detail
    })
  },
  postType() {
    let that = this;
    request.post(Api.categoryList).then(res => {
      // console.log(res)
      if (res.code == 0 && res.data.length > 0) {
        res.data.map((item, index) => {
          item['name'] = item.categoryName;
          if (that.data.categoryId && item.id == that.data.categoryId) {
            that.setData({
              classifyType: item.categoryName,
              typeIndex: [index, 0]
            })
          }
        })
        that.setData({
          typeList: res.data
        });
        if (that.data.categoryId) {
          that.postTypeChild(that.data.categoryId)
        } else {
          that.postTypeChild(res.data[0].id)
        }
      }
    })
  },
  postTypeChild(id) {
    let that = this,
      arr = [];
    request.post(Api.classifyListByCategory, {
      data: {
        categoryId: id
      }
    }).then(res => {
      // console.log(res)
      if (res.code == 0) {
        if (res.data.length > 0) {
          res.data.map((item, index) => {
            item['name'] = item.classifyName;
            if (that.data.classifyId && item.id == that.data.classifyId) {
              that.setData({
                classifyType: that.data.classifyType + '—' + item.classifyName,
                typeIndex: [that.data.typeIndex[0], index]
              })
            }
          })
        }
        that.setData({
          typeListChild: res.data
        })
        that.getCityElse();
      }
    })
  },
  getCityElse() {
    let typeArr = this.data.typeList,
      child = this.data.typeListChild;
    this.data.showType[0] = typeArr;
    this.data.showType[1] = child;
    this.setData({
      showType: this.data.showType
    });
  },
  bindTypeChange(e) {
    let index = e.detail.value,
      typeList = this.data.typeList,
      typeListChild = this.data.typeListChild;
    if (typeListChild.length > 0) {
      this.data.classifyType = typeList[index[0]].name + '—' + typeListChild[index[1]].name;
      this.data.classifyId = typeListChild[index[1]].id;
    } else {
      this.data.classifyType = typeList[index[0]].name;
      this.data.classifyId = '';
    }
    this.data.categoryId = typeList[index[0]].id;
    this.setData({
      typeIndex: index,
      classifyType: this.data.classifyType,
      categoryId: this.data.categoryId,
      classifyId: this.data.classifyId,
    });
  },
  typeColumn(e) {
    let value = e.detail.value;
    var data = {
      typeIndex: this.data.typeIndex
    };
    data.typeIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        this.postTypeChild(this.data.typeList[value].id);
        data.typeIndex[1] = 0;
        break;
    }
    this.setData(data);
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
    data['demandUrl'] = this.data.demandUrl.length>0?JSON.stringify(this.data.demandUrl):'';
    data['categoryId'] = this.data.categoryId;
    data['classifyId'] = this.data.classifyId;
    data['userId'] = this.data.userId;
    data['type'] = this.data.priceTypeValue == 1 ? 1 : (this.data.priceTypeValue == 0 ? 2 : '');
    if(!this.data.classifyId){
      wx.showToast({
        title: '请选择二级分类',
        icon: 'none'
      });
      return;
    }
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
    request.post(Api.addOrder, {
      data: data
    }).then(res => {
      // console.log(res)
      if (res.code == 0) {
        wx.redirectTo({
          url: '/pages/order/order?activeNav=9',
        })
      }
    })
  },
  chooseAddr() {
    let that = this;
    wx.chooseLocation({
      success(res) {
        that.setData({
          address: res.address + res.name
        })
      },
    })
  },
  onInput(event) {
    let val = new Date(event.detail);
    let year = val.getFullYear();
    let timeValue = `${year}-${this.fiflTime(val.getMonth() + 1)}-${this.fiflTime(val.getDate())} ${this.fiflTime(val.getHours())}:${this.fiflTime(val.getMinutes())}`
    this.setData({
      currentDate: timeValue,
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