# 云数据库配置指南

## 📋 概述

当前实现使用的是**本地存储**，每个用户只能看到自己的下单次数。

如果需要**所有用户共享数据**（看到相同的下单次数），需要使用**云数据库**。

## 🔄 两种方案对比

### 方案一：本地存储（当前实现）
- ✅ 实现简单，无需服务器
- ❌ 每个用户只能看到自己的数据
- ❌ 数据只存在用户手机上，卸载小程序会丢失

### 方案二：云数据库（推荐用于共享数据）
- ✅ 所有用户看到相同的数据
- ✅ 数据存储在云端，不会丢失
- ✅ 可以跨设备同步
- ❌ 需要配置云开发环境

## 🚀 使用云数据库的步骤

### 1. 初始化云开发

在 `app.js` 的 `onLaunch` 中添加：

```javascript
onLaunch() {
  // 初始化云开发
  if (typeof wx.cloud !== 'undefined') {
    wx.cloud.init({
      env: 'your-env-id', // 替换为你的云开发环境ID
      traceUser: true
    });
  }
  
  // ... 其他代码
}
```

### 2. 创建云数据库集合

在微信开发者工具的云开发控制台中创建两个集合：

1. **productStats** - 商品统计数据
   - `productId` (Number) - 商品ID
   - `orderCount` (Number) - 订单次数
   - `createTime` (Date) - 创建时间
   - `updateTime` (Date) - 更新时间

2. **chefStats** - 厨师统计数据
   - `chefId` (Number) - 厨师ID
   - `ordersCount` (Number) - 完成单数
   - `createTime` (Date) - 创建时间
   - `updateTime` (Date) - 更新时间

### 3. 设置数据库权限

在云开发控制台的"数据库" -> "权限设置"中：

- **productStats**: 设置为"所有用户可读，仅创建者可写"
- **chefStats**: 设置为"所有用户可读，仅创建者可写"

或者使用云函数来更新数据（更安全）。

### 4. 修改代码使用云数据库

在 `pages/productList/productList.js` 中：

```javascript
const cloudDB = require('../../utils/cloudDatabase');

// 加载商品时
async loadInitialProducts() {
  // ... 加载商品数据
  
  // 从云数据库获取订单次数
  const orderCounts = await cloudDB.getAllProductOrderCounts();
  
  const productsWithOrderCount = mockProducts.map(p => ({
    ...p,
    orderCount: orderCounts[p.id] || 0
  }));
  
  this.setData({ products: productsWithOrderCount });
}

// 下单时
async placeOrder() {
  // ... 其他代码
  
  // 更新云数据库
  for (const cartItem of cart) {
    await cloudDB.incrementProductOrderCount(cartItem.id);
  }
}
```

在 `pages/chooseChef/chooseChef.js` 中：

```javascript
const cloudDB = require('../../utils/cloudDatabase');

// 加载厨师时
async onLoad(options) {
  // ... 其他代码
  
  // 从云数据库获取完成单数
  const chefCounts = await cloudDB.getAllChefOrderCounts();
  
  const chefsWithCounts = this.data.chefs.map(chef => ({
    ...chef,
    ordersCount: chefCounts[chef.id] || 0
  }));
  
  this.setData({ chefs: chefsWithCounts });
}

// 下单时
async confirmAndSubmit() {
  // ... 其他代码
  
  // 更新云数据库
  await cloudDB.incrementChefOrderCount(selectedChef.id);
  
  for (const cartItem of cart) {
    await cloudDB.incrementProductOrderCount(cartItem.id);
  }
}
```

## 📝 注意事项

1. **云开发环境ID**: 需要在微信开发者工具中获取
2. **数据库权限**: 确保设置正确的读写权限
3. **降级处理**: 代码中已包含降级逻辑，如果云开发不可用，会自动使用本地存储
4. **性能优化**: 可以考虑使用缓存，减少数据库查询次数

## 🔧 快速切换

如果暂时不想使用云数据库，保持当前实现即可。代码已经包含了降级逻辑，会自动使用本地存储。
