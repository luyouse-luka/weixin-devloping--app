# 订阅消息配置完整指南

## 问题诊断：为什么收不到订阅消息？

### 常见原因：

1. **模板ID未配置** ❌
2. **管理者openid未获取** ❌
3. **云开发未开通或云函数未部署** ❌
4. **订阅消息模板字段不匹配** ❌
5. **管理者未在小程序中授权订阅消息** ❌

---

## 完整配置步骤

### 第一步：在小程序后台配置订阅消息模板

1. 登录[微信公众平台](https://mp.weixin.qq.com/)
2. 进入小程序后台 → **功能** → **订阅消息**
3. 选择 **"我的模板"** 或 **"公共模板库"**
4. 选择合适的模板或创建新模板

**推荐模板字段：**
- `thing1` - 订单内容（如：宫保鸡丁、鱼香肉丝）
- `time2` - 下单时间（如：2024-01-01 12:00）
- `thing3` - 订单状态（如：新订单）
- `amount4` - 订单金额（如：58.00）
- `thing5` - 厨师信息（如：张师傅）

5. **复制模板ID**（格式：`9sZAVw0BqGddS5StFPK-cL999aC2Pj8GDzh...`）

### 第二步：配置模板ID到代码

在 `app.js` 中配置：

```javascript
App({
  globalData: {
    subscribeMessageTemplateId: '9sZAVw0BqGddS5StFPK-cL999aC2Pj8GDzh...' // 替换为你的模板ID
  }
})
```

### 第三步：开通云开发

1. 在微信开发者工具中，点击 **"云开发"**
2. 开通云开发环境
3. 创建环境（选择免费版即可）

### 第四步：部署云函数

#### 4.1 创建 `sendOrderNotification` 云函数

1. 在 `cloudfunctions` 目录下创建 `sendOrderNotification` 文件夹
2. 创建 `index.js` 文件（已提供代码）
3. 创建 `package.json`：

```json
{
  "name": "sendOrderNotification",
  "version": "1.0.0",
  "description": "发送订单订阅消息",
  "main": "index.js",
  "dependencies": {
    "wx-server-sdk": "~2.6.3"
  }
}
```

4. 右键点击 `sendOrderNotification` 文件夹
5. 选择 **"上传并部署：云端安装依赖"**

#### 4.2 创建 `getOpenId` 云函数（可选）

用于获取用户openid，步骤同上。

### 第五步：获取管理者openid

#### 方式一：使用小程序页面（推荐）

1. 在小程序中访问：`pages/setManager/setManager`
2. 点击 **"设置为管理者"**
3. 系统会自动获取当前用户的openid并保存

#### 方式二：手动设置

在微信开发者工具的Console中执行：

```javascript
// 获取当前用户的openid（需要先登录）
wx.login({
  success: (res) => {
    // 通过云函数获取openid
    wx.cloud.callFunction({
      name: 'getOpenId',
      success: (result) => {
        const openid = result.result.openid;
        console.log('OpenID:', openid);
        // 保存到本地
        wx.setStorageSync('managerOpenId', openid);
      }
    });
  }
});
```

### 第六步：测试订阅消息

1. **确保管理者已在小程序中授权订阅消息**
   - 管理者需要在小程序中打开
   - 系统会弹出订阅消息授权（如果模板ID已配置）
   - 点击"允许"授权

2. **测试下单流程**
   - 用户下单
   - 选择厨师
   - 提交订单
   - 检查管理者手机是否收到消息

---

## 调试方法

### 1. 检查模板ID

```javascript
// 在页面中打印
const app = getApp();
console.log('模板ID:', app.globalData.subscribeMessageTemplateId);
```

### 2. 检查管理者openid

```javascript
const managerOpenId = wx.getStorageSync('managerOpenId');
console.log('管理者openid:', managerOpenId);
```

### 3. 查看云函数日志

1. 在微信开发者工具中打开 **"云开发"**
2. 进入 **"云函数"** → **"sendOrderNotification"**
3. 查看 **"日志"** 标签页
4. 检查是否有错误信息

### 4. 测试云函数

在微信开发者工具的Console中：

```javascript
wx.cloud.callFunction({
  name: 'sendOrderNotification',
  data: {
    templateId: '你的模板ID',
    orderData: {
      orderId: 'TEST001',
      totalPrice: 58,
      orderTime: '2024-01-01 12:00',
      cart: [{ name: '测试商品', quantity: 1 }],
      chef: { name: '测试厨师' }
    },
    managerOpenId: '管理者的openid'
  },
  success: (res) => {
    console.log('发送结果:', res);
  },
  fail: (err) => {
    console.error('发送失败:', err);
  }
});
```

---

## 常见错误及解决方案

### 错误1：模板ID未配置
**现象**：控制台显示"订阅消息模板ID未配置"

**解决**：在 `app.js` 中配置 `subscribeMessageTemplateId`

### 错误2：管理者openid为空
**现象**：控制台显示"管理者openid未配置"

**解决**：
1. 访问 `pages/setManager/setManager` 页面
2. 点击"设置为管理者"
3. 或手动设置：`wx.setStorageSync('managerOpenId', '管理者的openid')`

### 错误3：云函数调用失败
**现象**：控制台显示"云函数调用失败"

**解决**：
1. 检查是否开通云开发
2. 检查云函数是否已部署
3. 检查云函数代码是否正确
4. 查看云函数日志

### 错误4：订阅消息发送失败
**现象**：云函数返回错误

**可能原因**：
- 模板字段不匹配（检查模板字段名称）
- 字段值格式错误（检查字段值是否符合要求）
- 管理者未授权订阅消息
- 订阅消息频率限制

**解决**：
1. 检查模板字段名称是否与代码中一致
2. 确保字段值符合模板要求（长度、格式等）
3. 让管理者在小程序中重新授权订阅消息
4. 检查是否超过发送频率限制

---

## 备用方案：本地存储

如果订阅消息配置复杂，可以使用本地存储方案：

1. 订单会自动保存到本地存储
2. 管理者访问 `pages/managerOrders/managerOrders` 查看订单
3. 可以显示未读订单数量
4. 可以标记订单为已读/已处理

这种方式不需要配置订阅消息，但需要管理者主动打开小程序查看。

---

## 注意事项

1. **订阅消息需要用户授权**：管理者必须在小程序中授权订阅消息
2. **发送频率限制**：订阅消息有发送频率限制，不要频繁发送
3. **模板字段匹配**：确保代码中的字段名称与模板中的字段名称一致
4. **云开发环境**：确保云开发环境已开通且云函数已部署
5. **测试环境**：在开发版和体验版中，订阅消息可能有限制

---

## 快速检查清单

- [ ] 模板ID已配置到 `app.js`
- [ ] 云开发已开通
- [ ] `sendOrderNotification` 云函数已部署
- [ ] 管理者openid已获取并保存
- [ ] 管理者已在小程序中授权订阅消息
- [ ] 模板字段名称与代码中一致
- [ ] 测试下单后检查云函数日志

完成以上所有步骤后，订阅消息应该可以正常工作了！


