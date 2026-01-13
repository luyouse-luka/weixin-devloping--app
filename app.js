// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: (res) => {
        if (res.code) {
          console.log('获取到的code：', res.code); // 复制这个code，用于下一步调用接口
        } else {
          console.error('wx.login失败：', res.errMsg);
        }
      }
    });



    // 动态加载自定义字体（如果使用网络字体）
    this.loadCustomFont();
  },

  // 动态加载自定义字体（使用wx.loadFontFace API）
  loadCustomFont() {
    // 方式1: 使用本地字体文件（需要先下载字体文件到fonts文件夹）
    // 注意：小程序不支持直接使用本地字体文件，需要使用网络字体或base64

    const loadFont = (family, url) => {
      wx.loadFontFace({
        family: family,
        source: `url("${url}")`,
        success: (res) => {
          console.log(`${family} 字体加载成功`, res);
          this.globalData.fontLoaded = true;
        },
        fail: (err) => {
          console.error(`${family} 字体加载失败`, err);
        }
      });
    };


    loadFont('dlzh', 'https://family-app-fonts.oss-cn-shanghai.aliyuncs.com/subset/dlzh-subset.woff2');
    loadFont('FeiHuaSong', 'https://family-app-fonts.oss-cn-shanghai.aliyuncs.com/subset/feihuasong-subset.woff2');
  },
  globalData: {
    userInfo: null,
    // 订阅消息模板ID
    subscribeMessageTemplateId: '9sZAVw0BqGddS5StFPK-cL999aC2Pj8GDzhXMgvjZIU',
    // 管理者的openid（需要预先获取并保存）
    managerOpenId: '0e3D4Jkl2g830h4lQvll2cw6iW3D4Jk2' // 例如: 'oUpF8uMuAJO_M2pxb1Q9zNjWeS6o'
  }
})
