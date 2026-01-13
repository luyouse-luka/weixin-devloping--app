# 手动下载图片指南

由于自动下载可能受到API限制，这里提供手动下载的详细步骤和直接链接。

## 快速下载链接

### 方法1：使用免费图片网站（推荐）

#### Unsplash（免费高质量图片）
访问以下链接搜索并下载：

1. **土豆炖牛腩**: https://unsplash.com/s/photos/braised-beef-potato
2. **红烧大虾**: https://unsplash.com/s/photos/braised-prawns
3. **五花肉烧鹌鹑蛋**: https://unsplash.com/s/photos/braised-pork-belly
4. **干锅花菜**: https://unsplash.com/s/photos/dry-pot-cauliflower
5. **海带烧肉**: https://unsplash.com/s/photos/braised-pork-kelp
6. **萝卜烧肉**: https://unsplash.com/s/photos/braised-pork-radish
7. **西红柿炒鸡蛋**: https://unsplash.com/s/photos/tomato-eggs
8. **土豆丝**: https://unsplash.com/s/photos/shredded-potatoes
9. **芹菜香干**: https://unsplash.com/s/photos/celery-tofu
10. **泡面**: https://unsplash.com/s/photos/instant-noodles
11. **紫菜鸡蛋汤**: https://unsplash.com/s/photos/seaweed-egg-soup

#### Pexels（免费商用图片）
访问：https://www.pexels.com/zh-cn/
搜索对应的中文或英文关键词

#### Pixabay（免费图片）
访问：https://pixabay.com/zh/
搜索对应的中文或英文关键词

### 方法2：使用搜索引擎

#### 百度图片
访问：https://image.baidu.com
搜索关键词（例如："土豆炖牛腩"）

#### Google图片
访问：https://www.google.com/imghp
搜索关键词（例如："braised beef potato"）

#### 必应图片
访问：https://www.bing.com/images
搜索关键词

## 下载步骤

1. **打开链接或搜索**
   - 点击上面的链接，或使用搜索引擎搜索

2. **选择图片**
   - 选择高质量、清晰的图片
   - 确保图片看起来诱人
   - 背景简洁（白色或浅色最佳）

3. **下载图片**
   - 右键点击图片
   - 选择"另存为"或"保存图片"
   - 保存到项目的 `images` 目录

4. **重命名文件**
   - 按照以下文件名重命名：
     - `tudou_dun_niunan.jpg` - 土豆炖牛腩
     - `hongshao_daxia.jpg` - 红烧大虾
     - `wuhuarou_anchundan.jpg` - 五花肉烧鹌鹑蛋
     - `ganguo_huacai.jpg` - 干锅花菜
     - `haidai_shaorou.jpg` - 海带烧肉
     - `luobo_shaorou.jpg` - 萝卜烧肉
     - `xihongshi_chaodan.jpg` - 西红柿炒鸡蛋
     - `tudousi.jpg` - 土豆丝
     - `qincai_xianggan.jpg` - 芹菜香干
     - `paomian.jpg` - 泡面
     - `zicai_jidan_tang.jpg` - 紫菜鸡蛋汤

5. **优化图片**（可选）
   - 使用 https://tinypng.com 压缩图片
   - 确保文件大小在 100-300KB 之间

## 使用Python脚本自动下载

如果安装了Python，可以运行 `download_images.py`：

```bash
# 安装依赖
pip install requests pillow

# 运行脚本
python download_images.py
```

**注意**: 脚本需要API密钥才能从Unsplash/Pexels下载。如果没有API密钥，脚本会使用占位图。

## AI生成图片

### 使用AI工具生成

1. **文心一格**（百度，免费）
   - 访问：https://yige.baidu.com
   - 输入提示词（见下方）

2. **通义万相**（阿里云）
   - 访问阿里云控制台
   - 使用AI图片生成服务

3. **DALL-E**（OpenAI，付费）
   - 访问：https://openai.com/dall-e-2

4. **Midjourney**（付费）
   - 访问：https://www.midjourney.com

### AI生成提示词

```
土豆炖牛腩: "一盘美味的土豆炖牛腩，中式菜品，食物摄影，高质量，诱人，白色盘子，专业灯光，高清"

红烧大虾: "红烧大虾，中式菜品，食物摄影，鲜艳色彩，诱人，餐厅品质，专业食物造型"

五花肉烧鹌鹑蛋: "五花肉烧鹌鹑蛋，中式菜品，食物摄影，肥而不腻，入口即化，专业拍摄"

干锅花菜: "干锅花菜，中式菜品，食物摄影，干香爽脆，下酒好菜，高清"

海带烧肉: "海带烧肉，中式菜品，食物摄影，鲜香软糯，营养丰富，专业拍摄"

萝卜烧肉: "萝卜烧肉，中式菜品，食物摄影，清甜爽口，解腻下饭，高清"

西红柿炒鸡蛋: "西红柿炒鸡蛋，中式家常菜，食物摄影，经典美味，酸甜开胃，专业拍摄"

土豆丝: "土豆丝，中式菜品，食物摄影，爽脆可口，下饭神器，高清"

芹菜香干: "芹菜香干，中式菜品，食物摄影，清香爽脆，健康美味，专业拍摄"

泡面: "泡面，方便面，食物摄影，快速便捷，经典美味，高清"

紫菜鸡蛋汤: "紫菜鸡蛋汤，中式汤品，食物摄影，清淡鲜美，营养暖胃，专业拍摄"
```

## 图片要求检查清单

- [ ] 图片清晰，分辨率足够（至少800px宽）
- [ ] 色彩鲜艳，食物看起来诱人
- [ ] 背景简洁（白色或浅色）
- [ ] 文件大小合适（100-300KB）
- [ ] 格式正确（JPG或WebP）
- [ ] 文件名正确（英文和下划线）
- [ ] 已放入 `images` 目录
- [ ] 已测试在小程序中显示

## 快速开始

1. 选择一个菜品（例如：土豆炖牛腩）
2. 打开 https://unsplash.com/s/photos/braised-beef-potato
3. 选择一张喜欢的图片
4. 下载并重命名为 `tudou_dun_niunan.jpg`
5. 放入 `images` 目录
6. 重复以上步骤，为所有菜品添加图片

## 需要帮助？

如果遇到问题：
1. 检查图片文件名是否正确
2. 确认图片已放入 `images` 目录
3. 检查图片格式（JPG或WebP）
4. 查看小程序控制台是否有错误

