import Api from "../../utils/api.js";
import request from "../../utils/request.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '', //协议名称
    info: {},
    type: 1, //1 轮播图 2分类详情 3规则
    safeBottom: wx.getStorageSync("safeBottom"),
    detailId: '',
    elseType:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      type: options.type,
      detailId: options.detailId||'',
      elseType:options.elseType
    });
    this.post();
  },
  toAdd() {
    if (this.data.type == 3) {
      wx.reLaunch({
        url: '/pages/add/add?categoryId=' + this.data.info.categroyId + '&classifyId=' + this.data.info.id,
      })
    } else if (this.data.type == 2) {
      wx.reLaunch({
        url: '/pages/add/add?categoryId=' + this.data.info.id,
      })
    }

  },
  post() {
    let that = this,
      url, data = {};
    if (this.data.type == 1) {
      //banner详情
      url = Api.carouselInfo;
      data = {
        carouselId: this.data.detailId
      }
    } else if (this.data.type == 2) {
      // 轮播分类
      url = Api.categoryInfo;
      data = {
        categoryId: this.data.detailId
      }
    } else if (this.data.type == 3) {
      // 家电 维修分类
      url = Api.classifyInfo;
      data = {
        classifyId: this.data.detailId
      }
    }else if (this.data.type == 4) {
      // 帮助中心
      url = Api.ruleInfo;
      data = {
        ruleId: this.data.elseType
      }
    }
    request.post(url, {
      data: data
    }).then(res => {
      // console.log(res)
      if (res.code == 0) {
        if(that.data.type==4){
          res.data.ruleContent = res.data.ruleContent.replace(/\<table/gi, '<table class="table_rich"');
          res.data.ruleContent = res.data.ruleContent.replace(/\<img/gi, '<img class="img_rich"');
        }else{
          res.data.detail = res.data.detail.replace(/\<table/gi, '<table class="table_rich"');
          res.data.detail = res.data.detail.replace(/\<img/gi, '<img class="img_rich"');
        }
        let name = '';
        if(that.data.type==1){
          name=res.data.name;
        }else if(that.data.type==2){
          name=res.data.categoryName;
        }else if(that.data.type==3){
          name=res.data.classifyName;
        }else if(that.data.type==4){
          name=res.data.ruleName;
        }
        wx.setNavigationBarTitle({
          title:name,
        });
        that.setData({
          info: res.data
        })
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