/**
 * 加载本地字体文件工具
 * 注意：微信小程序不支持直接使用本地字体文件路径
 * 需要将字体文件上传到云存储或服务器
 */

/**
 * 使用云存储加载字体
 * @param {string} fontFamily 字体名称
 * @param {string} cloudPath 云存储路径，例如: 'cloud://your-env-id.xxx/fonts/introrust-base.woff'
 */
function loadFontFromCloud(fontFamily, cloudPath) {
  return new Promise((resolve, reject) => {
    wx.loadFontFace({
      family: fontFamily,
      source: `url("${cloudPath}")`,
      success: (res) => {
        console.log(`${fontFamily}字体加载成功`, res);
        resolve(res);
      },
      fail: (err) => {
        console.error(`${fontFamily}字体加载失败`, err);
        reject(err);
      }
    });
  });
}

/**
 * 使用网络URL加载字体
 * @param {string} fontFamily 字体名称
 * @param {string} url 字体文件URL
 */
function loadFontFromUrl(fontFamily, url) {
  return new Promise((resolve, reject) => {
    wx.loadFontFace({
      family: fontFamily,
      source: `url("${url}")`,
      success: (res) => {
        console.log(`${fontFamily}字体加载成功`, res);
        resolve(res);
      },
      fail: (err) => {
        console.error(`${fontFamily}字体加载失败`, err);
        reject(err);
      }
    });
  });
}

/**
 * 上传字体文件到云存储
 * @param {string} filePath 本地文件路径
 * @param {string} cloudPath 云存储路径
 */
function uploadFontToCloud(filePath, cloudPath) {
  return new Promise((resolve, reject) => {
    wx.cloud.uploadFile({
      cloudPath: cloudPath,
      filePath: filePath,
      success: (res) => {
        console.log('字体文件上传成功', res);
        resolve(res.fileID);
      },
      fail: (err) => {
        console.error('字体文件上传失败', err);
        reject(err);
      }
    });
  });
}

module.exports = {
  loadFontFromCloud,
  loadFontFromUrl,
  uploadFontToCloud
};

