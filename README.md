## 微吼云小程序推流 sdk

当前版本仅对 live-pusher 的方法进行了封装

### demo 体验

![](https://static.vhallyun.com/doc-images/5e74685e163ba_5e74685e.jpg)

### 目录结构

- index 为入口文件夹

- pusher 为推流页面

- minisdk 为 SDK 文件

- 其余为微信小程序必要文件

### 使用方法

```javascript
import VhallPublisher from '../../minisdk/vhall-mpsdk-publisher-2.0.0'
// 先实例化对象
this.vhallPublisher = new VhallPublisher()
/**
 * 再调用实例化SDK方法，之后所有的方法均应该在createInstance的成功函数后执行
 * @param {Object} opt- 包括 appId、channelId、accountId、token,
 * pusherId(live-pusher的id),
 * singleAudio（选填）: 是否为音频直播 0-否（默认） 1-是
 * 特别说明：纯音频直播和音视频直播推流地址和解码所需时间不同，请按需求选择
 * profile(选填): live-pusher清晰度，即mode属性，默认RTC
 * THIS(选填，小程序this，仅用于选中自定义组件中的live-pusher，不在自定义组件中可以不传)
 * @param {function} 成功函数
 * @param {function} 失败函数
 */
this.vhallPublisher.createInstance(
  opt,
  res => {
    // 成功函数，res结构：{url:推流地址}
    this.setData({ url: res.url })
  },
  e => {
    // 实例化失败
    console.log(e)
  }
)
```

#### 监听回调相关（生效的前提是 按照 statechange 函数的使用方式将 live-pusher 组件暴露的参数传入 sdk）

```javascript
/**
 * 开始播放的回调，在 组件状态码第一次为 1002 时触发
 */
this.vhallPublisher.on('connected', () => {
  console.log('connected')
  wx.showToast({ title: '开始推流', icon: 'none' })
})
/**
 * sdk正在重连时触发，sdk会在code为-1307、3001、3002、3003、3004、3005时，5s触发一次重连
 */
this.vhallPublisher.on('reconnecting', () => {
  console.log('reconnecting')
  wx.showToast({ title: '网络异常，重连中～', icon: 'none' })
})
/**
 * sdk重连取得新的推流地址函数
 * returns {Object} - url : 新的推流地址
 */
this.vhallPublisher.on('reconnectReady', ({ url }) => {
  console.log('reconnectReady')
  this.setData({ url }, () => {
    this.start()
  })
})
/**
 * 重连成功函数，重连开始后到组件状态码再一次返回1002时触发
 */
this.vhallPublisher.on('reconnected', () => {
  console.log('reconnected')
  wx.showToast({ title: '重连成功', icon: 'none' })
})
/**
 * 重连失败函数
 * returns {Object} - err : 接口返回的错误信息
 */
this.vhallPublisher.on('reconnectFail', err => {
  wx.showToast({ title: '重连失败', icon: 'none' })
  console.log('reconnectFail', err)
})
```

#### 销毁

```javascript
this.vhallPublisher.destroy()
```

#### LivePusherContext 方法列表，名称、参数遵循[小程序开发文档](https://developers.weixin.qq.com/miniprogram/dev/api/media/live/LivePusherContext.html)

```javascript
/**
 * 开始推流，同时开启摄像头预览
 * @param {Object} params - 选填
 * eg：
 * {
 * success:()=>{},
 * fail:()=>{},
 * complete:()=>{}, 成功/失败都会执行
 * }
 */
this.vhallPublisher.start(params)

/**
 * 停止推流，同时停止摄像头预览
 * @param {Object} params - 选填
 * eg：
 * {
 * success:()=>{},
 * fail:()=>{},
 * complete:()=>{}, 成功/失败都会执行
 * }
 */
this.vhallPublisher.stop(params)

/**
 * 切换前后摄像头
 * @param {Object} params - 选填
 * eg：
 * {
 * success:()=>{},
 * fail:()=>{},
 * complete:()=>{}, 成功/失败都会执行
 * }
 */
this.vhallPublisher.switchCamera(params)

/**
 * 快照
 * @param {String} params- 必填
 * eg：
 * {
 * success:res=>{res.tempImagePath -- 图片路径},
 * fail:()=>{},
 * complete:()=>{}, 成功/失败都会执行
 * }
 */
this.vhallPublisher.snapshot(params)

/**
 * 切换手电筒
 * @param {Object} params - 选填
 * eg：
 * {
 * success:()=>{},
 * fail:()=>{},
 * complete:()=>{},
 * }
 */
this.vhallPublisher.toggleTorch(params)

/**
 * 播放背景音
 * @param {Object} params- 必填
 * eg：
 * {
 * url:string - 音频资源地址
 * success:()=>{},
 * fail:()=>{},
 * complete:()=>{},
 * }
 */
this.vhallPublisher.playBGM(params)

/**
 * 暂停背景音
 * @param {Object} params- 选填
 * eg：
 * {
 * success:()=>{},
 * fail:()=>{},
 * complete:()=>{},
 * }
 */
this.vhallPublisher.pauseBGM(params)

/**
 * 恢复背景音
 * @param {Object} params- 选填
 * eg：
 * {
 * success:()=>{},
 * fail:()=>{},
 * complete:()=>{},
 * }
 */
this.vhallPublisher.resumeBGM(params)

/**
 * 停止背景音
 * @param {Object} params- 选填
 * eg：
 * {
 * success:()=>{},
 * fail:()=>{},
 * complete:()=>{},
 * }
 */
this.vhallPublisher.stopBGM(params)

/**
 * 设置背景音音量
 * @param {Object} params
 * eg：
 * {
 * volume : string 音量，范围（0-1）
 * success:()=>{},
 * fail:()=>{},
 * complete:()=>{},
 * }
 */
this.vhallPublisher.setBGMVolume(params)

/**
 * 设置麦克风音量
 * @param {Object} params
 * eg：
 * {
 * volume : number 音量，范围（0.0-1.0）
 * success:()=>{},
 * fail:()=>{},
 * complete:()=>{},
 * }
 */
this.vhallPublisher.setMICVolume(params)

/**
 * 开启摄像头预览
 * @param {Object} params- 选填
 * eg：
 * {
 * success:()=>{},
 * fail:()=>{},
 * complete:()=>{},
 * }
 */
this.vhallPublisher.startPreview(params)

/**
 * 关闭摄像头预览
 * @param {Object} params- 选填
 * eg：
 * {
 * success:()=>{},
 * fail:()=>{},
 * complete:()=>{},
 * }
 */
this.vhallPublisher.stopPreview(params)
```

#### live-pusher 组件监听方法列表，名称、参数遵循[小程序开发文档](https://developers.weixin.qq.com/miniprogram/dev/component/live-pusher.html)

```javascript
  /**
   * 状态变化事件，
   * @param {Object} params- detail = {code} 同微信文档
   */
  this.vhallPublisher.statechange(e)

  /**
   * 网络状态通知，
   * @param {Object} params- detail = {info} 同微信文档
   */
  this.vhallPublisher.netstatuschange(e)

  /**
   * 渲染错误事件，
   * @param {Object} params- detail = {errMsg, errCode} 同微信文档
   */
  this.vhallPublisher.pusherror(e)

  /**
   * 背景音开始播放时触发
   * @param {Object} params- 同微信文档
   */
  this.vhallPublisher.bgmstart(e)

  /**
   * 背景音进度变化时触发，
   * @param {Object} params- detail = {progress, duration} 同微信文档
   */
  this.vhallPublisher.bgmprogress(e)

  /**
   * 背景音播放完成时触发
   * @param {Object} params- 参考微信文档
   */
  this.vhallPublisher.bgmcomplete(e) {}
```

### 微信错误码摘录

| 代码  | 说明                                  |
| :---- | :------------------------------------ |
| 10001 | 用户禁止使用摄像头                    |
| 10002 | 用户禁止使用录音                      |
| 10003 | 背景音资源（BGM）加载失败             |
| 10004 | 等待画面资源（waiting-image）加载失败 |

#### 状态码（code）

| 代码  | 说明                                                      |
| :---- | :-------------------------------------------------------- |
| 1001  | 已经连接推流服务器                                        |
| 1002  | 已经与服务器握手完毕,开始推流                             |
| 1003  | 打开摄像头成功                                            |
| 1004  | 录屏启动成功                                              |
| 1005  | 推流动态调整分辨率                                        |
| 1006  | 推流动态调整码率                                          |
| 1007  | 首帧画面采集完成                                          |
| 1008  | 编码器启动                                                |
| -1301 | 打开摄像头失败                                            |
| -1302 | 打开麦克风失败                                            |
| -1303 | 视频编码失败                                              |
| -1304 | 音频编码失败                                              |
| -1305 | 不支持的视频分辨率                                        |
| -1306 | 不支持的音频采样率                                        |
| -1307 | 网络断连，且经多次重连抢救无效，更多重试请自行重启推流    |
| -1308 | 开始录屏失败，可能是被用户拒绝                            |
| -1309 | 录屏失败，不支持的 Android 系统版本，需要 5.0 以上的系统  |
| -1310 | 录屏被其他应用打断了                                      |
| -1311 | Android Mic 打开成功，但是录不到音频数据                  |
| -1312 | 录屏动态切横竖屏失败                                      |
| 1101  | 网络状况不佳：上行带宽太小，上传数据受阻                  |
| 1102  | 网络断连, 已启动自动重连                                  |
| 1103  | 硬编码启动失败,采用软编码                                 |
| 1104  | 视频编码失败                                              |
| 1105  | 新美颜软编码启动失败，采用老的软编码                      |
| 1106  | 新美颜软编码启动失败，采用老的软编码                      |
| 3001  | RTMP -DNS 解析失败                                        |
| 3002  | RTMP 服务器连接失败                                       |
| 3003  | RTMP 服务器握手失败                                       |
| 3004  | RTMP 服务器主动断开，请检查推流地址的合法性或防盗链有效期 |
| 3005  | RTMP 读/写失败                                            |

#### 网络状态数据（info）

| 键名         | 说明                                                  |
| :----------- | :---------------------------------------------------- |
| videoBitrate | 当前视频编/码器输出的比特率，单位 kbps                |
| audioBitrate | 当前音频编/码器输出的比特率，单位 kbps                |
| videoFPS     | 当前视频帧率                                          |
| videoGOP     | 当前视频 GOP,也就是每两个关键帧(I 帧)间隔时长，单位 s |
| netSpeed     | 当前的发送/接收速度                                   |
| netJitter    | 网络抖动情况，抖动越大，网络越不稳定                  |
| videoWidth   | 视频画面的宽度                                        |
| videoHeight  | 视频画面的高度                                        |
