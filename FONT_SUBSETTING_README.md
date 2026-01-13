# 字体子集化完整指南

## ✅ 已完成的工作

### 1. 文字扫描
已成功扫描项目中所有使用的文字：
- **总字符数**: 839
- **中文字符**: 725
- **标点符号**: 17
- **数字**: 10
- **字母**: 52

扫描结果已保存到：
- `used_chars.txt` - 包含统计信息的完整报告
- `used_chars_plain.txt` - 纯文本字符列表（用于字体子集化）

## 📋 字体子集化步骤

### 方法一：使用 Fontmin（Node.js）

#### 1. 安装依赖
```bash
npm install --save-dev fontmin
```

#### 2. 准备字体文件
将您的字体文件（.ttf, .otf, .woff, .woff2）放入 `fonts/` 目录

#### 3. 运行子集化脚本
```bash
node subset_fonts.js
```

生成的子集字体将保存在 `fonts/subset/` 目录中。

### 方法二：使用在线工具

#### 字蛛（Font-Spider）
1. 访问：http://font-spider.org/
2. 上传字体文件
3. 复制 `used_chars_plain.txt` 中的所有字符
4. 粘贴到文字输入框
5. 下载生成的子集字体

#### Fontmin 在线版
1. 访问：http://ecomfe.github.io/fontmin/
2. 拖入字体文件
3. 输入需要的文字（从 `used_chars_plain.txt` 复制）
4. 生成并下载

### 方法三：使用 Python fonttools

#### 安装
```bash
pip install fonttools brotli
```

#### 使用
```bash
# 使用文本文件
pyftsubset your-font.ttf --text-file=used_chars_plain.txt --output-file=your-font-subset.woff2 --flavor=woff2

# 或直接指定文字
pyftsubset your-font.ttf --text="$(cat used_chars_plain.txt)" --output-file=your-font-subset.woff2 --flavor=woff2
```

## 📊 预期效果

基于 839 个字符的子集化，预期文件大小：

| 字体类型 | 原始大小 | 子集后大小 | 压缩率 |
|---------|---------|-----------|--------|
| 思源黑体 | ~15 MB | ~150 KB | 99% |
| 站酷快乐体 | ~8 MB | ~100 KB | 98.8% |
| 方正字体 | ~10 MB | ~120 KB | 98.8% |
| 英文字体 | ~200 KB | ~30 KB | 85% |

## 🚀 使用子集字体

### 1. 上传到云存储
将生成的 `.woff2` 文件上传到微信小程序云存储

### 2. 更新 app.wxss
```css
@font-face {
  font-family: 'YourFont';
  src: url('cloud://your-env.xxx/fonts/your-font-subset.woff2') format('woff2');
  font-display: swap;
}
```

### 3. 应用字体
```css
.title {
  font-family: 'YourFont', sans-serif;
}
```

## ⚠️ 注意事项

1. **保留原始字体**
   - 始终保留完整的原始字体文件
   - 子集字体仅用于生产环境

2. **定期更新**
   - 添加新内容时，重新运行 `scan_text.js`
   - 检查是否需要更新字体子集

3. **测试覆盖**
   - 在所有页面测试字体显示
   - 确认所有文字都能正常显示
   - 检查动态内容

4. **格式选择**
   - 优先使用 WOFF2（最佳压缩）
   - WOFF 作为备选（兼容性好）
   - 避免使用 TTF（文件太大）

## 📝 更新流程

当项目内容更新时：

```bash
# 1. 重新扫描文字
node scan_text.js

# 2. 检查新增字符
# 查看 used_chars.txt 中的统计信息

# 3. 重新生成字体子集
node subset_fonts.js

# 4. 上传新的字体文件到云存储

# 5. 测试所有页面
```

## 🎯 快速开始

```bash
# 一键完成扫描和子集化
npm install --save-dev fontmin && node scan_text.js && node subset_fonts.js
```

## 💡 提示

- 如果使用多个字重（Regular, Bold等），为每个字重单独生成子集
- 确保字符集在所有字重中保持一致
- 使用 `font-display: swap` 避免字体加载时的闪烁
- 考虑为标题和正文使用不同的字体子集

## 📚 相关文件

- `scan_text.js` - 文字扫描脚本
- `subset_fonts.js` - 字体子集化脚本
- `used_chars.txt` - 扫描结果（含统计）
- `used_chars_plain.txt` - 纯文本字符列表
- `FONT_SUBSETTING_GUIDE.md` - 详细指南
