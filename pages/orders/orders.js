// ... existing code ...
Page({
  data: {
    cart: [],
    totalPrice: 0,
    totalQuantity: 0
  },
  onLoad(options) {
    const cart = JSON.parse(decodeURIComponent(options.cart));
    const totalPrice = parseFloat(options.totalPrice);
    // 计算商品总数量
    const totalQuantity = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
    this.setData({
      cart,
      totalPrice,
      totalQuantity
    });
  },
  // 添加返回方法
  goBack() {
    wx.navigateBack({
      delta: 1
    });
  },
  // 添加下单方法
  placeOrder() {
    const cart = this.data.cart;
    const totalPrice = this.data.totalPrice;

    if (!cart || cart.length === 0) {
      wx.showToast({
        title: '购物车为空',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    // 保存订单信息到本地缓存，并添加时间戳
    const timestamp = new Date().getTime();
    const orderData = {
      cart,
      totalPrice,
      timestamp,
      orderId: 'ORD' + timestamp, // 生成订单ID
      orderTime: this.formatTime(timestamp)
    };
    wx.setStorageSync('orderedProducts', orderData);

    // 发送订单通知给管理者
    this.sendOrderNotification(orderData);

    // 获取当前页面栈
    const pages = getCurrentPages();
    // 假设商品列表页是当前页面的上一个页面
    const prevPage = pages[pages.length - 2];
    if (prevPage && typeof prevPage.clearCart === 'function') {
      // 调用商品列表页的 clearCart 方法清空购物车
      prevPage.clearCart();
    }

    // 跳转到选择厨子页面
    wx.navigateTo({
      url: `/pages/chooseChef/chooseChef?cart=${encodeURIComponent(JSON.stringify(cart))}&totalPrice=${totalPrice}`
    });
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

  // 发送订单通知给管理者
  sendOrderNotification(orderData) {
    // 方法1: 使用订阅消息（需要配置模板ID）
    this.requestSubscribeMessage(orderData);

    // 方法2: 保存到云数据库或服务器（如果有云开发或后端）
    // this.saveOrderToServer(orderData);
  },

  // 请求订阅消息权限并发送
  requestSubscribeMessage(orderData) {
    // 注意：需要在小程序后台配置订阅消息模板，获取模板ID
    // 这里使用占位符，实际使用时需要替换为真实的模板ID
    const templateId = 'YOUR_SUBSCRIBE_MESSAGE_TEMPLATE_ID'; // 替换为实际的模板ID

    // 如果模板ID未配置，跳过订阅消息
    if (templateId === 'YOUR_SUBSCRIBE_MESSAGE_TEMPLATE_ID') {
      console.log('订阅消息模板ID未配置，使用备用通知方式');
      // 使用备用方式：保存订单到本地，管理者可以通过小程序查看
      this.saveOrderForManager(orderData);
      return;
    }

    // 请求订阅消息权限
    wx.requestSubscribeMessage({
      tmplIds: [templateId],
      success: (res) => {
        console.log('订阅消息权限请求结果:', res);
        if (res[templateId] === 'accept') {
          // 用户同意订阅，发送订阅消息
          this.sendSubscribeMessage(templateId, orderData);
        } else {
          // 用户拒绝或未授权，使用备用方式
          this.saveOrderForManager(orderData);
        }
      },
      fail: (err) => {
        console.error('请求订阅消息权限失败:', err);
        // 使用备用方式
        this.saveOrderForManager(orderData);
      }
    });
  },

  // 发送订阅消息（需要云函数支持）
  sendSubscribeMessage(templateId, orderData) {
    // 如果有云开发，可以通过云函数发送
    if (typeof wx.cloud !== 'undefined') {
      wx.cloud.callFunction({
        name: 'sendOrderNotification',
        data: {
          templateId: templateId,
          orderData: orderData,
          // 管理者的openid（需要预先保存）
          managerOpenId: wx.getStorageSync('managerOpenId') || ''
        },
        success: (res) => {
          console.log('订阅消息发送成功', res);
        },
        fail: (err) => {
          console.error('订阅消息发送失败', err);
          // 使用备用方式
          this.saveOrderForManager(orderData);
        }
      });
    } else {
      // 没有云开发，使用备用方式
      this.saveOrderForManager(orderData);
    }
  },

  // 备用方式：保存订单信息供管理者查看
  saveOrderForManager(orderData) {
    // 获取所有订单列表
    let allOrders = wx.getStorageSync('allOrders') || [];

    // 添加新订单
    allOrders.unshift({
      ...orderData,
      status: 'pending', // 待处理
      read: false // 未读
    });

    // 只保留最近100条订单
    if (allOrders.length > 100) {
      allOrders = allOrders.slice(0, 100);
    }

    // 保存到本地存储
    wx.setStorageSync('allOrders', allOrders);

    // 更新未读订单数量
    const unreadCount = allOrders.filter(order => !order.read).length;
    wx.setStorageSync('unreadOrderCount', unreadCount);

    console.log('订单已保存，等待管理者查看。未读订单数:', unreadCount);
  },

  // 图片加载错误处理
  onImageError(e) {
    const index = e.currentTarget.dataset.index;
    const cart = this.data.cart;
    if (cart[index] && !cart[index].image) {
      cart[index].image = '/images/placeholder.webp';
      this.setData({ cart });
    }
  },
});
