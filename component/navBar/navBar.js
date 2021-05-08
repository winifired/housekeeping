Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    innerText: {
      type: String,
      value: '',
    },
    hiddenBack: {
      type: String,
      value: 'false',
    },
    background: {
      type: String,
      value: '#ffffff',
    },
  },
  data: {
    // 这里是一些组件内部数据
    statusHeight: 0,
    ktxStatusHeight: 0,
    navigationHeight: 0,
  },
  ready: function () {
    let systemInfo = wx.getSystemInfoSync()
    // px转换到rpx的比例
    let pxToRpxScale = 750 / systemInfo.windowWidth;
    // 状态栏的高度
    let ktxStatusHeight = systemInfo.statusBarHeight * pxToRpxScale
    // 导航栏的高度
    let navigationHeight = 44 * pxToRpxScale
    this.setData({
      statusHeight: Number(ktxStatusHeight + navigationHeight),
      ktxStatusHeight: ktxStatusHeight,
      navigationHeight: navigationHeight,
    });
    this.triggerEvent('statusHeight', this.data.statusHeight);
  },
  methods: {
    // 这里是一个自定义方法
    customMethod: function () {},
    back() {
      let pages = getCurrentPages();
      if (pages.length >= 2) {
        wx.navigateBack();
      } else {
        wx.switchTab({
          url: '/pages/index/index',
        })
      }

    },
    goHome() {
      wx.reLaunch({
        url: '/pages/index/index',
      })
    }
  }
})