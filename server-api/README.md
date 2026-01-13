# 阿里云服务器API接口文档

## 📋 概述

这个小程序使用阿里云服务器来存储订单统计数据，实现所有用户共享数据。

## 🚀 服务器端实现

### 技术栈建议
- **Node.js + Express** (推荐)
- **Python + Flask/Django**
- **PHP + Laravel**
- **Java + Spring Boot**

### 数据库设计

#### 1. 商品统计表 (product_stats)

```sql
CREATE TABLE product_stats (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL UNIQUE,
  order_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_product_id (product_id)
);
```

#### 2. 厨师统计表 (chef_stats)

```sql
CREATE TABLE chef_stats (
  id INT PRIMARY KEY AUTO_INCREMENT,
  chef_id INT NOT NULL UNIQUE,
  orders_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_chef_id (chef_id)
);
```

## 📡 API接口

### 基础URL
```
https://your-server-domain.com/api
```

### 1. 获取商品订单次数

**GET** `/product/:productId/orderCount`

**响应示例:**
```json
{
  "success": true,
  "orderCount": 128
}
```

### 2. 增加商品订单次数

**POST** `/product/:productId/incrementOrder`

**响应示例:**
```json
{
  "success": true,
  "message": "更新成功"
}
```

### 3. 批量获取所有商品订单次数

**GET** `/products/orderCounts`

**响应示例:**
```json
{
  "success": true,
  "data": {
    "1": 128,
    "2": 95,
    "3": 112
  }
}
```

### 4. 获取厨师完成单数

**GET** `/chef/:chefId/orderCount`

**响应示例:**
```json
{
  "success": true,
  "ordersCount": 256
}
```

### 5. 增加厨师完成单数

**POST** `/chef/:chefId/incrementOrder`

**响应示例:**
```json
{
  "success": true,
  "message": "更新成功"
}
```

### 6. 批量获取所有厨师完成单数

**GET** `/chefs/orderCounts`

**响应示例:**
```json
{
  "success": true,
  "data": {
    "1": 256,
    "2": 189,
    "3": 234
  }
}
```

## 💻 Node.js + Express 示例代码

### 安装依赖
```bash
npm install express mysql2 cors
```

### server.js

```javascript
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 数据库配置
const dbConfig = {
  host: 'localhost',
  user: 'your_username',
  password: 'your_password',
  database: 'your_database'
};

// 创建数据库连接池
const pool = mysql.createPool(dbConfig);

// 1. 获取商品订单次数
app.get('/api/product/:productId/orderCount', async (req, res) => {
  try {
    const productId = parseInt(req.params.productId);
    const [rows] = await pool.execute(
      'SELECT order_count FROM product_stats WHERE product_id = ?',
      [productId]
    );
    
    const orderCount = rows.length > 0 ? rows[0].order_count : 0;
    res.json({ success: true, orderCount });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 2. 增加商品订单次数
app.post('/api/product/:productId/incrementOrder', async (req, res) => {
  try {
    const productId = parseInt(req.params.productId);
    
    // 使用 INSERT ... ON DUPLICATE KEY UPDATE 实现 upsert
    await pool.execute(
      `INSERT INTO product_stats (product_id, order_count) 
       VALUES (?, 1) 
       ON DUPLICATE KEY UPDATE order_count = order_count + 1`,
      [productId]
    );
    
    res.json({ success: true, message: '更新成功' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 3. 批量获取所有商品订单次数
app.get('/api/products/orderCounts', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT product_id, order_count FROM product_stats'
    );
    
    const data = {};
    rows.forEach(row => {
      data[row.product_id] = row.order_count;
    });
    
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 4. 获取厨师完成单数
app.get('/api/chef/:chefId/orderCount', async (req, res) => {
  try {
    const chefId = parseInt(req.params.chefId);
    const [rows] = await pool.execute(
      'SELECT orders_count FROM chef_stats WHERE chef_id = ?',
      [chefId]
    );
    
    const ordersCount = rows.length > 0 ? rows[0].orders_count : 0;
    res.json({ success: true, ordersCount });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 5. 增加厨师完成单数
app.post('/api/chef/:chefId/incrementOrder', async (req, res) => {
  try {
    const chefId = parseInt(req.params.chefId);
    
    await pool.execute(
      `INSERT INTO chef_stats (chef_id, orders_count) 
       VALUES (?, 1) 
       ON DUPLICATE KEY UPDATE orders_count = orders_count + 1`,
      [chefId]
    );
    
    res.json({ success: true, message: '更新成功' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 6. 批量获取所有厨师完成单数
app.get('/api/chefs/orderCounts', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT chef_id, orders_count FROM chef_stats'
    );
    
    const data = {};
    rows.forEach(row => {
      data[row.chef_id] = row.orders_count;
    });
    
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});
```

## 🔒 安全建议

1. **HTTPS**: 必须使用HTTPS协议
2. **CORS**: 配置允许小程序域名访问
3. **限流**: 防止恶意请求
4. **参数验证**: 验证所有输入参数
5. **错误处理**: 不要暴露敏感信息

## 📝 小程序端配置

在 `utils/serverApi.js` 中修改：

```javascript
const API_BASE_URL = 'https://your-server-domain.com/api'; // 替换为你的服务器域名
```

## 🚀 部署步骤

1. 在服务器上安装 Node.js、MySQL 等环境
2. 创建数据库和表结构
3. 部署API服务
4. 配置HTTPS证书
5. 在小程序中配置API地址
6. 测试接口是否正常

## ⚠️ 注意事项

- 小程序要求使用HTTPS协议
- 需要在微信小程序后台配置服务器域名白名单
- 建议添加请求频率限制，防止恶意刷数据
