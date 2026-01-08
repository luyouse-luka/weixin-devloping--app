// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        // 可以在这里保存用户的openid用于后续通知
        console.log('登录成功，code:', res.code)
      }
    })

    // 动态加载自定义字体（如果使用网络字体）
    // this.loadCustomFont();
  },

  // 动态加载自定义字体（使用wx.loadFontFace API）
  loadCustomFont() {
    // 方式1: 使用本地字体文件（需要先下载字体文件到fonts文件夹）
    // 注意：小程序不支持直接使用本地字体文件，需要使用网络字体或base64
    
    // 方式2: 使用网络字体（需要将字体文件上传到服务器）
    /*
    wx.loadFontFace({
      family: 'CuteFont',
      source: 'url("https://your-server.com/fonts/cute-font.ttf")',
      success: (res) => {
        console.log('字体加载成功', res);
        this.globalData.fontLoaded = true;
      },
      fail: (err) => {
        console.error('字体加载失败', err);
        // 使用系统字体作为回退
      }
    });
    */
  },
  globalData: {
    userInfo: null,
    // 订阅消息模板ID
    subscribeMessageTemplateId: '9sZAVw0BqGddS5StFPK-cL999aC2Pj8GDzhXMgvjZIU',
    // 管理者的openid（需要预先获取并保存）
    managerOpenId: '' // 例如: 'oUpF8uMuAJO_M2pxb1Q9zNjWeS6o'
  }
})
