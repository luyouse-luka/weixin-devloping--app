// pages/chooseChef/chooseChef.js
Page({
  data: {
    cart: [],
    totalPrice: 0,
    chefs: [
      {
        id: 1,
        name: '张师傅',
        avatar: '/images/product1.jpg', // 使用现有图片作为头像，实际应使用厨子头像
        description: '擅长川菜，20年烹饪经验，拿手菜：宫保鸡丁、鱼香肉丝',
        specialties: ['川菜', '热菜'],
        rating: 4.9,
        ordersCount: 128
      },
      {
        id: 2,
        name: '李师傅',
        avatar: '/images/product2.jpg',
        description: '擅长凉菜，15年烹饪经验，拿手菜：凉拌黄瓜、凉拌海带丝',
        specialties: ['凉菜', '小菜'],
        rating: 4.8,
        ordersCount: 95
      },
      {
        id: 3,
        name: '王师傅',
        avatar: '/images/product3.jpg',
        description: '擅长汤品，18年烹饪经验，拿手菜：西红柿鸡蛋汤、冬瓜排骨汤',
        specialties: ['汤品', '炖菜'],
        rating: 4.9,
        ordersCount: 112
      },
      {
        id: 4,
        name: '赵师傅',
        avatar: '/images/gongbao.jpg',
        description: '全能型厨师，25年烹饪经验，精通各类菜品',
        specialties: ['全能', '热菜', '凉菜', '汤品'],
        rating: 5.0,
        ordersCount: 256
      }
    ],
    selectedChefId: null,
    selectedChef: null
  },

  onLoad(options) {
    // 接收订单信息
    const cart = JSON.parse(decodeURIComponent(options.cart || '[]'));
    const totalPrice = parseFloat(options.totalPrice || 0);
    this.setData({
      cart,
      totalPrice
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

