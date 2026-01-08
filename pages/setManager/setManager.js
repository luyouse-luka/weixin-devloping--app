// pages/setManager/setManager.js
// 管理者设置页面，用于获取管理者的openid并保存
const orderNotification = require('../../utils/getOpenId.js');

Page({
  data: {
    managerOpenId: '',
    currentUserOpenId: '',
    isManager: false,
    loading: false
  },

  onLoad() {
    this.checkManagerStatus();
    this.getCurrentUserOpenId();
  },

  // 获取当前用户的openid（仅用于显示）
  getCurrentUserOpenId() {
    const currentOpenId = wx.getStorageSync('userOpenId') || '';
    if (currentOpenId) {
      this.setData({
        currentUserOpenId: currentOpenId
      });
    } else {
      // 如果没有，尝试获取
      orderNotification.getCurrentUserOpenId((openid) => {
        if (openid) {
          this.setData({
            currentUserOpenId: openid
          });
        }
      });
    }
  },

  // 复制openid
  copyOpenId(e) {
    const openid = e.currentTarget.dataset.openid;
    if (openid) {
      wx.setClipboardData({
        data: openid,
        success: () => {
          wx.showToast({
            title: '已复制到剪贴板',
            icon: 'success',
            duration: 2000
          });
        }
      });
    }
  },

  // 检查是否是管理者
  checkManagerStatus() {
    const managerOpenId = orderNotification.getManagerOpenId();
    const currentOpenId = wx.getStorageSync('userOpenId') || '';
    
    this.setData({
      managerOpenId: managerOpenId,
      isManager: currentOpenId === managerOpenId && managerOpenId !== ''
    });
  },

  // 获取当前用户openid并设置为管理者
  setAsManager() {
    this.setData({ loading: true });
    
    orderNotification.getCurrentUserOpenId((openid) => {
      this.setData({ loading: false });
      
      if (openid) {
        orderNotification.setManagerOpenId(openid);
        wx.setStorageSync('userOpenId', openid);
        
        // 同时保存到globalData
        const app = getApp();
        if (app && app.globalData) {
          app.globalData.managerOpenId = openid;
        }
        
        this.setData({
          managerOpenId: openid,
          isManager: true
        });

        wx.showToast({
          title: '已设置为管理者',
          icon: 'success',
          duration: 2000
        });
      } else {
        wx.showToast({
          title: '获取openid失败',
          icon: 'none',
          duration: 2000
        });
      }
    });
  },

  // 清除管理者设置
  clearManager() {
    wx.showModal({
      title: '确认清除',
      content: '确定要清除管理者设置吗？',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('managerOpenId');
          wx.removeStorageSync('userOpenId');
          
          // 清除globalData
          const app = getApp();
          if (app && app.globalData) {
            app.globalData.managerOpenId = '';
          }
          
          this.setData({
            managerOpenId: '',
            isManager: false
          });
          wx.showToast({
            title: '已清除',
            icon: 'success'
          });
        }
      }
    });
  },

  // 查看订单管理
  viewOrders() {
    wx.navigateTo({
      url: '/pages/managerOrders/managerOrders'
    });
  }
});

