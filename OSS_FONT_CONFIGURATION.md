# 阿里云 OSS 字体文件配置指南

## 当前问题
Bucket ACL 设置为私有，导致小程序无法访问字体文件。

## 解决方案：设置文件级别的公共读权限

### 步骤 1：设置字体文件为公共读

1. 登录阿里云 OSS 控制台
2. 进入 Bucket：`family-app-fonts`
3. 找到以下文件：
   - `feihuasong-subset.woff2`
   - `dlzh-subset.woff2`
   - `font-config-example.wxss`（可选）

4. 对每个文件执行：
   - 勾选文件
   - 点击"更多" → "设置读写权限"
   - 选择"公共读"
   - 点击"确定"

### 步骤 2：验证访问

在浏览器中访问以下 URL，确认可以下载：

```
https://family-app-fonts.oss-cn-shanghai.aliyuncs.com/feihuasong-subset.woff2
https://family-app-fonts.oss-cn-shanghai.aliyuncs.com/dlzh-subset.woff2
```

如果能下载文件，说明配置成功。

### 步骤 3：更新 app.wxss

使用以下配置：

```css
@font-face {
  font-family: 'FeiHuaSong';
  src: url('https://family-app-fonts.oss-cn-shanghai.aliyuncs.com/feihuasong-subset.woff2') format('woff2');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'DingLieZhuHai';
  src: url('https://family-app-fonts.oss-cn-shanghai.aliyuncs.com/dlzh-subset.woff2') format('woff2');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

page {
  font-family: 'FeiHuaSong', 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.title,
.order-title,
.page-title,
.section-title,
.product-name,
.item-name,
.chef-name,
.couplet-line,
.couplet-subtitle,
.category-item,
.top-bar,
.empty-cart,
.page-subtitle {
  font-family: 'DingLieZhuHai', 'FeiHuaSong', sans-serif;
  font-weight: 600;
}
```

## 安全性说明

### 为什么字体文件可以设置为公共读？

1. **字体文件本身不包含敏感信息**
   - 只是字形数据
   - 不包含用户数据或业务逻辑

2. **行业标准做法**
   - Google Fonts、Adobe Fonts 等都是公开访问
   - 大多数网站的字体文件都是公开的

3. **Bucket 整体仍然安全**
   - Bucket ACL 保持私有
   - 只有特定文件是公共读
   - 其他文件仍然受保护

### 如果仍然担心安全性

可以考虑以下额外措施：

1. **配置 Referer 防盗链**
   ```
   在 OSS 控制台：
   Bucket 设置 → 访问控制 → Referer 防盗链
   添加允许的域名：
   - https://servicewechat.com/*
   - https://your-domain.com/*
   ```

2. **使用 CDN**
   - 配置 CDN 加速
   - 在 CDN 层面设置访问控制
   - 隐藏真实的 OSS 地址

3. **监控访问日志**
   - 开启 OSS 访问日志
   - 监控异常访问
   - 设置流量告警

## 进阶配置：使用 CDN（可选）

### 优点
- 更快的加载速度
- 节省 OSS 流量费用（CDN 流量更便宜）
- 更好的用户体验
- 可以配置更细粒度的访问控制

### 配置步骤
1. 开通阿里云 CDN
2. 添加加速域名（如 `fonts.yourdomain.com`）
3. 源站类型选择"OSS域名"
4. 选择您的 Bucket
5. 配置 HTTPS 证书
6. 设置缓存规则：
   - `.woff2` 文件缓存 1 年
   - 开启 Gzip 压缩

### 使用 CDN 后的配置
```css
@font-face {
  font-family: 'FeiHuaSong';
  src: url('https://fonts.yourdomain.com/feihuasong-subset.woff2') format('woff2');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}
```

## 故障排除

### 字体无法加载
1. 检查文件权限是否为公共读
2. 在浏览器中直接访问 URL 测试
3. 检查小程序域名白名单
4. 查看控制台错误信息

### 403 错误
- 文件权限未设置为公共读
- Referer 防盗链配置错误
- 需要在文件级别设置权限

### 跨域问题
OSS 默认支持跨域，如果遇到问题：
1. 进入 OSS 控制台
2. Bucket 设置 → 跨域设置 → 创建规则
3. 来源：`*` 或 `https://servicewechat.com`
4. 允许 Methods：`GET`
5. 允许 Headers：`*`

## 总结

**推荐配置**：
1. ✅ Bucket ACL 保持私有
2. ✅ 字体文件设置为公共读
3. ✅ 配置 Referer 防盗链（可选）
4. ✅ 使用 CDN 加速（推荐）

这样既保证了安全性，又能让小程序正常访问字体文件。
