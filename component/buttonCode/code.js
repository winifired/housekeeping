import Api from "../../utils/api.js";
import request from "../../utils/request.js";
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    phone: {
      type: [String, Number],
      value: '',
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    code: '获取验证码',
    disabled: false,
    timer: null
  },
  pageLifetimes: {
    hide: function () {
      clearInterval(this.data.timer)
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    getCode() {
      let that = this;
      var reg = 11 && /^((13|14|15|16|17|18|19)[0-9]{1}\d{8})$/;
      if (that.data.phone == '' || !reg.test(that.data.phone)) {
        wx.showToast({
          title: '请输入正确的手机号码',
          icon: 'none'
        })
        return;
      }
      that.setData({
        disabled: true
      });
      var times = 60;
      that.data.timer = setInterval(() => {
        that.setData({
          code: times-- + 's'
        })
        if (that.data.code == '1s') {
          that.setData({
            disabled: false,
            code: '获取验证码'
          })
          clearInterval(that.data.timer)
        }
      }, 1000)
      that.setData({
        timer: that.data.timer
      })
      request.post(Api.sendMessage, {
        data: {
          phone: that.data.phone
        }
      }).then(res => {
        // console.log(res)
        if (res.code == 0) {
          that.triggerEvent('getCode', res.data);
        } else {
          that.setData({
            disabled: false
          })
        }
      })
    }
  }
})