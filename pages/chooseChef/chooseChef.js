// pages/chooseChef/chooseChef.js
Page({
  data: {
    cart: [],
    totalPrice: 0,
    chefs: [
      {
        id: 1,
        name: '大锤',
        id: 1,
        name: '大锤',
        avatar: '/images/大锤.png', // Reference image inside images
        description: '顶呱呱',
        specialties: ['全能'],
        rating: 4.9,
        ordersCount: 128
      },
      {
        id: 2,
        name: '宇哥',
        id: 2,
        name: '宇哥',
        avatar: '/images/宇哥.png',
        description: '顶呱呱',
        specialties: ['水平一般'],
        rating: 4.8,
        ordersCount: 95
      },
      {
        id: 3,
        name: '我爷',
        avatar: '/images/hongshaorou.png', // Placeholder until generation is possible
        description: '年轻的时候全能，现在老了全是黑暗料理，谁吃谁不啧声',
        specialties: [''],
        rating: 4.9,
        ordersCount: 112
      },

    ],
    selectedChefId: null,
    selectedChef: null
  },

  onLoad(options) {
    // 接收订单信息
    const cart = JSON.parse(decodeURIComponent(options.cart || '[]'));
    const totalPrice = parseFloat(options.totalPrice || 0);

    // 加载厨师订单数据
    const chefOrderCounts = wx.getStorageSync('chefOrderCounts') || {};
    const chefsWithCounts = this.data.chefs.map(chef => ({
      ...chef,
      ordersCount: (chefOrderCounts[chef.id] || 0) + chef.ordersCount // 累加初始值
    }));

    this.setData({
      cart,
      totalPrice,
      chefs: chefsWithCounts
    });
  },

  // 选择厨子
  selectChef(e) {
    const chefId = e.currentTarget.dataset.id;
    const chef = this.data.chefs.find(c => c.id === chefId);

    this.setData({
      selectedChefId: chefId,
      selectedChef: chef
    });

    // 显示选择提示
    wx.showToast({
      title: `已选择${chef.name}`,
      icon: 'success',
      duration: 1500
    });
  },

  // 确认选择并提交订单
  confirmAndSubmit() {
    if (!this.data.selectedChefId) {
      wx.showToast({
        title: '请先选择厨子',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    const { cart, totalPrice, selectedChef } = this.data;

    // 保存订单信息到本地缓存，并添加时间戳和厨子信息
    const timestamp = new Date().getTime();
    const orderData = {
      cart,
      totalPrice,
      timestamp,
      orderId: 'ORD' + timestamp,
      orderTime: this.formatTime(timestamp),
      chef: {
        id: selectedChef.id,
        name: selectedChef.name,
        avatar: selectedChef.avatar
      }
    };
    wx.setStorageSync('orderedProducts', orderData);

    // 更新厨师接单数量 (Persistent Storage)
    let chefOrderCounts = wx.getStorageSync('chefOrderCounts') || {};
    chefOrderCounts[selectedChef.id] = (chefOrderCounts[selectedChef.id] || 0) + 1;
    wx.setStorageSync('chefOrderCounts', chefOrderCounts);

    // 更新页面展示 (Optional, though we redirect away anyway)
    const updatedChefs = this.data.chefs.map(c => {
      if (c.id === selectedChef.id) {
        return { ...c, ordersCount: c.ordersCount + 1 };
      }
      return c;
    });
    this.setData({ chefs: updatedChefs });

    // 发送订单通知给管理者
    this.sendOrderNotification(orderData);

    // 获取当前页面栈
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2];
    if (prevPage && typeof prevPage.clearCart === 'function') {
      prevPage.clearCart();
    }

    // 显示成功提示
    wx.showToast({
      title: '下单成功',
      icon: 'success',
      duration: 2000
    });

    // 跳转到成功页面
    setTimeout(() => {
      wx.redirectTo({
        url: `/pages/orderSuccess/orderSuccess?cart=${encodeURIComponent(JSON.stringify(cart))}&totalPrice=${totalPrice}&isFromProductList=false&chefName=${encodeURIComponent(selectedChef.name)}`
      });
    }, 500);
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
    this.requestSubscribeMessage(orderData);
  },

  // 请求订阅消息权限并发送
  requestSubscribeMessage(orderData) {
    const app = getApp();
    const templateId = app.globalData.subscribeMessageTemplateId || '';

    // 如果没有配置模板ID，直接使用备用方式
    if (!templateId) {
      console.log('订阅消息模板ID未配置，使用备用通知方式');
      this.saveOrderForManager(orderData);
      return;
    }

    // 获取管理者openid
    const managerOpenId = wx.getStorageSync('managerOpenId') || app.globalData.managerOpenId || '';

    if (!managerOpenId) {
      console.warn('管理者openid未配置，无法发送订阅消息');
      this.saveOrderForManager(orderData);
      return;
    }

    // 注意：订阅消息需要用户（管理者）在小程序中授权
    // 这里先保存订单，然后尝试发送订阅消息
    this.saveOrderForManager(orderData);

    // 如果有云开发，直接发送订阅消息
    if (typeof wx.cloud !== 'undefined') {
      this.sendSubscribeMessage(templateId, orderData, managerOpenId);
    } else {
      console.log('未开通云开发，无法发送订阅消息，订单已保存到本地');
    }
  },

  // 发送订阅消息
  sendSubscribeMessage(templateId, orderData, managerOpenId) {
    if (typeof wx.cloud !== 'undefined') {
      wx.cloud.callFunction({
        name: 'sendOrderNotification',
        data: {
          templateId: templateId,
          orderData: orderData,
          managerOpenId: managerOpenId
        },
        success: (res) => {
          console.log('订阅消息发送成功', res);
          if (res.result && res.result.success) {
            wx.showToast({
              title: '通知已发送',
              icon: 'success',
              duration: 2000
            });
          } else {
            console.warn('订阅消息发送失败:', res.result);
          }
        },
        fail: (err) => {
          console.error('订阅消息发送失败', err);
          // 即使发送失败，订单也已经保存，不影响功能
        }
      });
    } else {
      console.log('未开通云开发，无法发送订阅消息');
    }
  },

  // 保存订单供管理者查看
  saveOrderForManager(orderData) {
    let allOrders = wx.getStorageSync('allOrders') || [];

    allOrders.unshift({
      ...orderData,
      status: 'pending',
      read: false
    });

    if (allOrders.length > 100) {
      allOrders = allOrders.slice(0, 100);
    }

    wx.setStorageSync('allOrders', allOrders);

    const unreadCount = allOrders.filter(order => !order.read).length;
    wx.setStorageSync('unreadOrderCount', unreadCount);

    console.log('订单已保存，等待管理者查看。未读订单数:', unreadCount);
  },

  // 返回上一页
  goBack() {
    wx.navigateBack({
      delta: 1
    });
  }
});

