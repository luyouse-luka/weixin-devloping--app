/**
 * 云数据库工具 - 用于存储和获取共享的订单统计数据
 * 所有用户可以看到相同的下单次数和厨师完成单数
 */

/**
 * 初始化云开发（如果未初始化）
 */
function initCloud() {
  if (typeof wx.cloud === 'undefined') {
    console.warn('云开发未初始化，将使用本地存储');
    return false;
  }
  
  // 如果已经初始化过，直接返回
  if (wx.cloud.database) {
    return true;
  }
  
  // 初始化云开发（需要在app.js中调用）
  try {
    wx.cloud.init({
      env: 'your-env-id', // 替换为你的云开发环境ID
      traceUser: true
    });
    return true;
  } catch (e) {
    console.error('云开发初始化失败:', e);
    return false;
  }
}

/**
 * 获取商品的订单次数（从云数据库）
 * @param {number} productId 商品ID
 * @returns {Promise<number>} 订单次数
 */
async function getProductOrderCount(productId) {
  if (!initCloud()) {
    // 降级到本地存储
    const orderCounts = wx.getStorageSync('productOrderCounts') || {};
    return orderCounts[productId] || 0;
  }

  try {
    const db = wx.cloud.database();
    const result = await db.collection('productStats')
      .where({ productId: productId })
      .get();
    
    if (result.data.length > 0) {
      return result.data[0].orderCount || 0;
    }
    return 0;
  } catch (e) {
    console.error('获取商品订单次数失败:', e);
    // 降级到本地存储
    const orderCounts = wx.getStorageSync('productOrderCounts') || {};
    return orderCounts[productId] || 0;
  }
}

/**
 * 增加商品的订单次数（云数据库）
 * @param {number} productId 商品ID
 * @returns {Promise<boolean>} 是否成功
 */
async function incrementProductOrderCount(productId) {
  if (!initCloud()) {
    // 降级到本地存储
    let orderCounts = wx.getStorageSync('productOrderCounts') || {};
    orderCounts[productId] = (orderCounts[productId] || 0) + 1;
    wx.setStorageSync('productOrderCounts', orderCounts);
    return true;
  }

  try {
    const db = wx.cloud.database();
    const _ = db.command;
    
    // 尝试更新现有记录
    const updateResult = await db.collection('productStats')
      .where({ productId: productId })
      .update({
        data: {
          orderCount: _.inc(1),
          updateTime: new Date()
        }
      });
    
    // 如果记录不存在，创建新记录
    if (updateResult.stats.updated === 0) {
      await db.collection('productStats').add({
        data: {
          productId: productId,
          orderCount: 1,
          createTime: new Date(),
          updateTime: new Date()
        }
      });
    }
    
    return true;
  } catch (e) {
    console.error('更新商品订单次数失败:', e);
    // 降级到本地存储
    let orderCounts = wx.getStorageSync('productOrderCounts') || {};
    orderCounts[productId] = (orderCounts[productId] || 0) + 1;
    wx.setStorageSync('productOrderCounts', orderCounts);
    return false;
  }
}

/**
 * 批量获取所有商品的订单次数
 * @returns {Promise<Object>} { productId: orderCount }
 */
async function getAllProductOrderCounts() {
  if (!initCloud()) {
    return wx.getStorageSync('productOrderCounts') || {};
  }

  try {
    const db = wx.cloud.database();
    const result = await db.collection('productStats').get();
    
    const counts = {};
    result.data.forEach(item => {
      counts[item.productId] = item.orderCount || 0;
    });
    
    return counts;
  } catch (e) {
    console.error('获取所有商品订单次数失败:', e);
    return wx.getStorageSync('productOrderCounts') || {};
  }
}

/**
 * 获取厨师的完成单数（从云数据库）
 * @param {number} chefId 厨师ID
 * @returns {Promise<number>} 完成单数
 */
async function getChefOrderCount(chefId) {
  if (!initCloud()) {
    const chefCounts = wx.getStorageSync('chefOrderCounts') || {};
    return chefCounts[chefId] || 0;
  }

  try {
    const db = wx.cloud.database();
    const result = await db.collection('chefStats')
      .where({ chefId: chefId })
      .get();
    
    if (result.data.length > 0) {
      return result.data[0].ordersCount || 0;
    }
    return 0;
  } catch (e) {
    console.error('获取厨师完成单数失败:', e);
    const chefCounts = wx.getStorageSync('chefOrderCounts') || {};
    return chefCounts[chefId] || 0;
  }
}

/**
 * 增加厨师的完成单数（云数据库）
 * @param {number} chefId 厨师ID
 * @returns {Promise<boolean>} 是否成功
 */
async function incrementChefOrderCount(chefId) {
  if (!initCloud()) {
    let chefCounts = wx.getStorageSync('chefOrderCounts') || {};
    chefCounts[chefId] = (chefCounts[chefId] || 0) + 1;
    wx.setStorageSync('chefOrderCounts', chefCounts);
    return true;
  }

  try {
    const db = wx.cloud.database();
    const _ = db.command;
    
    const updateResult = await db.collection('chefStats')
      .where({ chefId: chefId })
      .update({
        data: {
          ordersCount: _.inc(1),
          updateTime: new Date()
        }
      });
    
    if (updateResult.stats.updated === 0) {
      await db.collection('chefStats').add({
        data: {
          chefId: chefId,
          ordersCount: 1,
          createTime: new Date(),
          updateTime: new Date()
        }
      });
    }
    
    return true;
  } catch (e) {
    console.error('更新厨师完成单数失败:', e);
    let chefCounts = wx.getStorageSync('chefOrderCounts') || {};
    chefCounts[chefId] = (chefCounts[chefId] || 0) + 1;
    wx.setStorageSync('chefOrderCounts', chefCounts);
    return false;
  }
}

/**
 * 批量获取所有厨师的完成单数
 * @returns {Promise<Object>} { chefId: ordersCount }
 */
async function getAllChefOrderCounts() {
  if (!initCloud()) {
    return wx.getStorageSync('chefOrderCounts') || {};
  }

  try {
    const db = wx.cloud.database();
    const result = await db.collection('chefStats').get();
    
    const counts = {};
    result.data.forEach(item => {
      counts[item.chefId] = item.ordersCount || 0;
    });
    
    return counts;
  } catch (e) {
    console.error('获取所有厨师完成单数失败:', e);
    return wx.getStorageSync('chefOrderCounts') || {};
  }
}

module.exports = {
  initCloud,
  getProductOrderCount,
  incrementProductOrderCount,
  getAllProductOrderCounts,
  getChefOrderCount,
  incrementChefOrderCount,
  getAllChefOrderCounts
};
