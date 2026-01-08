// ... existing code ...
Page({
    data: {
        productList: [
          { id: 1, image: '/images/product1.jpg' },
          { id: 2, image: '/images/product2.jpg' },
          { id: 3, image: '/images/product3.jpg' }
        ]
      },
  
    goToProductList() {
      wx.navigateTo({
        url: '/pages/productList/productList'
      });
    }
  });
  // ... existing code ...