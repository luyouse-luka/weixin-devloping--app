// ... existing code ...
Page({
  data: {
    productList: [
      { id: 1, image: '/images/gongbao.png' },
      { id: 2, image: '/images/yuxiang.png' },
      { id: 3, image: '/images/hongshaorou.png' },
      { id: 4, image: '/images/shuizhu_yu.png' }
    ]
  },

  goToProductList() {
    wx.navigateTo({
      url: '/pages/productList/productList'
    });
  }
});
// ... existing code ...