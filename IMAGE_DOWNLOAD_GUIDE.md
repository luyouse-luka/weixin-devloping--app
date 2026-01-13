# 菜品图片下载指南

## 需要添加的图片

以下菜品需要添加对应的图片文件到 `images` 目录：

### 拿手好戏 (categoryId: 1)
1. **土豆炖牛腩** - `/images/tudou_dun_niunan.jpg`
2. **红烧大虾** - `/images/hongshao_daxia.jpg`
3. **五花肉烧鹌鹑蛋** - `/images/wuhuarou_anchundan.jpg`

### 第九大菜系/特色小炒 (categoryId: 4)
4. **干锅花菜** - `/images/ganguo_huacai.jpg`
5. **海带烧肉** - `/images/haidai_shaorou.jpg`
6. **萝卜烧肉** - `/images/luobo_shaorou.jpg`
7. **西红柿炒鸡蛋** - `/images/xihongshi_chaodan.jpg`
8. **土豆丝** - `/images/tudousi.jpg`
9. **芹菜香干** - `/images/qincai_xianggan.jpg`

### 主食 (categoryId: 5)
10. **泡面** - `/images/paomian.jpg`
11. **紫菜鸡蛋汤** - `/images/zicai_jidan_tang.jpg`

## 图片获取方式

### 方式1：从网上下载（推荐）

#### 使用搜索引擎
1. 访问：https://www.google.com 或 https://www.bing.com
2. 搜索关键词（例如："土豆炖牛腩 图片"）
3. 选择高质量、清晰的图片
4. 注意版权，建议使用免费商用图片

#### 推荐图片网站
- **Unsplash**: https://unsplash.com (免费高质量图片)
- **Pexels**: https://www.pexels.com (免费商用图片)
- **Pixabay**: https://pixabay.com (免费图片)
- **百度图片**: https://image.baidu.com
- **必应图片**: https://www.bing.com/images

#### 搜索关键词（中英文）
- 土豆炖牛腩 / Braised Beef with Potatoes
- 红烧大虾 / Red Braised Prawns
- 五花肉烧鹌鹑蛋 / Braised Pork Belly with Quail Eggs
- 干锅花菜 / Dry Pot Cauliflower
- 海带烧肉 / Braised Pork with Kelp
- 萝卜烧肉 / Braised Pork with Radish
- 西红柿炒鸡蛋 / Scrambled Eggs with Tomatoes
- 土豆丝 / Shredded Potatoes
- 芹菜香干 / Celery with Dried Tofu
- 泡面 / Instant Noodles
- 紫菜鸡蛋汤 / Seaweed Egg Soup

### 方式2：AI生成图片

#### 使用AI工具生成
1. **Midjourney**: https://www.midjourney.com
2. **DALL-E**: https://openai.com/dall-e-2
3. **Stable Diffusion**: 本地或在线版本
4. **文心一格**: https://yige.baidu.com
5. **通义万相**: 阿里云AI图片生成

#### AI生成提示词示例
```
土豆炖牛腩: "Delicious braised beef brisket with potatoes, Chinese cuisine, food photography, high quality, appetizing, on white plate, professional lighting"

红烧大虾: "Red braised prawns, Chinese dish, food photography, vibrant colors, appetizing, restaurant quality, professional food styling"
```

### 方式3：自己拍摄

如果有条件，可以自己拍摄菜品照片：
- 使用手机或相机
- 确保光线充足
- 背景简洁
- 图片清晰

## 图片要求

### 尺寸建议
- **宽度**: 800-1200px
- **高度**: 600-900px
- **比例**: 4:3 或 16:9
- **格式**: JPG 或 WebP（推荐 WebP，文件更小）

### 质量要求
- 清晰度高
- 色彩鲜艳
- 食物看起来诱人
- 背景简洁（白色或浅色背景最佳）

### 文件大小
- 建议：100-300KB
- 最大：不超过 500KB（小程序加载速度考虑）

## 图片优化

### 使用工具压缩
1. **TinyPNG**: https://tinypng.com
2. **Squoosh**: https://squoosh.app
3. **ImageOptim**: Mac 工具
4. **在线压缩工具**: 搜索"图片压缩"

### 转换为 WebP 格式
WebP 格式文件更小，加载更快：
```bash
# 使用在线工具转换
# 或使用命令行工具 cwebp
cwebp input.jpg -q 80 -o output.webp
```

## 添加图片步骤

1. **下载或生成图片**
2. **重命名文件**（使用上面列出的文件名）
3. **压缩优化**（确保文件大小合适）
4. **放入 `images` 目录**
5. **测试显示**（在小程序中查看效果）

## 临时方案

如果暂时没有图片，代码已设置：
- 使用 `/images/placeholder.webp` 作为占位符
- 图片加载失败时会自动使用默认图片

可以先添加菜品，后续再替换图片。

## 批量下载工具

### 使用 Python 脚本（可选）
```python
import requests
from PIL import Image
import io

# 示例：下载图片并压缩
def download_and_optimize(url, filename):
    response = requests.get(url)
    img = Image.open(io.BytesIO(response.content))
    img.thumbnail((800, 600))
    img.save(f'images/{filename}', 'JPEG', quality=85)
```

### 使用浏览器扩展
- **图片助手**: Chrome 扩展，可以批量下载图片
- **Fatkun**: 批量图片下载工具

## 注意事项

1. **版权问题**: 确保使用的图片有商用授权
2. **图片质量**: 选择高质量图片，避免模糊
3. **文件命名**: 使用英文和下划线，避免中文文件名
4. **文件大小**: 控制文件大小，确保小程序加载速度
5. **格式统一**: 建议统一使用 JPG 或 WebP 格式

## 快速开始

1. 选择一个菜品（例如：土豆炖牛腩）
2. 在搜索引擎中搜索图片
3. 下载高质量图片
4. 重命名为 `tudou_dun_niunan.jpg`
5. 压缩优化
6. 放入 `images` 目录
7. 在小程序中测试显示

重复以上步骤，为所有菜品添加图片。

