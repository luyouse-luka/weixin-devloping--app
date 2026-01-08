# 订单通知功能使用说明

## 功能概述

当用户下单成功后，系统会尝试向管理者发送通知。支持两种通知方式：

1. **订阅消息**（推荐）：通过微信订阅消息推送到管理者手机
2. **本地存储**（备用）：订单保存在本地，管理者通过小程序查看

## 配置步骤

### 方式一：使用订阅消息（推荐）

#### 1. 在小程序后台配置订阅消息模板

1. 登录[微信公众平台](https://mp.weixin.qq.com/)
2. 进入小程序后台 → 功能 → 订阅消息
3. 选择"公共模板库"或"我的模板"
4. 选择合适的模板，例如：
   - 模板标题：订单通知
   - 模板内容示例：
     - 订单号：{{orderId.DATA}}
     - 订单金额：{{amount.DATA}}
     - 下单时间：{{time.DATA}}
     - 订单详情：{{detail.DATA}}
5. 获取模板ID（格式类似：`xxxxxxxxxxxxxxxxxxxxxxxxxxxxx`）

#### 2. 配置模板ID

在 `app.js` 中添加：

```javascript
App({
  globalData: {
    subscribeMessageTemplateId: 'YOUR_TEMPLATE_ID_HERE' // 替换为实际的模板ID
  }
})
```

#### 3. 配置云函数（可选，如果有云开发）

创建云函数 `sendOrderNotification`：

```javascript
// cloudfunctions/sendOrderNotification/index.js
const cloud = require('wx-server-sdk')
cloud.init()

exports.main = async (event, context) => {
  const { templateId, orderData, managerOpenId } = event
  
  try {
    const result = await cloud.openapi.subscribeMessage.send({
      touser: managerOpenId, // 管理者的openid
      template_id: templateId,
      page: 'pages/orders/orders', // 点击消息跳转的页面
      data: {
        orderId: {
          value: orderData.orderId
        },
        amount: {
          value: '¥' + orderData.totalPrice
        },
        time: {
          value: orderData.orderTime
        },
        detail: {
          value: orderData.cart.map(item => item.name).join('、')
        }
      }
    })
    
    return { success: true, result }
  } catch (err) {
    console.error('发送订阅消息失败:', err)
    return { success: false, error: err }
  }
}
```

### 方式二：使用本地存储（无需配置）

如果不想配置订阅消息，系统会自动使用本地存储方式：
- 订单保存在本地存储中
- 管理者可以通过小程序查看订单列表
- 可以显示未读订单数量

## 管理者查看订单

### 创建管理者页面（可选）

如果需要为管理者创建专门的订单管理页面：

1. 创建页面 `pages/managerOrders/managerOrders`
2. 显示所有订单列表
3. 显示未读订单数量
4. 可以标记订单为已读/已处理

## 注意事项

1. **订阅消息限制**：
   - 用户需要主动授权订阅消息
   - 订阅消息有发送频率限制
   - 模板消息需要用户同意才能发送

2. **云开发**：
   - 如果使用云函数发送订阅消息，需要开通云开发
   - 需要获取管理者的openid并保存

3. **备用方案**：
   - 如果订阅消息失败，会自动使用本地存储
   - 管理者可以通过小程序查看订单

## 测试

1. 测试订阅消息：
   - 确保已配置模板ID
   - 用户下单时会弹出订阅消息授权
   - 授权后，管理者会收到消息

2. 测试本地存储：
   - 不配置模板ID或拒绝订阅消息
   - 订单会自动保存到本地
   - 可以通过 `wx.getStorageSync('allOrders')` 查看

## 常见问题

**Q: 为什么收不到订阅消息？**
A: 检查以下几点：
- 模板ID是否正确配置
- 用户是否授权了订阅消息
- 云函数是否正确配置（如果使用云开发）
- 管理者的openid是否正确

**Q: 如何获取管理者的openid？**
A: 可以通过以下方式：
- 让管理者在小程序中登录
- 通过 `wx.login()` 获取code
- 通过后端接口或云函数换取openid
- 保存到本地存储或数据库

**Q: 可以同时使用多种通知方式吗？**
A: 可以，代码已经支持多种方式同时使用。





