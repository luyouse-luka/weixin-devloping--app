/**
 * 获取用户openid工具
 * 用于获取管理者的openid以便发送订阅消息
 */

/**
 * 获取当前用户的openid
 * @param {Function} callback 回调函数，参数为openid
 */
function getCurrentUserOpenId(callback) {
  wx.login({
    success: (res) => {
      if (res.code) {
        // 方式1: 如果有云开发，通过云函数获取
        if (typeof wx.cloud !== 'undefined') {
          wx.cloud.callFunction({
            name: 'getOpenId',
            data: {},
            success: (cloudRes) => {
              const openid = cloudRes.result.openid;
              if (openid) {
                wx.setStorageSync('userOpenId', openid);
                callback && callback(openid);
              } else {
                console.error('获取openid失败');
                callback && callback(null);
              }
            },
            fail: (err) => {
              console.error('云函数调用失败:', err);
              // 方式2: 通过后端接口获取
              getOpenIdFromServer(res.code, callback);
            }
          });
        } else {
          // 方式2: 通过后端接口获取
          getOpenIdFromServer(res.code, callback);
        }
      } else {
        console.error('登录失败！', res.errMsg);
        callback && callback(null);
      }
    },
    fail: (err) => {
      console.error('wx.login失败:', err);
      callback && callback(null);
    }
  });
}

/**
 * 通过后端服务器获取openid
 * @param {String} code 微信登录code
 * @param {Function} callback 回调函数
 */
function getOpenIdFromServer(code, callback) {
  // 注意：这里需要替换为你的后端接口地址
  const serverUrl = 'YOUR_SERVER_URL/api/getOpenId'; // 替换为实际的后端接口
  
  if (serverUrl === 'YOUR_SERVER_URL/api/getOpenId') {
    console.warn('后端接口未配置，无法获取openid');
    callback && callback(null);
    return;
  }

  wx.request({
    url: serverUrl,
    method: 'POST',
    data: {
      code: code
    },
    success: (res) => {
      if (res.data && res.data.openid) {
        const openid = res.data.openid;
        wx.setStorageSync('userOpenId', openid);
        callback && callback(openid);
      } else {
        console.error('服务器返回openid失败:', res);
        callback && callback(null);
      }
    },
    fail: (err) => {
      console.error('请求服务器失败:', err);
      callback && callback(null);
    }
  });
}

/**
 * 设置管理者openid
 * @param {String} openid 管理者的openid
 */
function setManagerOpenId(openid) {
  wx.setStorageSync('managerOpenId', openid);
  const app = getApp();
  if (app && app.globalData) {
    app.globalData.managerOpenId = openid;
  }
}

/**
 * 获取管理者openid
 * @returns {String} 管理者的openid
 */
function getManagerOpenId() {
  return wx.getStorageSync('managerOpenId') || '';
}

module.exports = {
  getCurrentUserOpenId,
  getOpenIdFromServer,
  setManagerOpenId,
  getManagerOpenId
};



