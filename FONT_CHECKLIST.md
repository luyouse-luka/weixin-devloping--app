# 字体应用检查清单

## ✅ 已配置的字体应用

### IntroRust（标题字体）- 已应用
- ✅ `.title` - 所有页面标题
- ✅ `.order-title` - 订单页面标题
- ✅ `.page-title` - 页面标题
- ✅ `.section-title` - 区块标题
- ✅ `.product-name` - 商品名称
- ✅ `.item-name` - 商品项名称
- ✅ `.chef-name` - 厨师名称
- ✅ `.couplet-line` - 对联文字
- ✅ `.category-title` - 分类标题
- ✅ `.top-bar` - 首页顶部标题
- ✅ `.success-title` - 成功页面标题
- ✅ `.order-id` - 订单ID（可选，如果需要突出显示）

### Lexend（正文字体）- 已应用
- ✅ `page` - 页面默认字体（全局）
- ✅ `.category-item` - 分类菜单项
- ✅ `.product-intro` - 商品介绍
- ✅ `.description` - 描述文字
- ✅ `.intro` - 介绍文字
- ✅ `.chef-description` - 厨师描述
- ✅ `.order-subtitle` - 订单副标题
- ✅ `.page-subtitle` - 页面副标题
- ✅ `.back-text` - 返回按钮文字
- ✅ `.cart-price` - 购物车价格
- ✅ `.product-price` - 商品价格
- ✅ `.item-price` - 商品项价格
- ✅ `.summary-label` - 汇总标签
- ✅ `.summary-value` - 汇总值
- ✅ `button` - 所有按钮文字
- ✅ `.order-btn` - 订单按钮
- ✅ `.place-order-btn` - 下单按钮
- ✅ `.confirm-btn` - 确认按钮
- ✅ `.add-to-cart` - 加入购物车按钮
- ✅ `.item-spec` - 商品规格
- ✅ `.item-quantity` - 商品数量
- ✅ `.order-time` - 订单时间
- ✅ `.order-total` - 订单总计
- ✅ `.total-price` - 总价
- ✅ `.status-label` - 状态标签
- ✅ `.status-value` - 状态值
- ✅ `.tip-item` - 提示项
- ✅ `.subtitle` - 副标题
- ✅ `.empty-cart` - 空购物车提示
- ✅ `.empty-ordered` - 空订单提示
- ✅ `.empty-message` - 空消息提示
- ✅ `.empty-state` - 空状态提示

## 📝 配置步骤

1. **上传字体到云存储或服务器**
   - IntroRust-Base.woff
   - Lexend-Regular.woff
   - Lexend-Medium.woff（可选）
   - Lexend-SemiBold.woff（可选）
   - Lexend-Bold.woff（可选）

2. **在 app.js 中配置字体URL**
   ```javascript
   globalData: {
     introRustFontUrl: 'cloud://your-env-id.xxx/fonts/introrust-base.woff',
     lexendFontUrl: 'cloud://your-env-id.xxx/fonts/lexend-regular.woff'
   }
   ```

3. **重新编译小程序**
   - 保存文件
   - 重新编译
   - 查看控制台确认字体加载成功

## 🔍 验证方法

1. **查看控制台**
   - 应该看到"IntroRust字体加载成功"
   - 应该看到"Lexend字体加载成功"

2. **检查页面**
   - 标题应该使用 IntroRust（艺术风格）
   - 正文应该使用 Lexend（清晰易读）

3. **如果字体未生效**
   - 检查字体URL是否正确
   - 检查服务器是否支持CORS
   - 查看控制台错误信息
   - 确认字体文件格式正确（.woff 或 .woff2）

## 📌 注意事项

- 字体文件必须支持 HTTPS
- 服务器必须支持 CORS
- 如果字体加载失败，会自动使用系统字体（已优化）
- 建议使用 .woff 或 .woff2 格式（文件更小）

