# 阿里云 OSS 字体配置检查清单

## ⚠️ 当前问题
您的 Bucket ACL 设置为**私有**，这会导致小程序无法访问字体文件。

## ✅ 解决步骤

### 第 1 步：设置字体文件为公共读

在阿里云 OSS 控制台：

1. 进入 Bucket：`family-app-fonts`
2. 找到以下文件：
   - [ ] `feihuasong-subset.woff2`
   - [ ] `dlzh-subset.woff2`

3. 对每个文件：
   - 勾选文件
   - 点击"更多" → "设置读写权限"
   - 选择"**公共读**"
   - 点击"确定"

### 第 2 步：验证文件可访问

在浏览器中打开以下链接，确认可以下载文件：

- [ ] https://family-app-fonts.oss-cn-shanghai.aliyuncs.com/feihuasong-subset.woff2
- [ ] https://family-app-fonts.oss-cn-shanghai.aliyuncs.com/dlzh-subset.woff2

**如果可以下载，说明配置成功！** ✅

### 第 3 步：配置小程序域名白名单

在微信小程序后台：

1. 登录 [微信公众平台](https://mp.weixin.qq.com)
2. 进入"开发" → "开发管理" → "开发设置"
3. 找到"服务器域名"
4. 在"**downloadFile合法域名**"中添加：
   ```
   https://family-app-fonts.oss-cn-shanghai.aliyuncs.com
   ```
5. 保存配置

### 第 4 步：更新 app.wxss

复制 `fonts/subset/font-config-example.wxss` 中的内容到您的 `app.wxss` 文件中。

或者直接复制以下代码：

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

### 第 5 步：测试

1. 重新编译小程序
2. 打开控制台，查看是否有字体加载错误
3. 检查页面字体显示效果
4. 确认所有文字都能正常显示

## 🔒 安全性说明

### 为什么字体文件可以设置为公共读？

✅ **这是安全的**，因为：
1. 字体文件不包含敏感信息
2. 这是行业标准做法（Google Fonts、Adobe Fonts 都是公开的）
3. Bucket 整体仍然是私有的，只有字体文件是公开的

### 额外的安全措施（可选）

#### 1. 配置 Referer 防盗链

在 OSS 控制台：
1. 进入 Bucket 设置
2. 访问控制 → Referer 防盗链
3. 添加白名单：
   ```
   https://servicewechat.com/*
   https://*.qq.com/*
   ```
4. 选择"允许空 Referer"（小程序需要）

#### 2. 监控流量

在 OSS 控制台设置：
1. 开启访问日志
2. 设置流量告警
3. 定期检查访问统计

## 🚀 进阶优化（可选）

### 使用 CDN 加速

**优点**：
- 更快的加载速度
- 节省 OSS 流量费用
- 更好的用户体验

**配置步骤**：
1. 开通阿里云 CDN
2. 添加加速域名（如 `fonts.yourdomain.com`）
3. 源站选择您的 OSS Bucket
4. 配置 HTTPS 证书
5. 设置缓存规则（.woff2 缓存 1 年）

## ❓ 故障排除

### 问题 1：字体无法加载

**检查**：
- [ ] 文件权限是否为公共读
- [ ] 浏览器中能否直接访问 URL
- [ ] 小程序域名白名单是否配置
- [ ] 控制台是否有错误信息

### 问题 2：403 Forbidden 错误

**原因**：文件权限未设置为公共读

**解决**：按照第 1 步重新设置文件权限

### 问题 3：跨域错误

**解决**：
1. 进入 OSS 控制台
2. Bucket 设置 → 跨域设置
3. 创建规则：
   - 来源：`*`
   - 允许 Methods：`GET`
   - 允许 Headers：`*`

## 📝 完成检查

- [ ] 字体文件已设置为公共读
- [ ] 浏览器中可以访问字体 URL
- [ ] 小程序域名白名单已配置
- [ ] app.wxss 已更新
- [ ] 小程序中字体显示正常

## 🎯 总结

**推荐配置**：
1. ✅ Bucket ACL 保持私有（保护其他文件）
2. ✅ 字体文件设置为公共读（允许小程序访问）
3. ✅ 配置 Referer 防盗链（可选，增强安全）
4. ✅ 使用 CDN 加速（可选，提升性能）

这样既保证了安全性，又能让小程序正常访问字体文件！
