import VhallPublisher from '../../minisdk/vhall-mpsdk-publisher-2.0.0'
Page({
  /**
   * 页面的初始数据
   */
  name: null,
  data: {
    url: null,
    showSlider: false,
    enableCamera: true,
    singleAudio: false,
    enableMic: true
  },
  vhallPublisher: null,
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    console.log(options)
    this.setData({ enableCamera: !Number(options.singleAudio), singleAudio: Number(options.singleAudio) })
    this.vhallPublisher = new VhallPublisher()
    const { url } = await this.vhallPublisher.createInstance({ pusherId: 'live-pusher', ...options, singleAudio: Number(options.singleAudio) })
    this.setData({ url })
    this.startPreview()
    this.vhallPublisher.setMICVolume({ volume: 5 })
  },
  testEnableMic() {
    this.setData({ enableMic: !this.data.enableMic })
    wx.showToast({ icon: 'none', title: `${this.data.enableMic ? '开启' : '关闭'}麦克风` })
  },
  statechange(e) {
    this.vhallPublisher.statechange(e)
  },
  netstatuschange(e) {
    console.log(e)
    this.vhallPublisher.netstatuschange(e)
  },
  pusherror(e) {
    this.vhallPublisher.pusherror(e)
  },
  bgmstart(e) {
    this.vhallPublisher.bgmstart(e)
  },
  bgmprogress(e) {
    this.vhallPublisher.bgmprogress(e)
  },
  bgmcomplete(e) {
    this.vhallPublisher.bgmcomplete(e)
  },

  start() {
    this.vhallPublisher.start({
      success: () => {
        wx.showToast({ title: '开始推流', icon: 'none' })
      }
    })
  },
  stop() {
    this.vhallPublisher.stop()
    wx.showToast({ title: '停止推流', icon: 'none' })
  },
  switchCamera() {
    this.vhallPublisher.switchCamera()
  },
  snapshot() {
    this.vhallPublisher.snapshot({
      success: res => {
        console.log(res)
        this.savePoster(res.tempImagePath)
      }
    })
  },
  /**
   * 开关手电筒，只有当前摄像头为后置摄像头时生效
   */
  toggleTorch() {
    wx.showToast({ title: '开关手电筒，只有当前摄像头为后置摄像头时生效', icon: 'none' })
    this.vhallPublisher.toggleTorch()
  },
  setMICVolume() {
    this.setData({ showSlider: !this.data.showSlider })
  },
  startPreview() {
    wx.showToast({ title: '开启摄像头预览', icon: 'none' })
    this.vhallPublisher.startPreview()
  },
  stopPreview() {
    wx.showToast({ title: '关闭摄像头预览', icon: 'none' })
    this.vhallPublisher.stopPreview()
  },
  //点击保存到相册
  savePoster(url) {
    wx.saveImageToPhotosAlbum({
      filePath: url,
      success() {
        wx.showToast({ title: '已保存到相册', icon: 'none' })
      },
      fail(res) {
        // 拒绝授权时，则进入手机设置页面，可进行授权设置
        if (res.errMsg === 'saveImageToPhotosAlbum:fail:auth denied' || res.errMsg === 'saveImageToPhotosAlbum:fail auth deny') {
          // 这边微信做过调整，必须要在按钮中触发，因此需要在弹框回调中进行调用
          wx.showModal({
            title: '提示',
            content: '需要您授权保存相册',
            showCancel: false,
            success() {
              wx.openSetting({
                success(settingdata) {
                  if (settingdata.authSetting['scope.writePhotosAlbum']) {
                    wx.showToast({ title: '获取权限成功,再次点击图片即可保存', icon: 'none' })
                  } else {
                    wx.showToast({ title: '获取权限失败，将无法保存到相册哦~', icon: 'none' })
                  }
                }
              })
            }
          })
        }
      }
    })
  },
  sliderchange(e) {
    this.vhallPublisher.setMICVolume({ volume: e.detail.value / 100 })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    console.log('onReady')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('onShow')
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log('onHide')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    console.log('destroy')
    try {
      this.vhallPublisher.destroy()
    } catch (error) {
      console.warn(error)
    }
    this.vhallPublisher = null
  }
})
