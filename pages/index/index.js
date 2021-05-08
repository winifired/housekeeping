import Api from "../../utils/api.js"
import request from "../../utils/request.js"
Page({
  data: {
    banner: [],
    categoryList: [],
    type1:[],
    type2:[],
    userId:''
  },
  onLoad() {
    this.setData({
      userId:wx.getStorageSync('userId')
    })
    this.carouselList();
    this.classify();
  },
  onPullDownRefresh: function() {
    this.carouselList();
    this.classify();
    setTimeout(()=>{
      wx.stopPullDownRefresh();
    },1500)
  },
  classify(){
    let that = this;
    request.post(Api.categoryList).then(res => {
      if (res.code == 0 && res.data.length > 0) {
        let arr = [];
        for (let i = 0; i < res.data.length; i += 10) {
          arr.push(res.data.slice(i, i + 10))
        }
        that.setData({
          categoryList: arr
        })
      }else{
        that.setData({
          categoryList:[]
        })
      }
    });
    request.post(Api.recommendClassifyList,{
      data:{
        homePosition:1
      }
    }).then(res => {
      if (res.code == 0) {
        that.setData({
          type1: res.data
        })
      }
    });
    request.post(Api.recommendClassifyList,{
      data:{
        homePosition:2
      }
    }).then(res => {
      if (res.code == 0) {
        that.setData({
          type2: res.data
        })
      }
    });
  },
  carouselList() {
    let that = this;
    request.post(Api.carouselList, {
      data:{type: 2}
    }).then(res => {
      if (res.code == 0) {
        that.setData({
          banner: res.data
        })
      }
    });
  }
})