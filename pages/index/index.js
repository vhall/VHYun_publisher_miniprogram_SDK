import indexData from '../../const/const'
Page({
  /**
   * 页面的初始数据
   */
  data: { ...indexData, singleAudio: 0 },
  allowPusher: false,
  gotoPusher() {
    this.allowPusher &&
      wx.navigateTo({
        url: `../pusher/pusher?appId=${this.data.appId}&accountId=${this.data.accountId}&token=${this.data.token}&roomId=${this.data.roomId}&singleAudio=${this.data.singleAudio}`
      })
  },

  getinput(e) {
    console.log(Number(e.detail.value))
    this.setData({ [e.currentTarget.id]: e.detail.value })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    const _this = this
    wx.getSetting({
      success(res) {
        console.log(res)
        if (res.authSetting['scope.camera'] && res.authSetting['scope.record']) {
          _this.allowPusher = true
        } else {
          let camera = new Promise((resolve, reject) => {
            wx.authorize({
              scope: 'scope.camera',
              success() {
                resolve()
              },
              fail() {
                reject()
              }
            })
          })

          let record = new Promise((resolve, reject) => {
            wx.authorize({
              scope: 'scope.record',
              success() {
                resolve()
              },
              fail() {
                reject()
              }
            })
          })

          Promise.all([camera, record])
            .then(() => {
              _this.allowPusher = true
            })
            .catch(() => {
              wx.showToast({ title: '拒绝授权将无法使用demo功能', icon: 'none' })
            })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    console.log('onShow')
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    console.log('onHide')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    console.log('onUnload')
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
})
