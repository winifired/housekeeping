import Api from "../../utils/api.js";
import request from "../../utils/request.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    priceType: ['申请退款', '申请对工人处罚', '申请返工'],
    priceTypeValue: -1,
    reason: ['态度不好', '工作质量不合格', '中途加价', '迟到', '其他'],
    reasonIndex: -1,
    showWorker: false,
    biddingList: [],
    orderid: '',
    price:'',
    msg:'',
    name:[],
    id:[],
    imagesUrl: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderid: options.orderid
    });
    this.post();
  },
  post(){
    let that = this;
    request.post(Api.orderBiddingUserList, {
      data: {
        orderId: this.data.orderid,
      }
    }).then(res => {
      if (res.code == 0) {
        res.data.map(item=>{
          item['checked']=false;
        })
        that.setData({
          biddingList: res.data,
        });
      }
    })
  },
  open() {
    this.setData({
      showWorker: true
    })
  },
  onClose() {
    this.setData({
      showWorker: false
    })
  },
  changeReason(e){
    console.log(e.detail.value)
    this.setData({
      reasonVal:this.data.reason[e.detail.value],
      reasonIndex:e.detail.value,
    })
  },
  changePriceType(e) {
    console.log(e.detail.value)
    this.setData({
      priceTypeVal:this.data.priceType[e.detail.value],
      priceTypeValue:e.detail.value,
    })
  },
  chooseItem(e){
    let index=e.currentTarget.dataset.index;
    this.data.biddingList[index].checked=!this.data.biddingList[index].checked;
    this.setData({
      biddingList:this.data.biddingList,
    });
  },
  save(){
    this.onClose();
    let name=[],id=[];
    this.data.biddingList.map(item=>{
      if(item.checked){
        name.push(item.userName);
        id.push(item.userId);
      }
    })
    this.setData({
      name:name,
      id:id
    })
  },
getImg(e){
    this.setData({
      imagesUrl:e.detail
    })
  },
  formSubmit(){
    let data={
      id: this.data.orderid,
      complaintUser:this.data.id.join(','),
      complaintReason:this.data.reasonVal,
      complaintMoney:this.data.price,
      complaintUrl:this.data.imagesUrl.length>0?JSON.stringify(this.data.imagesUrl):'',
      complaintPurpose:this.data.msg,
      complaintInfo:this.data.priceTypeVal,
      complaintStatus:1,
    }
    for(let i in data){
      if(!data[i]){
        wx.showToast({
          title: '请输入详细的投诉信息',
          icon:'none'
        });
        return;
      }
    }
    let that = this;
    request.post(Api.complaintOrder, {
      data:data
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