// pages/uploadFonts/uploadFonts.js
const app = getApp();

Page({
  data: {
    uploadStatus: {
      dlzh: { status: 'pending', message: '等待上传' },
      feiHuaSongRegular: { status: 'pending', message: '等待上传' },
      feiHuaSongMedium: { status: 'pending', message: '等待上传' },
      feiHuaSongSemiBold: { status: 'pending', message: '等待上传' },
      feiHuaSongBold: { status: 'pending', message: '等待上传' }
    },
    fontUrls: {
      dlzh: '',
      feiHuaSongRegular: '',
      feiHuaSongMedium: '',
      feiHuaSongSemiBold: '',
      feiHuaSongBold: ''
    },
    isCloudEnabled: false
  },

  onLoad() {
    // 检查是否启用云开发
    this.checkCloudEnabled();
  },

  // 检查云开发是否启用
  checkCloudEnabled() {
    if (wx.cloud) {
      wx.cloud.init({
        env: 'your-env-id', // 需要替换为实际的云环境ID
        traceUser: true
      });
      this.setData({ isCloudEnabled: true });
    } else {
      wx.showModal({
        title: '提示',
        content: '云开发未启用，请先在微信开发者工具中开通云开发',
        showCancel: false
      });
    }
  },

  // 上传字体文件到云存储
  async uploadFont(fontName, localPath) {
    return new Promise((resolve, reject) => {
      const cloudPath = `fonts/${fontName}`;

      wx.cloud.uploadFile({
        cloudPath: cloudPath,
        filePath: localPath,
        success: (res) => {
          console.log(`${fontName}上传成功`, res);
          resolve(res.fileID);
        },
        fail: (err) => {
          console.error(`${fontName}上传失败`, err);
          reject(err);
        }
      });
    });
  },

  // 上传 dlzh 字体
  async uploadDlzh() {
    this.updateStatus('dlzh', 'uploading', '正在上传...');

    try {
      // 注意：小程序无法直接读取本地文件系统
      // 需要使用 chooseMessageFile 或从临时文件路径上传
      // 这里提供一个手动上传的方案

      wx.showModal({
        title: '上传字体',
        content: '请使用以下步骤上传字体：\n1. 在微信开发者工具中打开"云开发"\n2. 进入"存储" -> "文件管理"\n3. 上传 fonts/dlzh.woff 文件\n4. 复制文件ID并粘贴到下方',
        editable: true,
        placeholderText: '粘贴云存储文件ID（cloud://...）',
        success: (res) => {
          if (res.confirm && res.content) {
            const fileId = res.content.trim();
            this.setData({
              'fontUrls.dlzh': fileId
            });
            this.updateStatus('dlzh', 'success', '上传成功');
            this.saveFontUrl('dlzhFontUrl', fileId);
          }
        }
      });
    } catch (error) {
      this.updateStatus('dlzh', 'error', '上传失败：' + error.message);
    }
  },

  // 上传 FeiHuaSong Regular
  async uploadFeiHuaSongRegular() {
    this.uploadFontWithModal('feiHuaSongRegular', 'FeiHuaSong-Regular.woff', 'feiHuaSongFontUrl');
  },

  // 上传 FeiHuaSong Medium
  async uploadFeiHuaSongMedium() {
    this.uploadFontWithModal('feiHuaSongMedium', 'FeiHuaSong-Medium.woff', 'feiHuaSongMediumUrl');
  },

  // 上传 FeiHuaSong SemiBold
  async uploadFeiHuaSongSemiBold() {
    this.uploadFontWithModal('feiHuaSongSemiBold', 'FeiHuaSong-SemiBold.woff', 'feiHuaSongSemiBoldUrl');
  },

  // 上传 FeiHuaSong Bold
  async uploadFeiHuaSongBold() {
    this.uploadFontWithModal('feiHuaSongBold', 'FeiHuaSong-Bold.woff', 'feiHuaSongBoldUrl');
  },

  // 通用上传方法（使用模态框输入文件ID）
  uploadFontWithModal(fontKey, fileName, configKey) {
    this.updateStatus(fontKey, 'uploading', '等待输入...');

    wx.showModal({
      title: `上传 ${fileName}`,
      content: `请按照以下步骤操作：\n1. 在微信开发者工具中打开"云开发"\n2. 进入"存储" -> "文件管理"\n3. 上传 fonts/${fileName} 文件\n4. 复制文件ID并粘贴到下方`,
      editable: true,
      placeholderText: '粘贴云存储文件ID（cloud://...）',
      success: (res) => {
        if (res.confirm && res.content) {
          const fileId = res.content.trim();
          this.setData({
            [`fontUrls.${fontKey}`]: fileId
          });
          this.updateStatus(fontKey, 'success', '上传成功');
          this.saveFontUrl(configKey, fileId);
        } else {
          this.updateStatus(fontKey, 'pending', '已取消');
        }
      }
    });
  },

  // 更新上传状态
  updateStatus(fontKey, status, message) {
    this.setData({
      [`uploadStatus.${fontKey}.status`]: status,
      [`uploadStatus.${fontKey}.message`]: message
    });
  },

  // 保存字体URL到全局配置
  saveFontUrl(key, url) {
    app.globalData[key] = url;
    // 也可以保存到本地存储
    wx.setStorageSync(`font_${key}`, url);

    // 重新加载字体
    app.loadCustomFonts();
  },

  // 一键配置所有字体（从本地存储读取）
  loadSavedFontUrls() {
    const keys = [
      { storageKey: 'font_dlzhFontUrl', globalKey: 'dlzhFontUrl', fontKey: 'dlzh' },
      { storageKey: 'font_feiHuaSongFontUrl', globalKey: 'feiHuaSongFontUrl', fontKey: 'feiHuaSongRegular' },
      { storageKey: 'font_feiHuaSongMediumUrl', globalKey: 'feiHuaSongMediumUrl', fontKey: 'feiHuaSongMedium' },
      { storageKey: 'font_feiHuaSongSemiBoldUrl', globalKey: 'feiHuaSongSemiBoldUrl', fontKey: 'feiHuaSongSemiBold' },
      { storageKey: 'font_feiHuaSongBoldUrl', globalKey: 'feiHuaSongBoldUrl', fontKey: 'feiHuaSongBold' }
    ];

    keys.forEach(({ storageKey, globalKey, fontKey }) => {
      const savedUrl = wx.getStorageSync(storageKey);
      if (savedUrl) {
        app.globalData[globalKey] = savedUrl;
        this.setData({
          [`fontUrls.${fontKey}`]: savedUrl
        });
        this.updateStatus(fontKey, 'success', '已配置');
      }
    });
  },

  // 测试字体加载
  testFonts() {
    wx.showLoading({ title: '测试中...' });

    setTimeout(() => {
      wx.hideLoading();
      const fontsLoaded = app.globalData.fontsLoaded;
      if (fontsLoaded) {
        wx.showToast({
          title: '字体加载成功',
          icon: 'success'
        });
      } else {
        wx.showModal({
          title: '提示',
          content: '字体可能还未加载完成，请检查控制台日志',
          showCancel: false
        });
      }
    }, 2000);
  }
});





