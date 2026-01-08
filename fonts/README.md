# 字体文件目录

## 使用说明

如果需要使用自定义字体，请将字体文件（.ttf 或 .woff 格式）放在此目录下。

## 推荐字体下载

### 1. 站酷快乐体（可爱风格）
- 下载地址：https://www.zcool.com.cn/special/zcoolfonts/
- 特点：可爱活泼，适合家庭点餐场景
- 授权：免费可商用

### 2. 站酷文艺体（艺术风格）
- 下载地址：https://www.zcool.com.cn/special/zcoolfonts/
- 特点：文艺优雅，艺术感强
- 授权：免费可商用

### 3. 思源柔黑体（柔和风格）
- 下载地址：https://fonts.google.com/noto/specimen/Noto+Sans+SC
- 特点：柔和圆润，易读性强
- 授权：开源免费

## 字体文件命名

建议使用以下命名：
- `cute-font.ttf` - 可爱风格字体
- `art-font.ttf` - 艺术风格字体
- `soft-font.ttf` - 柔和风格字体

## 配置步骤

1. 下载字体文件（.ttf 格式）
2. 将文件放入此 `fonts` 目录
3. 在 `app.wxss` 中取消注释 `@font-face` 声明
4. 修改字体文件路径为实际文件名
5. 在 `font-family` 中添加字体名称

## 注意事项

- 字体文件大小建议 < 2MB
- 确保字体可以商用
- 测试不同设备的显示效果


