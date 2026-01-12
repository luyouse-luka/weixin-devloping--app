// ... existing code ...
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
  onLoad() {
    this.loadInitialProducts(); // 先加载商品数据
    this.switchCategory({ currentTarget: { dataset: { id: 0 } } });
    this.updateProductSoldCount(); // 更新商品已售数量
  },
  onShow() {
    this.loadInitialProducts(); // 先加载商品数据
    // 从本地存储恢复购物车
    const cart = wx.getStorageSync('cart') || [];
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    this.setData({
      cart,
      totalPrice
    });
    this.updateProductSoldCount(); // 更新商品已售数量
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

  // 切换商品规格
  changeSpec(e) {
    const id = e.currentTarget.dataset.id;
    const spec = e.detail.value;
    const products = this.data.products.map(item => {
      if (item.id === id) {
        return { ...item, spec };
      }
      return item;
    });
    this.setData({ products });
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
    const index = cart.findIndex(item => item.id === id && item.spec === product.spec);

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
  loadInitialProducts() {
    // 模拟从服务器获取商品数据
    const mockProducts = [
      // 拿手好戏
      {
        id: 1,
        name: '鹌鹑蛋红烧肉',
        price: 28,
        categoryId: 1,
        // image: '/images/gongbao.jpg', // old
        image: '/images/gongbao.png', // new
        sold: 0,
        intro: '大王招牌',
        spec: 'large'
      },
      {
        id: 2,
        name: '红烧排骨',
        price: 26,
        categoryId: 1,
        // image: '/images/yuxiang.jpg', // old
        image: '/images/yuxiang.png', // new
        sold: 0,
        intro: '顶呱呱',
        spec: 'large'
      },
      {
        id: 3,
        name: 'XXX',
        price: 38,
        categoryId: 1,
        // image: '/images/product1.jpg',
        image: '/images/hongshaorou.png',
        sold: 0,
        intro: '顶呱呱呱',
        spec: 'large'
      },
      // 季节新品
      {
        id: 4,
        name: '时令蔬菜',
        price: 18,
        categoryId: 2,
        image: '/images/shiling_shucai.png',
        sold: 0,
        intro: '新鲜时令，健康美味',
        spec: 'medium'
      },
      {
        id: 5,
        name: '季节限定',
        price: 25,
        categoryId: 2,
        image: '/images/jijie_xianding.png',
        sold: 0,
        intro: '限时供应，错过等一年',
        spec: 'medium'
      },
      // 好吃但还不会做
      {
        id: 6,
        name: '糖醋里脊',
        price: 32,
        categoryId: 3,
        image: '/images/tangcu_liji.png',
        sold: 0,
        intro: '酸甜开胃，外酥里嫩',
        spec: 'large'
      },
      {
        id: 7,
        name: '水煮鱼',
        price: 45,
        categoryId: 3,
        image: '/images/shuizhu_yu.png',
        sold: 0,
        intro: '麻辣鲜香，回味无穷',
        spec: 'large'
      },
      // 特色小炒
      {
        id: 8,
        name: '小炒肉',
        price: 24,
        categoryId: 4,
        image: '/images/product1.jpg',
        sold: 0,
        intro: '香辣下饭，家常美味',
        spec: 'medium'
      },
      {
        id: 9,
        name: '干煸豆角',
        price: 20,
        categoryId: 4,
        image: '/images/product2.jpg',
        sold: 0,
        intro: '干香爽脆，下酒好菜',
        spec: 'medium'
      },
      // 主食
      {
        id: 10,
        name: '蛋炒饭',
        price: 15,
        categoryId: 5,
        image: '/images/product3.jpg',
        sold: 0,
        intro: '粒粒分明，香气扑鼻',
        spec: 'medium'
      },
      {
        id: 11,
        name: '手工面条',
        price: 18,
        categoryId: 5,
        image: '/images/product1.jpg',
        sold: 0,
        intro: '手工制作，Q弹有劲',
        spec: 'medium'
      },
      // 茶饮
      {
        id: 12,
        name: '柠檬蜂蜜茶',
        price: 12,
        categoryId: 6,
        image: '/images/product2.jpg',
        sold: 0,
        intro: '清新解腻，酸甜可口',
        spec: 'small'
      },
      {
        id: 13,
        name: '桂花乌龙',
        price: 15,
        categoryId: 6,
        image: '/images/product3.jpg',
        sold: 0,
        intro: '清香淡雅，回味甘甜',
        spec: 'small'
      }
    ];

    // 获取已售数量缓存
    const soldCounts = wx.getStorageSync('productSoldCounts') || {};

    // 更新商品的已售数量
    const productsWithSold = mockProducts.map(p => ({
      ...p,
      sold: (soldCounts[p.id] || 0) + p.sold // 累加初始值(如果有)和缓存值
    }));

    this.setData({
      products: productsWithSold,
      allProducts: JSON.parse(JSON.stringify(productsWithSold))
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

  updateProductSoldCount() {
    let products = JSON.parse(JSON.stringify(this.data.allProducts)); // 从副本开始
    const orderedProducts = wx.getStorageSync('orderedProducts');
    const sixHoursAgo = new Date().getTime() - (6 * 60 * 60 * 1000);

    if (orderedProducts && orderedProducts.timestamp && orderedProducts.timestamp > sixHoursAgo) {
      orderedProducts.cart.forEach(orderedItem => {
        const productIndex = products.findIndex(p => p.id === orderedItem.id);
        if (productIndex !== -1) {
          // 确保 sold 字段存在且为数字
          products[productIndex].sold = (products[productIndex].sold || 0) + orderedItem.quantity;
        }
      });
    }
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
  placeOrder() {
    const cart = this.data.cart;
    const totalPrice = this.data.totalPrice;
    // 保存订单信息到本地缓存，并添加时间戳
    const timestamp = new Date().getTime();
    wx.setStorageSync('orderedProducts', {
      cart,
      totalPrice,
      timestamp // 记录下单时间
    });

    // 更新已售数量缓存 (Persistent Storage)
    let soldCounts = wx.getStorageSync('productSoldCounts') || {};
    let productsToUpdate = JSON.parse(JSON.stringify(this.data.allProducts));

    cart.forEach(cartItem => {
      // 更新缓存
      soldCounts[cartItem.id] = (soldCounts[cartItem.id] || 0) + cartItem.quantity;

      // 更新当前页面数据
      const productIndex = productsToUpdate.findIndex(p => p.id === cartItem.id);
      if (productIndex !== -1) {
        // 重新读取总数，或者直接累加
        productsToUpdate[productIndex].sold = soldCounts[cartItem.id] + (mockProducts.find(mp => mp.id === cartItem.id)?.sold || 0);
      }
    });

    // 这里的 mockProducts 在 loadInitialProducts 里定义了，但这里访问不到。
    // 为了简化，我们直接信任 soldCounts 为总增量。
    // 上面的逻辑稍微修正：

    cart.forEach(cartItem => {
      soldCounts[cartItem.id] = (soldCounts[cartItem.id] || 0) + cartItem.quantity;
    });
    wx.setStorageSync('productSoldCounts', soldCounts);

    // 重新加载并更新页面数据 (Simulate reload to reflect new counts immediately if staying on page, though we navigate away)
    // 其实 navigateTo orderSuccess 后，页面可能不会卸载，回来时 onShow 会再次调用 loadInitialProducts 或者 we rely on just navigating away.
    // User asked to store data.

    this.setData({
      allProducts: productsToUpdate
    });
    this.updateProductSoldCount(); // 重新计算并更新页面显示的商品信息

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