# 阿里云服务器部署指南

## 📋 概述

使用阿里云服务器存储订单统计数据，实现所有用户共享数据。**无需开通微信云开发服务**。

## ✅ 优势

- ✅ 使用现有的阿里云服务器
- ✅ 无需开通微信云开发
- ✅ 完全控制数据
- ✅ 可以扩展更多功能

## 🚀 快速开始

### 1. 服务器环境准备

确保服务器已安装：
- Node.js (推荐 v16+)
- MySQL (推荐 5.7+)
- Nginx (用于反向代理和HTTPS)

### 2. 部署步骤

#### 步骤1: 上传代码到服务器

```bash
# 在服务器上创建项目目录
mkdir -p /var/www/weixin-app-api
cd /var/www/weixin-app-api

# 上传 server-api 目录下的所有文件
# 或使用 git clone
```

#### 步骤2: 安装依赖

```bash
cd /var/www/weixin-app-api/server-api
npm install
```

#### 步骤3: 配置数据库

```bash
# 登录MySQL
mysql -u root -p

# 执行初始化SQL
source /var/www/weixin-app-api/server-api/init.sql
```

#### 步骤4: 配置环境变量

创建 `.env` 文件：

```bash
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=weixin_app
PORT=3000
```

#### 步骤5: 启动服务

```bash
# 使用 PM2 管理进程（推荐）
npm install -g pm2
pm2 start server.js --name weixin-app-api

# 或直接运行
node server.js
```

### 3. 配置HTTPS（必须）

小程序要求使用HTTPS协议。

#### 使用Nginx反向代理

```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/your/cert.pem;
    ssl_certificate_key /path/to/your/key.pem;

    location /api {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

#### 使用Let's Encrypt免费证书

```bash
# 安装 certbot
sudo apt-get install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d your-domain.com
```

### 4. 配置小程序

在 `utils/serverApi.js` 中修改API地址：

```javascript
const API_BASE_URL = 'https://your-domain.com/api';
```

### 5. 配置小程序域名白名单

在微信小程序后台：
1. 开发 -> 开发管理 -> 开发设置
2. 服务器域名 -> request合法域名
3. 添加你的服务器域名：`https://your-domain.com`

## 🔧 小程序端集成

### 修改 productList.js

```javascript
const serverApi = require('../../utils/serverApi');

// 加载商品时
async loadInitialProducts() {
  // ... 加载商品数据
  
  // 从服务器获取订单次数
  const orderCounts = await serverApi.getAllProductOrderCounts();
  
  const productsWithOrderCount = mockProducts.map(p => ({
    ...p,
    orderCount: orderCounts[p.id] || 0
  }));
  
  this.setData({ products: productsWithOrderCount });
}

// 下单时
async placeOrder() {
  // ... 其他代码
  
  // 更新服务器
  for (const cartItem of cart) {
    await serverApi.incrementProductOrderCount(cartItem.id);
  }
}
```

### 修改 chooseChef.js

```javascript
const serverApi = require('../../utils/serverApi');

// 加载厨师时
async onLoad(options) {
  // ... 其他代码
  
  // 从服务器获取完成单数
  const chefCounts = await serverApi.getAllChefOrderCounts();
  
  const chefsWithCounts = this.data.chefs.map(chef => ({
    ...chef,
    ordersCount: chefCounts[chef.id] || 0
  }));
  
  this.setData({ chefs: chefsWithCounts });
}

// 下单时
async confirmAndSubmit() {
  // ... 其他代码
  
  // 更新服务器
  await serverApi.incrementChefOrderCount(selectedChef.id);
  
  for (const cartItem of cart) {
    await serverApi.incrementProductOrderCount(cartItem.id);
  }
}
```

## 🔒 安全建议

1. **使用HTTPS**: 必须配置SSL证书
2. **API限流**: 防止恶意请求
3. **参数验证**: 验证所有输入
4. **错误处理**: 不要暴露敏感信息
5. **防火墙**: 只开放必要端口

### 添加限流中间件

```javascript
// 简单的限流实现
const rateLimit = {};
const RATE_LIMIT = 100; // 每分钟最多100次请求
const RATE_WINDOW = 60000; // 1分钟

app.use((req, res, next) => {
  const ip = req.ip;
  const now = Date.now();
  
  if (!rateLimit[ip]) {
    rateLimit[ip] = { count: 0, resetTime: now + RATE_WINDOW };
  }
  
  if (now > rateLimit[ip].resetTime) {
    rateLimit[ip] = { count: 0, resetTime: now + RATE_WINDOW };
  }
  
  rateLimit[ip].count++;
  
  if (rateLimit[ip].count > RATE_LIMIT) {
    return res.status(429).json({ success: false, message: '请求过于频繁' });
  }
  
  next();
});
```

## 📊 监控和维护

### 使用PM2监控

```bash
# 查看状态
pm2 status

# 查看日志
pm2 logs weixin-app-api

# 重启服务
pm2 restart weixin-app-api
```

### 数据库备份

```bash
# 每天备份
mysqldump -u root -p weixin_app > backup_$(date +%Y%m%d).sql
```

## 🐛 故障排查

1. **检查服务是否运行**
   ```bash
   pm2 status
   ```

2. **检查端口是否监听**
   ```bash
   netstat -tlnp | grep 3000
   ```

3. **查看日志**
   ```bash
   pm2 logs weixin-app-api
   ```

4. **测试API接口**
   ```bash
   curl https://your-domain.com/api/health
   ```

## 📝 注意事项

- 小程序必须使用HTTPS
- 需要在微信后台配置域名白名单
- 建议使用PM2等进程管理工具
- 定期备份数据库
- 监控服务器资源使用情况
