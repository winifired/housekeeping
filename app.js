App({
  onLaunch() {
    const syStem=wx.getSystemInfoSync();
    let pxToRpxScale = 750 / syStem.windowWidth;
    let safeBottom=0;
    if((syStem.screenHeight-syStem.safeArea.bottom)>0){
      safeBottom=parseInt(Number(syStem.screenHeight-syStem.safeArea.bottom)*pxToRpxScale);
    }
    wx.setStorageSync('safeBottom', safeBottom);
    wx.$globalData = {
      userInfo: null,
      headerHeight: 0,
      statusBarHeight: 0,
      sdkAppID:'1400511998',
      userID: '',
      userSig: '',
      token: '',
      expiresIn: '',
      phone: '',
      sessionID: '',
    }
    this.checkDeviceAuthorize().then((result) => {
      console.log('授权成功', result)
    }).catch((error) => {
      console.log('没有授权', error)
    })
  },
  globalData: {
    userInfo: null
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
})
