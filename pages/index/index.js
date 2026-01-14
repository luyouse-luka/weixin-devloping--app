// ... existing code ...
Page({
  data: {
    productList: [
      { id: 1, image: 'https://family-app-images.oss-cn-shanghai.aliyuncs.com/gongbao.jpg' },
      { id: 2, image: 'https://family-app-images.oss-cn-shanghai.aliyuncs.com/yuxiang.jpg' },
      { id: 3, image: 'https://family-app-images.oss-cn-shanghai.aliyuncs.com/hongshaorou.jpg' },
      { id: 4, image: 'https://family-app-images.oss-cn-shanghai.aliyuncs.com/shuizhu_yu.jpg' }
    ]
  },

  goToProductList() {
    wx.navigateTo({
      url: '/pages/productList/productList'
    });
  }
});
// ... existing code ...