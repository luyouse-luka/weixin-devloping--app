/**
 * 订单通知工具类
 * 用于处理订单通知相关功能
 */

/**
 * 发送订单通知给管理者
 * @param {Object} orderData 订单数据
 */
function sendOrderNotification(orderData) {
  // 方法1: 使用订阅消息
  requestSubscribeMessage(orderData);

  // 方法2: 保存订单到本地/服务器供管理者查看
  saveOrderForManager(orderData);
}

/**
 * 请求订阅消息权限
 * @param {Object} orderData 订单数据
 */
function requestSubscribeMessage(orderData) {
  // 从配置中获取模板ID（需要在app.js或配置文件中设置）
  const app = getApp();
  const templateId = app.globalData.subscribeMessageTemplateId || '';

  if (!templateId) {
    console.log('订阅消息模板ID未配置');
    return;
  }

  wx.requestSubscribeMessage({
    tmplIds: [templateId],
    success: (res) => {
      if (res[templateId] === 'accept') {
        sendSubscribeMessage(templateId, orderData);
      }
    },
    fail: (err) => {
      console.error('请求订阅消息权限失败:', err);
    }
  });
}

/**
 * 发送订阅消息
 * @param {String} templateId 模板ID
 * @param {Object} orderData 订单数据
 */
function sendSubscribeMessage(templateId, orderData) {
  // 如果有云开发
  if (typeof wx.cloud !== 'undefined') {
    wx.cloud.callFunction({
      name: 'sendOrderNotification',
      data: {
        templateId: templateId,
        orderData: orderData
      },
      success: (res) => {
        console.log('订阅消息发送成功', res);
      },
      fail: (err) => {
        console.error('订阅消息发送失败', err);
      }
    });
  }
}

/**
 * 保存订单供管理者查看
 * @param {Object} orderData 订单数据
 */
function saveOrderForManager(orderData) {
  let allOrders = wx.getStorageSync('allOrders') || [];
  
  allOrders.unshift({
    ...orderData,
    status: 'pending',
    read: false
  });

  // 只保留最近100条
  if (allOrders.length > 100) {
    allOrders = allOrders.slice(0, 100);
  }

  wx.setStorageSync('allOrders', allOrders);

  // 更新未读数量
  const unreadCount = allOrders.filter(order => !order.read).length;
  wx.setStorageSync('unreadOrderCount', unreadCount);
}

/**
 * 获取未读订单数量
 * @returns {Number} 未读订单数量
 */
function getUnreadOrderCount() {
  const allOrders = wx.getStorageSync('allOrders') || [];
  return allOrders.filter(order => !order.read).length;
}

/**
 * 标记订单为已读
 * @param {String} orderId 订单ID
 */
function markOrderAsRead(orderId) {
  let allOrders = wx.getStorageSync('allOrders') || [];
  allOrders = allOrders.map(order => {
    if (order.orderId === orderId) {
      return { ...order, read: true };
    }
    return order;
  });
  wx.setStorageSync('allOrders', allOrders);
}

module.exports = {
  sendOrderNotification,
  requestSubscribeMessage,
  sendSubscribeMessage,
  saveOrderForManager,
  getUnreadOrderCount,
  markOrderAsRead
};





