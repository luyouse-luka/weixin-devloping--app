# IntroRust 和 Lexend 字体配置指南

## 字体介绍

### IntroRust（标题字体）
- **风格**：艺术、手写风格、优雅
- **用途**：标题、对联、重要文字
- **特点**：具有独特的艺术感，适合作为标题字体

### Lexend（正文字体）
- **风格**：现代、清晰、易读
- **用途**：正文、按钮、说明文字
- **特点**：专为提高阅读体验设计，清晰易读

## 下载地址

### IntroRust 字体
1. **Google Fonts**（如果可用）
   - 搜索 "Intro Rust" 或访问字体网站

2. **字体网站**
   - Font Squirrel: https://www.fontsquirrel.com/
   - 搜索 "Intro Rust" 下载

3. **直接下载链接**
   - 可能需要搜索具体的下载源

### Lexend 字体
1. **Google Fonts**（推荐）
   - 网址：https://fonts.google.com/specimen/Lexend
   - 点击 "Download family" 下载
   - 完全免费，可商用

2. **GitHub**
   - 搜索 "Lexend font github"
   - 通常有开源版本

## 配置步骤

### 方式一：使用网络字体（推荐）

1. **上传字体文件到服务器**
   - 将下载的字体文件（.ttf 或 .woff 格式）上传到支持HTTPS的服务器
   - 确保服务器支持CORS（跨域资源共享）

2. **配置字体URL**
   
   在 `app.js` 中配置：
   ```javascript
   globalData: {
     introRustFontUrl: 'https://your-server.com/fonts/introrust.ttf',
     lexendFontUrl: 'https://your-server.com/fonts/lexend.ttf'
   }
   ```

3. **字体会自动加载**
   - 小程序启动时会自动调用 `loadCustomFonts()` 加载字体

### 方式二：使用云存储（如果有云开发）

1. **上传字体到云存储**
   - 在微信开发者工具中打开"云开发"
   - 进入"存储"
   - 上传字体文件到云存储

2. **获取文件ID**
   - 复制云存储中的文件ID

3. **配置字体URL**
   ```javascript
   globalData: {
     introRustFontUrl: 'cloud://your-env-id.xxx/fonts/introrust.ttf',
     lexendFontUrl: 'cloud://your-env-id.xxx/fonts/lexend.ttf'
   }
   ```

### 方式三：使用本地文件（需要base64）

如果字体文件较小，可以转换为base64：

1. **转换字体为base64**
   - 使用在线工具：https://transfonter.org/
   - 上传字体文件，选择base64输出

2. **在代码中使用**
   ```javascript
   wx.loadFontFace({
     family: 'IntroRust',
     source: 'data:font/truetype;charset=utf-8;base64,字体base64编码...',
     success: (res) => {
       console.log('字体加载成功');
     }
   });
   ```

## 当前配置状态

✅ **字体样式已配置**
- 标题使用 IntroRust
- 正文使用 Lexend
- 按钮使用 Lexend

⏳ **需要配置字体URL**
- 在 `app.js` 中配置 `introRustFontUrl` 和 `lexendFontUrl`
- 或者使用云存储

## 快速开始

### 如果没有服务器

1. **使用系统字体（当前方案）**
   - 代码已配置字体回退方案
   - 会使用系统字体显示
   - 效果已经比较柔和

2. **使用云开发云存储**
   - 开通云开发
   - 上传字体文件
   - 配置云存储URL

### 如果有服务器

1. 下载字体文件
2. 上传到服务器
3. 在 `app.js` 中配置URL
4. 重新编译小程序

## 字体文件格式

- **推荐格式**：`.ttf` 或 `.woff`
- **文件大小**：建议 < 2MB
- **文件数量**：2个文件（IntroRust + Lexend）

## 注意事项

1. **服务器要求**
   - 必须支持HTTPS
   - 必须支持CORS
   - 建议使用CDN加速

2. **加载性能**
   - 字体文件会增加加载时间
   - 建议使用字体子集（只包含需要的字符）
   - 考虑使用字体预加载

3. **兼容性**
   - 如果字体加载失败，会自动使用系统字体
   - 确保有字体回退方案

## 测试字体

配置完成后，检查：

1. **查看控制台**
   - 应该看到"字体加载成功"的日志

2. **检查页面**
   - 标题应该使用 IntroRust 字体
   - 正文应该使用 Lexend 字体

3. **如果字体未生效**
   - 检查字体URL是否正确
   - 检查服务器是否支持CORS
   - 查看控制台错误信息

