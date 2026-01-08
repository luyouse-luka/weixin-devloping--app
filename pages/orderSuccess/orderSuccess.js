Page({
    data: {
        cart: [],
        totalPrice: 0,
        isFromProductList: false,
        chefName: ''
      },
  
      onLoad(options) {
        const cart = JSON.parse(decodeURIComponent(options.cart));
        const totalPrice = parseFloat(options.totalPrice);
        const isFromProductList = options.isFromProductList === 'true';
        const chefName = decodeURIComponent(options.chefName || '');
        this.setData({
          cart,
          totalPrice,
          isFromProductList,
          chefName
        });
      },
    goBackToProductList() {
        wx.navigateTo({
            url: '/pages/productList/productList'
        });
    },
    continueOrdering() {
        wx.navigateTo({
            url: '/pages/productList/productList'
        });
    }
});