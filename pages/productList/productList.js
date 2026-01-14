// ... existing code ...
const serverApi = require('../../utils/serverApi');

Page({
  data: {
    categories: [
      { id: 0, name: '厨神的菜单' },
      { id: 1, name: '拿手好戏' },
      { id: 2, name: '季节新品' },
      { id: 3, name: '必吃榜' },
      { id: 4, name: '第九大菜系' },
      { id: 5, name: '主食' },
      { id: 6, name: '国窖' }
    ],
    activeCategoryId: 0,
    products: [], // 初始化为空数组
    filteredProducts: [],
    cart: [],
    totalPrice: 0,
    showCartModal: false,
    categorizedProducts: {},
    allProducts: [] // 用于存储所有产品信息，方便更新已售数量
  },
  async onLoad() {
    await this.loadInitialProducts(); // 先加载商品数据
    this.switchCategory({ currentTarget: { dataset: { id: 0 } } });
    await this.updateProductSoldCount(); // 更新商品已售数量
  },
  
  // 格式化订单次数显示（最大999+）
  formatOrderCount(count) {
    if (count >= 999) {
      return '999+';
    }
    return count.toString();
  },
  async onShow() {
    await this.loadInitialProducts(); // 先加载商品数据
    // 从本地存储恢复购物车
    const cart = wx.getStorageSync('cart') || [];
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    this.setData({
      cart,
      totalPrice
    });
    await this.updateProductSoldCount(); // 更新商品已售数量
  },
  // 切换商品分类
  switchCategory(e) {
    const id = e.currentTarget.dataset.id;
    let filteredProducts = [];
    let categorizedProducts = {};

    if (id === 0) {
      this.data.categories.slice(1).forEach(category => {
        const categoryId = category.id;
        categorizedProducts[categoryId] = this.data.products.filter(
          product => product.categoryId === categoryId
        );
      });
      console.log('categorizedProducts 数据结构:', JSON.stringify(categorizedProducts));
    } else {
      filteredProducts = this.data.products.filter(item => item.categoryId === id);
    }

    this.setData({
      activeCategoryId: id,
      filteredProducts,
      categorizedProducts
    });
  },


  // 加入购物车
  addToCart(e) {
    const id = e.currentTarget.dataset.id;
    const product = this.data.products.find(item => item.id === id);

    if (!product) {
      wx.showToast({
        title: '🫠',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    const cart = [...this.data.cart];
    const index = cart.findIndex(item => item.id === id);

    if (index === -1) {
      cart.push({ ...product, quantity: 1 });
    } else {
      cart[index].quantity += 1;
    }

    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    this.setData({
      cart,
      totalPrice
    });

    // 同步到本地存储
    wx.setStorageSync('cart', cart);

    // 显示添加成功提示
    wx.showToast({
      title: '已添加到购物车',
      icon: 'success',
      duration: 1500
    });
  },

  // 跳转到下单页面
  goToOrder() {
    const cart = this.data.cart;
    if (cart.length === 0) {
      wx.showToast({
        title: '购物车为空，请先添加商品',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    const totalPrice = this.data.totalPrice;
    wx.navigateTo({
      url: `/pages/orders/orders?cart=${encodeURIComponent(JSON.stringify(cart))}&totalPrice=${totalPrice}`
    });
  },
  showCartInfo() {
    this.setData({
      showCartModal: true
    });
  },
  stopPropagation() {
    return;
  },

  // 隐藏购物车信息
  hideCartInfo() {
    this.setData({
      showCartModal: false
    });
  },
  // 加载初始商品数据，并保存到 allProducts，方便后续更新
  async loadInitialProducts() {
    // 模拟从服务器获取商品数据
    const mockProducts = [
      // 拿手好戏
      {
        id: 1,
        name: '红烧肉',
        price: 28,
        categoryId: 1,
        // image: '/images/gongbao.jpg', // old
        image: '/images/hongshaorou.jpg', // new
        orderCount: 0,
        sold: 0,
        intro: '大王招牌'
      },
      {
        id: 2,
        name: '红烧排骨',
        price: 26,
        categoryId: 1,
        // image: '/images/yuxiang.jpg', // old
        image: '/images/paigu.jpg', // new
        orderCount: 0,
        sold: 0,
        intro: '顶呱呱'
      },
      {
        id: 3,
        name: '土豆炖牛腩',
        price: 38,
        categoryId: 1,
        image: '/images/tudou_dun_niunan.jpg',
        orderCount: 0,
        sold: 0,
        intro: '软糯鲜香，营养丰富'
      },
      {
        id: 14,
        name: '红烧大虾',
        price: 45,
        categoryId: 1,
        image: '/images/hongshao_daxia.jpg',
        orderCount: 0,
        sold: 0,
        intro: '鲜香Q弹，色香味俱全'
      },
      {
        id: 15,
        name: '五花肉烧鹌鹑蛋',
        price: 32,
        categoryId: 1,
        image: '/images/wuhuarou_anchundan.jpg',
        orderCount: 0,
        sold: 0,
        intro: '肥而不腻，入口即化'
      },
         {
        id: 25,
        name: '清蒸大闸蟹',
        price: 128,
        categoryId: 1,
        image: '/images/dazhaxie.jpg',
        orderCount: 0,
        sold: 0,
        intro: '就是有钳'
      },
      // 季节新品
      {
        id: 4,
        name: '时令蔬菜',
        price: 18,
        categoryId: 2,
        image: '/images/shiling_shucai.jpg',
        orderCount: 0,
        sold: 0,
        intro: '新鲜时令，健康美味'
      },
      {
        id: 5,
        name: '季节限定',
        price: 25,
        categoryId: 2,
        image: '/images/dazhaxie.jpg',
        orderCount: 0,
        sold: 0,
        intro: '限时供应，错过等一年'
      },
      // 好吃但还不会做
      {
        id: 6,
        name: '糖醋里脊',
        price: 32,
        categoryId: 3,
        image: '/images/tangcu_liji.jpg',
        orderCount: 0,
        sold: 0,
        intro: '酸甜开胃，外酥里嫩'
      },
      {
        id: 7,
        name: '水煮鱼',
        price: 45,
        categoryId: 3,
        image: '/images/shuizhu_yu.jpg',
        orderCount: 0,
        sold: 0,
        intro: '麻辣鲜香，回味无穷'
      },
      // 特色小炒
      {
        id: 8,
        name: '小炒肉',
        price: 24,
        categoryId: 4,
        image: '/images/xiaochaorou.jpg',
        orderCount: 0,
        sold: 0,
        intro: '香辣下饭，家常美味'
      },
      {
        id: 9,
        name: '干锅花菜',
        price: 20,
        categoryId: 4,
        image: '/images/ganguohuacai.jpg',
        orderCount: 0,
        sold: 0,
        intro: '干香爽脆'
      },
      {
        id: 16,
        name: '海带烧肉',
        price: 28,
        categoryId: 4,
        image: '/images/haidaishaorou.jpg',
        orderCount: 0,
        sold: 0,
        intro: '鲜香软糯，营养丰富'
      },
      {
        id: 17,
        name: '萝卜烧肉',
        price: 26,
        categoryId: 4,
        image: '/images/luobo_shaorou.jpg',
        orderCount: 0,
        sold: 0,
        intro: '清甜爽口，解腻下饭'
      },
      {
        id: 18,
        name: '西红柿炒鸡蛋',
        price: 18,
        categoryId: 4,
        image: '/images/xihongshichaojidan.jpg',
        orderCount: 0,
        sold: 0,
        intro: '经典家常，酸甜开胃'
      },
      {
        id: 19,
        name: '土豆丝',
        price: 15,
        categoryId: 4,
        image: '/images/tudousi.jpg',
        orderCount: 0,
        sold: 0,
        intro: '爽脆可口，下饭神器'
      },
      {
        id: 20,
        name: '芹菜香干',
        price: 16,
        categoryId: 4,
        image: '/images/qincai_xianggan.jpg',
        orderCount: 0,
        sold: 0,
        intro: '清香爽脆，健康美味'
      },
      // 主食
      {
        id: 10,
        name: '蛋炒饭',
        price: 15,
        categoryId: 5,
        image: '/images/danchaofan.jpg',
        orderCount: 0,
        sold: 0,
        intro: '粒粒分明，香气扑鼻'
      },
      {
        id: 11,
        name: '手工面条',
        price: 18,
        categoryId: 5,
        image: '/images/miantiao.jpg',
        orderCount: 0,
        sold: 0,
        intro: '手工制作，Q弹有劲'
      },
      {
        id: 21,
        name: '世界第一的泡面',
        price: 12,
        categoryId: 5,
        image: '/images/paomian.jpg',
        orderCount: 0,
        sold: 0,
        intro: '没人比我更懂泡面'
      },
      {
        id: 22,
        name: '紫菜鸡蛋汤',
        price: 10,
        categoryId: 5,
        image: '/images/zicai_jidan_tang.jpg',
        orderCount: 0,
        sold: 0,
        intro: '品鉴上百家不如自己烧的好喝'
      },
      // 茶饮
      {
        id: 12,
        name: '柠檬蜂蜜茶',
        price: 12,
        categoryId: 6,
        image: '/images/ningmeng_fengmi_cha.jpg',
        orderCount: 0,
        sold: 0,
        intro: '清新解腻，酸甜可口'
      },
      {
        id: 13,
        name: '桂花乌龙',
        price: 15,
        categoryId: 6,
        image: '/images/guihuawulong.jpg',
        orderCount: 0,
        sold: 0,
        intro: '清香淡雅，回味甘甜'
      },
         {
        id: 23,
        name: '勇闯天涯',
        price: 6,
        categoryId: 6,
        image: '/images/pijiu.jpg',
        orderCount: 0,
        sold: 0,
        intro: '冰镇国窖'
      },   
      {
        id: 24,
        name: '罗曼尼康帝',
        price: 999,
        categoryId: 6,
        image: '/images/lafei.jpg',
        orderCount: 0,
        sold: 0,
        intro: '82年的罗曼尼康帝，无敌是多~多么寂寞~'
      },   {
        id: 25,
        name: '鸡尾酒',
        price: 25,
        categoryId: 6,
        image: '/images/jiweijiu.jpg',
        orderCount: 0,
        sold: 0,
        intro: '皇家一级调酒师，精心调制'
      },   {
        id: 26,
        name: '阿萨姆巧克力奶茶',
        price: 6,
        categoryId: 6,
        image: '/images/asamu.jpg',
        orderCount: 0,
        sold: 0,
        intro: '6块'
      },
    ];

    // 从服务器获取订单次数
    const orderCounts = await serverApi.getAllProductOrderCounts();

    // 更新商品的订单次数
    const productsWithOrderCount = mockProducts.map(p => ({
      ...p,
      orderCount: orderCounts[p.id] || 0, // 从服务器读取，默认为0
      sold: p.sold || 0 // 保留sold字段用于兼容
    }));

    this.setData({
      products: productsWithOrderCount,
      allProducts: JSON.parse(JSON.stringify(productsWithOrderCount))
    });
  },

  // 图片加载错误处理
  onImageError(e) {
    const id = e.currentTarget.dataset.id;
    const products = this.data.products.map(item => {
      if (item.id === id) {
        return { ...item, image: '/images/product1.jpg' }; // 使用默认图片
      }
      return item;
    });
    this.setData({ products });
  },

  async updateProductSoldCount() {
    // 从服务器获取订单次数
    const orderCounts = await serverApi.getAllProductOrderCounts();
    let products = JSON.parse(JSON.stringify(this.data.allProducts)); // 从副本开始
    
    // 更新商品的订单次数
    products.forEach(product => {
      product.orderCount = orderCounts[product.id] || 0;
    });
    // 更新页面上的商品列表，包括 filteredProducts 和 categorizedProducts
    const activeId = this.data.activeCategoryId;
    let currentFilteredProducts = [];
    let currentCategorizedProducts = {};

    if (activeId === 0) {
      this.data.categories.slice(1).forEach(category => {
        const categoryId = category.id;
        currentCategorizedProducts[categoryId] = products.filter(
          product => product.categoryId === categoryId
        );
      });
    } else {
      currentFilteredProducts = products.filter(item => item.categoryId === activeId);
    }

    this.setData({
      products: products, // 更新基础商品数据
      filteredProducts: currentFilteredProducts,
      categorizedProducts: currentCategorizedProducts
    });
  },

  clearCart() {
    this.setData({
      cart: [],
      totalPrice: 0
    });
    // 同步到本地存储
    wx.setStorageSync('cart', []);
    // 隐藏购物车模态框
    this.setData({
      showCartModal: false
    });
    wx.showToast({
      title: '购物车已清空',
      icon: 'success',
      duration: 1500
    });
  },
  async placeOrder() {
    const cart = this.data.cart;
    const totalPrice = this.data.totalPrice;
    // 保存订单信息到本地缓存，并添加时间戳
    const timestamp = new Date().getTime();
    wx.setStorageSync('orderedProducts', {
      cart,
      totalPrice,
      timestamp // 记录下单时间
    });

    // 更新服务器订单次数
    for (const cartItem of cart) {
      await serverApi.incrementProductOrderCount(cartItem.id);
    }
    
    // 更新当前页面数据
    let productsToUpdate = JSON.parse(JSON.stringify(this.data.allProducts));
    const orderCounts = await serverApi.getAllProductOrderCounts();
    productsToUpdate.forEach(product => {
      product.orderCount = orderCounts[product.id] || 0;
    });

    // 重新加载并更新页面数据 (Simulate reload to reflect new counts immediately if staying on page, though we navigate away)
    // 其实 navigateTo orderSuccess 后，页面可能不会卸载，回来时 onShow 会再次调用 loadInitialProducts 或者 we rely on just navigating away.
    // User asked to store data.

    this.setData({
      allProducts: productsToUpdate
    });
    await this.updateProductSoldCount(); // 重新计算并更新页面显示的商品信息

    // 清空当前购物车
    this.setData({
      cart: [],
      totalPrice: 0
    });

    wx.navigateTo({
      url: `/pages/orderSuccess/orderSuccess?cart=${encodeURIComponent(JSON.stringify(cart))}&totalPrice=${totalPrice}`
    });
  },
});
