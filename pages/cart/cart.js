Page({
  data: {
    cart: [],
    orderedProducts: []
  },

  onShow() {
    this.loadCartData();
  },

  onLoad() {
    this.loadCartData();
  },

  // 加载购物车数据
  loadCartData() {
    const cart = wx.getStorageSync('cart') || [];
    const orderedProducts = wx.getStorageSync('orderedProducts')?.cart || [];
    this.setData({
      cart,
      orderedProducts
    });
  },

  // 跳转到商品列表
  goToProductList() {
    wx.switchTab({
      url: '/pages/productList/productList'
    });
  },

  // 跳转到订单页面
  goToOrder() {
    if (this.data.cart.length === 0) {
      wx.showToast({
        title: '购物车为空',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    const totalPrice = this.data.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    wx.navigateTo({
      url: `/pages/orders/orders?cart=${encodeURIComponent(JSON.stringify(this.data.cart))}&totalPrice=${totalPrice}`
    });
  }
});