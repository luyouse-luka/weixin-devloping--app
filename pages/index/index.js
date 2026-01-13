// ... existing code ...
Page({
  data: {
    productList: [
      { id: 1, image: '/images/gongbao.jpg' },
      { id: 2, image: '/images/yuxiang.jpg' },
      { id: 3, image: '/images/hongshaorou.jpg' },
      { id: 4, image: '/images/shuizhu_yu.jpg' }
    ]
  },

  goToProductList() {
    wx.navigateTo({
      url: '/pages/productList/productList'
    });
  }
});
// ... existing code ...