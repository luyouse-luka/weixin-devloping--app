# 快速开始 - 阿里云服务器方案

## 📋 方案说明

**当前实现**: 使用本地存储，每个用户只能看到自己的数据  
**服务器方案**: 使用阿里云服务器，所有用户共享数据

## 🎯 两种方案对比

| 特性 | 本地存储（当前） | 阿里云服务器 |
|------|----------------|-------------|
| 数据共享 | ❌ 每个用户独立 | ✅ 所有用户共享 |
| 需要服务器 | ❌ 不需要 | ✅ 需要 |
| 实现难度 | ✅ 简单 | ⚠️ 中等 |
| 数据持久化 | ⚠️ 卸载会丢失 | ✅ 永久保存 |

## 🚀 快速部署（3步）

### 步骤1: 部署服务器API

```bash
# 1. 上传 server-api 目录到你的阿里云服务器
# 2. 安装依赖
cd server-api
npm install

# 3. 配置数据库（修改 server.js 中的数据库配置）
# 4. 执行 init.sql 创建数据库表

# 5. 启动服务
node server.js
# 或使用 PM2: pm2 start server.js
```

### 步骤2: 配置HTTPS

小程序必须使用HTTPS，可以使用：
- Let's Encrypt 免费证书
- 阿里云SSL证书

### 步骤3: 修改小程序配置

在 `utils/serverApi.js` 中：

```javascript
// 1. 修改API地址
const API_BASE_URL = 'https://your-domain.com/api';

// 2. 启用服务器API
const ENABLE_SERVER_API = true; // 改为 true
```

## 📝 详细文档

- **服务器部署**: 查看 `ALIYUN_SERVER_SETUP.md`
- **API文档**: 查看 `server-api/README.md`
- **数据库初始化**: 查看 `server-api/init.sql`

## ⚠️ 重要提示

1. **HTTPS必须**: 小程序要求使用HTTPS协议
2. **域名白名单**: 需要在微信小程序后台配置服务器域名
3. **当前默认**: 代码默认使用本地存储，部署服务器后需要手动启用

## 🔄 切换方案

### 使用本地存储（当前默认）
- 无需任何配置
- 每个用户独立数据

### 使用服务器（需要部署）
1. 部署服务器API
2. 配置HTTPS
3. 修改 `utils/serverApi.js` 中的 `ENABLE_SERVER_API = true`
4. 修改API地址

## 💡 建议

- **开发测试**: 使用本地存储
- **正式上线**: 使用服务器方案，实现数据共享
