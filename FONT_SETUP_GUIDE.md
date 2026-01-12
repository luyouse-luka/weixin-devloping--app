# 字体配置指南 - IntroRust 和 Lexend

## 字体文件位置

字体文件已下载到 `fonts` 文件夹：
- `IntroRust-Base.woff` / `.woff2` / `.ttf` - 标题字体
- `Lexend-Regular.woff` / `.woff2` / `.ttf` - 正文字体（常规）
- `Lexend-Medium.woff` / `.woff2` / `.ttf` - 正文字体（中等）
- `Lexend-SemiBold.woff` / `.woff2` / `.ttf` - 正文字体（半粗）
- `Lexend-Bold.woff` / `.woff2` / `.ttf` - 正文字体（粗体）

## 配置步骤

### 方式一：使用云存储（推荐，如果有云开发）

1. **打开云开发控制台**
   - 在微信开发者工具中点击"云开发"
   - 进入"存储" -> "文件管理"

2. **上传字体文件**
   - 上传 `IntroRust-Base.woff` 到云存储
   - 上传 `Lexend-Regular.woff` 到云存储
   - 上传 `Lexend-Medium.woff` 到云存储（可选）
   - 上传 `Lexend-SemiBold.woff` 到云存储（可选）
   - 上传 `Lexend-Bold.woff` 到云存储（可选）

3. **获取文件ID**
   - 复制云存储中的文件ID（格式：`cloud://your-env-id.xxx/fonts/introrust-base.woff`）

4. **配置字体URL**
   
   在 `app.js` 的 `globalData` 中配置：
   ```javascript
   globalData: {
     // ... 其他配置
     introRustFontUrl: 'cloud://your-env-id.xxx/fonts/introrust-base.woff',
     lexendFontUrl: 'cloud://your-env-id.xxx/fonts/lexend-regular.woff',
     lexendMediumUrl: 'cloud://your-env-id.xxx/fonts/lexend-medium.woff',
     lexendSemiBoldUrl: 'cloud://your-env-id.xxx/fonts/lexend-semibold.woff',
     lexendBoldUrl: 'cloud://your-env-id.xxx/fonts/lexend-bold.woff'
   }
   ```

### 方式二：使用网络服务器

1. **上传字体到服务器**
   - 将字体文件上传到支持 HTTPS 的服务器
   - 确保服务器支持 CORS（跨域资源共享）

2. **配置字体URL**
   
   在 `app.js` 的 `globalData` 中配置：
   ```javascript
   globalData: {
     // ... 其他配置
     introRustFontUrl: 'https://your-server.com/fonts/introrust-base.woff',
     lexendFontUrl: 'https://your-server.com/fonts/lexend-regular.woff',
     lexendMediumUrl: 'https://your-server.com/fonts/lexend-medium.woff',
     lexendSemiBoldUrl: 'https://your-server.com/fonts/lexend-semibold.woff',
     lexendBoldUrl: 'https://your-server.com/fonts/lexend-bold.woff'
   }
   ```

## 字体应用范围

### IntroRust（标题字体）
- ✅ 对联文字（`.couplet-line`）
- ✅ 页面标题（`.title`, `.order-title`, `.page-title`）
- ✅ 区块标题（`.section-title`）
- ✅ 商品名称（`.product-name`, `.item-name`）
- ✅ 厨师名称（`.chef-name`）
- ✅ 分类标题（`.category-title`）

### Lexend（正文字体）
- ✅ 页面正文（`page` 默认字体）
- ✅ 分类菜单（`.category-item`）
- ✅ 商品介绍（`.product-intro`, `.description`, `.intro`）
- ✅ 按钮文字（`button`, `.order-btn`, `.place-order-btn`）
- ✅ 价格文字（`.cart-price`, `.product-price`, `.item-price`）
- ✅ 订单信息（`.summary-label`, `.summary-value`）
- ✅ 返回按钮文字（`.back-text`）
- ✅ 副标题（`.order-subtitle`, `.page-subtitle`）

## 测试字体

配置完成后：

1. **重新编译小程序**
   - 保存 `app.js` 文件
   - 重新编译小程序

2. **查看控制台**
   - 应该看到"字体加载成功"的日志
   - 如果看到"字体加载失败"，检查URL是否正确

3. **检查页面**
   - 标题应该使用 IntroRust 字体（艺术风格）
   - 正文应该使用 Lexend 字体（清晰易读）

## 注意事项

1. **文件格式**
   - 推荐使用 `.woff` 或 `.woff2` 格式（文件更小）
   - `.ttf` 格式也可以使用

2. **服务器要求**
   - 必须支持 HTTPS
   - 必须支持 CORS
   - 建议使用 CDN 加速

3. **加载性能**
   - 字体文件会增加加载时间
   - 建议只加载需要的字重
   - 可以使用字体子集（只包含需要的字符）

4. **回退方案**
   - 如果字体加载失败，会自动使用系统字体
   - 系统字体已经过优化，效果也不错

## 快速配置示例

如果使用云存储，最小配置：

```javascript
globalData: {
  introRustFontUrl: 'cloud://your-env-id.xxx/fonts/introrust-base.woff',
  lexendFontUrl: 'cloud://your-env-id.xxx/fonts/lexend-regular.woff'
}
```

这样标题会使用 IntroRust，正文会使用 Lexend Regular。

