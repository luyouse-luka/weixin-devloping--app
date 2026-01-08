// pages/managerOrders/managerOrders.js
Page({
  data: {
    orders: [],
    unreadCount: 0,
    filterStatus: 'all' // all, pending, processed
  },

  onLoad() {
    this.loadOrders();
  },

  onShow() {
    this.loadOrders();
  },

  // 加载订单列表
  loadOrders() {
    const allOrders = wx.getStorageSync('allOrders') || [];
    const unreadCount = allOrders.filter(order => !order.read).length;
    
    // 根据筛选状态过滤订单
    let filteredOrders = allOrders;
    if (this.data.filterStatus === 'pending') {
      filteredOrders = allOrders.filter(order => order.status === 'pending');
    } else if (this.data.filterStatus === 'processed') {
      filteredOrders = allOrders.filter(order => order.status === 'processed');
    }

    this.setData({
      orders: filteredOrders,
      unreadCount: unreadCount
    });
  },

  // 切换筛选状态
  switchFilter(e) {
    const status = e.currentTarget.dataset.status;
    this.setData({
      filterStatus: status
    });
    this.loadOrders();
  },

  // 标记订单为已读
  markAsRead(e) {
    const orderId = e.currentTarget.dataset.orderid;
    let allOrders = wx.getStorageSync('allOrders') || [];
    
    allOrders = allOrders.map(order => {
      if (order.orderId === orderId) {
        return { ...order, read: true };
      }
      return order;
    });
    
    wx.setStorageSync('allOrders', allOrders);
    this.loadOrders();
    
    wx.showToast({
      title: '已标记为已读',
      icon: 'success',
      duration: 1500
    });
  },

  // 标记订单为已处理
  markAsProcessed(e) {
    const orderId = e.currentTarget.dataset.orderid;
    let allOrders = wx.getStorageSync('allOrders') || [];
    
    allOrders = allOrders.map(order => {
      if (order.orderId === orderId) {
        return { ...order, status: 'processed', read: true };
      }
      return order;
    });
    
    wx.setStorageSync('allOrders', allOrders);
    this.loadOrders();
    
    wx.showToast({
      title: '已标记为已处理',
      icon: 'success',
      duration: 1500
    });
  },

  // 查看订单详情
  viewOrderDetail(e) {
    const orderId = e.currentTarget.dataset.orderid;
    const order = this.data.orders.find(o => o.orderId === orderId);
    
    if (order) {
      wx.navigateTo({
        url: `/pages/orderedProductsPage/orderedProductsPage?orders=${encodeURIComponent(JSON.stringify(order))}`
      });
    }
  },

  // 清空所有订单
  clearAllOrders() {
    wx.showModal({
      title: '确认清空',
      content: '确定要清空所有订单记录吗？',
      success: (res) => {
        if (res.confirm) {
          wx.setStorageSync('allOrders', []);
          wx.setStorageSync('unreadOrderCount', 0);
          this.loadOrders();
          wx.showToast({
            title: '已清空',
            icon: 'success'
          });
        }
      }
    });
  }
});





