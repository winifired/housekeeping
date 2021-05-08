let myaudio = wx.createInnerAudioContext({});
import Api from "../../utils/api.js"
import request from "../../utils/request.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    safeBottom: Number(30 + wx.getStorageSync("safeBottom")) + 'rpx',
    showInput: true,
    idAudio: true, //true可以录音 false不可以
    inpvalue: '', //录音文件
    orderid: '',
    pageNum: 1,
    list: [],
    total: 0,
    userId: '',
    focus: false,
    replayId: 0, //回复的一级id
    content: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderid: options.orderid,
      userId: wx.getStorageSync('userId'),
    });
    this.post();
  },

  post() {
    let that = this;
    request.post(Api.commentList, {
      data: {
        orderId: this.data.orderid,
        pageNum: this.data.pageNum,
        pageSize: 20,
      }
    }).then(res => {
      if (res.code == 0) {
        res.data.rows.map(item => {
          if (item.commentType == 2) {
            item.play = false;
          }
          if (item.childrenList.length > 0) {
            item.childrenList.map(val => {
              if (val.commentType == 2) {
                val.play = false;
              }
            })
          }
        })
        that.setData({
          list: res.data.rows,
          total: res.data.total
        })
        console.log(that.data.list)
      }
    })
  },
  onReady: function () {
    wx.setInnerAudioOption({
      mixWithOther: false,
      obeyMuteSwitch: false,
      speakerOn: true,
      complete(res) {
        console.log(res)
      }
    })
  },
  toggleV() {
    this.setData({
      showInput: !this.data.showInput
    });
    if (!this.data.showInput) {
      this.checkAudio();
    }
  },
  checkAudio() {
    let that = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.record']) {
          wx.authorize({
            scope: 'scope.record',
            success() {
              that.setData({
                idAudio: true
              })
            },
            fail() {
              that.setData({
                idAudio: false
              })
              wx.showToast({
                title: '您拒绝了录音,可在设置中打开',
                icon: 'none'
              });
            }
          })
        } else {
          that.setData({
            idAudio: true
          })
        }
      }
    })
  },
  startHandel() {
    if (this.data.idAudio) {
      console.log("开始")
      wx.getRecorderManager().start({
        duration: 60000
      });
    }
  },
  endHandle: function () {
    var that = this;
    wx.getRecorderManager().onStop((res) => {
      if (!this.data.inpvalue) {
        wx.showLoading({
          mask: true,
          title: '语音识别中'
        })
      }
      wx.uploadFile({
        filePath: res.tempFilePath,
        name: 'file',
        url: Api.upload_file,
        success(res) {
          const data = JSON.parse(res.data);
          that.setData({
            inpvalue: data.url
          });
          that.sendMsg();
          wx.hideLoading()
        },
        fail(errr) {
          console.log(errr)
        }
      })
    })
    // 触发录音停止
    wx.getRecorderManager().stop();
  },
  audioPlay: function (e) {
    let list = this.data.list,
      itemId = e.currentTarget.dataset.findex,
      secindex = e.currentTarget.dataset.secindex,
      floor = e.currentTarget.dataset.floor,
      index = 0;
    for (let i in list) {
      if (list[i].id == itemId) {
        index = i;
      }
    }
    myaudio.src = e.currentTarget.dataset.url;
    console.log(floor)
    if (floor == 1) {
      //第一层
      if (!list[index].play) {
        myaudio.stop();
        myaudio.play();
        list[index].play = true;
      } else {
        myaudio.pause();
        list[index].play = false;
      }
      myaudio.onEnded(()=>{
        list[index].play = false;
        this.setData({
          list: list
        })
      })
      this.setData({
        list: list
      })
    } else {
      if (!list[index].childrenList[secindex].play) {
        myaudio.stop();
        myaudio.play();
        list[index].childrenList[secindex].play = true;
      } else {
        myaudio.pause();
        list[index].childrenList[secindex].play = false;
      }
      myaudio.onEnded(()=>{
        list[index].childrenList[secindex].play = false;
        this.setData({
          list: list
        })
      })
      this.setData({
        list: list
      })
    }
  },
  replay(e) {
    this.setData({
      focus: true,
      replayId: e.currentTarget.dataset.firstid,
    })
  },
  sendMsg() {
    let that = this,
      content = '';
    if (this.data.showInput) {
      content = this.data.content;
    } else {
      content = this.data.inpvalue;
    }
    request.post(Api.addComment, {
      data: {
        orderId: this.data.orderid,
        parentId: this.data.replayId, //	被评论的id 一级评论传0
        comment: content,
        commentType: this.data.showInput ? 1 : 2, //1=文字、2语音	展开	
        userId: this.data.userId
      }
    }).then(res => {
      if (res.code == 0) {
        that.setData({
          replayId: 0,
          content: '',
          inpvalue: '',
        })
        that.post();
      }
    })
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
    if (this.data.list.length < this.data.total) {
      this.data.pageNum++;
      this.setData({
        pageNum: this.data.pageNum
      });
      this.post();
    } else {
      return;
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})