# 服务器连接问题排查指南

## 问题现象

已勾选"不校验合法域名"，但仍报错 `ERR_CONNECTION_CLOSED`。

## 可能原因

### 1. 服务器未正确监听 HTTPS

**问题：** 小程序要求使用 HTTPS，但服务器可能只监听 HTTP。

**检查：**
- 确认服务器是否配置了 SSL 证书
- 确认服务器是否监听 443 端口（HTTPS）
- 检查 Nginx/Apache 反向代理配置

**解决方案：**
如果使用 Nginx 反向代理，确保配置了 HTTPS：

```nginx
server {
    listen 443 ssl;
    server_name luyouseapp.top;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location /api {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 2. 服务器未运行或端口错误

**检查：**
```bash
# 检查服务器是否运行
curl https://luyouseapp.top/api/health

# 应该返回：{"success": true, "message": "服务运行正常"}
```

**解决方案：**
- 确认 Node.js 服务器正在运行
- 检查服务器日志是否有错误
- 确认端口配置正确

### 3. 防火墙或安全组配置

**检查：**
- 服务器防火墙是否开放了 443 端口
- 云服务器安全组是否允许 HTTPS 访问
- 是否有其他网络拦截

### 4. SSL 证书问题

**检查：**
- SSL 证书是否有效
- 证书是否过期
- 证书域名是否匹配

**测试：**
```bash
# 检查 SSL 证书
openssl s_client -connect luyouseapp.top:443
```

### 5. 服务器代码问题

**检查服务器日志：**
- 查看服务器控制台输出
- 检查是否有错误信息
- 确认数据库连接正常

### 6. 网络代理问题

**检查：**
- 是否使用了代理
- 代理配置是否正确
- 尝试关闭代理测试

## 调试步骤

### 步骤1：测试服务器健康检查

在浏览器中访问：
```
https://luyouseapp.top/api/health
```

应该返回：
```json
{"success": true, "message": "服务运行正常"}
```

### 步骤2：检查服务器日志

查看服务器控制台，应该看到：
```
[2026-01-13T...] GET /api/products/orderCounts
```

如果没有看到请求日志，说明请求没有到达服务器。

### 步骤3：检查网络连接

在微信开发者工具中：
1. 打开 **调试器** -> **Network**
2. 查看请求详情
3. 检查请求状态码和错误信息

### 步骤4：测试不同端点

尝试访问不同的 API 端点：
- `/api/health` - 健康检查（最简单）
- `/api/products/orderCounts` - 商品订单次数

## 临时解决方案

如果服务器暂时无法修复，可以：

1. **使用本地存储（已实现降级）**
   - 代码已实现自动降级到本地存储
   - 功能可以正常使用，但数据不会同步

2. **检查服务器配置**
   - 确认服务器正在运行
   - 确认 HTTPS 配置正确
   - 确认防火墙规则

## 服务器配置检查清单

- [ ] 服务器正在运行
- [ ] 监听 HTTPS (443 端口)
- [ ] SSL 证书有效且未过期
- [ ] 防火墙开放 443 端口
- [ ] 云服务器安全组允许 HTTPS
- [ ] Nginx/Apache 反向代理配置正确
- [ ] 数据库连接正常
- [ ] CORS 配置正确（已更新代码）

## 联系支持

如果以上步骤都无法解决问题，请提供：
1. 服务器日志
2. 网络请求详情（从开发者工具 Network 面板）
3. 服务器配置信息（Nginx/Apache 配置）

