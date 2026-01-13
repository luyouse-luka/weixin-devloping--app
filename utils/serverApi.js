/**
 * 服务器API工具 - 使用阿里云服务器存储订单统计数据
 * 所有用户可以看到相同的下单次数和厨师完成单数
 */

// 配置：你的阿里云服务器API地址
// 注意：小程序要求使用HTTPS协议，且需要在微信后台配置域名白名单
const API_BASE_URL = 'https://luyouseapp.top/api'; // 替换为你的服务器域名

// 是否启用服务器API（设为false则使用本地存储）
const ENABLE_SERVER_API = true; // 部署服务器后改为 true

/**
 * 发送HTTP请求
 * @param {string} url 请求地址
 * @param {object} options 请求选项
 * @returns {Promise} 请求结果
 */
function request(url, options = {}) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        ...options.header
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(new Error(`请求失败: ${res.statusCode}`));
        }
      },
      fail: (err) => {
        console.error('请求失败:', err);
        reject(err);
      }
    });
  });
}

/**
 * 获取商品的订单次数（从服务器）
 * @param {number} productId 商品ID
 * @returns {Promise<number>} 订单次数
 */
async function getProductOrderCount(productId) {
  if (!ENABLE_SERVER_API) {
    // 使用本地存储
    const orderCounts = wx.getStorageSync('productOrderCounts') || {};
    return orderCounts[productId] || 0;
  }

  try {
    const result = await request(`${API_BASE_URL}/product/${productId}/orderCount`, {
      method: 'GET'
    });
    return result.orderCount || 0;
  } catch (e) {
    console.error('获取商品订单次数失败:', e);
    // 降级到本地存储
    const orderCounts = wx.getStorageSync('productOrderCounts') || {};
    return orderCounts[productId] || 0;
  }
}

/**
 * 增加商品的订单次数（服务器）
 * @param {number} productId 商品ID
 * @returns {Promise<boolean>} 是否成功
 */
async function incrementProductOrderCount(productId) {
  if (!ENABLE_SERVER_API) {
    // 使用本地存储
    let orderCounts = wx.getStorageSync('productOrderCounts') || {};
    orderCounts[productId] = (orderCounts[productId] || 0) + 1;
    wx.setStorageSync('productOrderCounts', orderCounts);
    return true;
  }

  try {
    await request(`${API_BASE_URL}/product/${productId}/incrementOrder`, {
      method: 'POST'
    });
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
  if (!ENABLE_SERVER_API) {
    return wx.getStorageSync('productOrderCounts') || {};
  }

  try {
    const result = await request(`${API_BASE_URL}/products/orderCounts`, {
      method: 'GET'
    });
    return result.data || {};
  } catch (e) {
    console.error('获取所有商品订单次数失败:', e);
    return wx.getStorageSync('productOrderCounts') || {};
  }
}

/**
 * 获取厨师的完成单数（从服务器）
 * @param {number} chefId 厨师ID
 * @returns {Promise<number>} 完成单数
 */
async function getChefOrderCount(chefId) {
  if (!ENABLE_SERVER_API) {
    const chefCounts = wx.getStorageSync('chefOrderCounts') || {};
    return chefCounts[chefId] || 0;
  }

  try {
    const result = await request(`${API_BASE_URL}/chef/${chefId}/orderCount`, {
      method: 'GET'
    });
    return result.ordersCount || 0;
  } catch (e) {
    console.error('获取厨师完成单数失败:', e);
    const chefCounts = wx.getStorageSync('chefOrderCounts') || {};
    return chefCounts[chefId] || 0;
  }
}

/**
 * 增加厨师的完成单数（服务器）
 * @param {number} chefId 厨师ID
 * @returns {Promise<boolean>} 是否成功
 */
async function incrementChefOrderCount(chefId) {
  if (!ENABLE_SERVER_API) {
    let chefCounts = wx.getStorageSync('chefOrderCounts') || {};
    chefCounts[chefId] = (chefCounts[chefId] || 0) + 1;
    wx.setStorageSync('chefOrderCounts', chefCounts);
    return true;
  }

  try {
    await request(`${API_BASE_URL}/chef/${chefId}/incrementOrder`, {
      method: 'POST'
    });
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
  if (!ENABLE_SERVER_API) {
    return wx.getStorageSync('chefOrderCounts') || {};
  }

  try {
    const result = await request(`${API_BASE_URL}/chefs/orderCounts`, {
      method: 'GET'
    });
    return result.data || {};
  } catch (e) {
    console.error('获取所有厨师完成单数失败:', e);
    return wx.getStorageSync('chefOrderCounts') || {};
  }
}

module.exports = {
  getProductOrderCount,
  incrementProductOrderCount,
  getAllProductOrderCounts,
  getChefOrderCount,
  incrementChefOrderCount,
  getAllChefOrderCounts
};
