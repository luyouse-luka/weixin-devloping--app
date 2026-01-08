Page({
  data: {
    order: null,
    orderTime: ''
  },
  onLoad(options) {
    if (options.orders) {
      try {
        const order = JSON.parse(decodeURIComponent(options.orders));
        const orderTime = order.timestamp ? this.formatTime(order.timestamp) : '';
        this.setData({
          order,
          orderTime
        });
      } catch (e) {
        console.error('解析订单数据失败:', e);
        wx.showToast({
          title: '订单数据格式错误',
          icon: 'none',
          duration: 2000,
          complete: () => {
            setTimeout(() => { wx.navigateBack(); }, 2000);
          }
        });
      }
    } else {
      // 如果没有传参，从本地存储读取
      const order = wx.getStorageSync('orderedProducts');
      if (order) {
        const orderTime = order.timestamp ? this.formatTime(order.timestamp) : '';
        this.setData({
          order,
          orderTime
        });
      } else {
        wx.showToast({
          title: '暂无订单信息',
          icon: 'none',
          duration: 2000,
          complete: () => {
            setTimeout(() => { wx.navigateBack(); }, 2000);
          }
        });
      }
    }
  },
  // 格式化时间
  formatTime(timestamp) {
    const date = new Date(parseInt(timestamp));
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hour}:${minute}`;
  },
  // 返回方法
  goBack() {
    wx.navigateBack({
      delta: 1
    });
  }
});