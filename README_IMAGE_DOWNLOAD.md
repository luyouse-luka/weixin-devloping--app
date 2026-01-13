# 图片下载说明

## 我无法直接下载图片到您的电脑

作为AI助手，我无法直接访问您的文件系统或下载文件。但我已经为您准备了完整的解决方案：

## 解决方案

### 方案1：使用Python脚本（推荐，如果已安装Python）

1. **安装依赖**
   ```bash
   pip install requests pillow
   ```

2. **运行脚本**
   ```bash
   python download_images.py
   ```

3. **注意**
   - 脚本会尝试从免费图片API下载
   - 如果没有API密钥，会使用占位图
   - 建议手动下载高质量图片

### 方案2：手动下载（最简单可靠）

1. **打开下载指南**
   - 查看 `download_images_manual.md`
   - 里面有所有菜品的搜索链接

2. **快速步骤**
   - 访问 Unsplash: https://unsplash.com
   - 搜索菜品名称（中文或英文）
   - 下载图片
   - 重命名并放入 `images` 目录

3. **推荐网站**
   - Unsplash: https://unsplash.com（免费高质量）
   - Pexels: https://www.pexels.com（免费商用）
   - Pixabay: https://pixabay.com（免费图片）

### 方案3：使用AI生成

1. **文心一格**（百度，免费）
   - 访问：https://yige.baidu.com
   - 输入菜品描述生成图片

2. **其他AI工具**
   - DALL-E, Midjourney, Stable Diffusion
   - 详细提示词见 `download_images_manual.md`

## 已创建的文件

1. **download_images.py** - Python自动下载脚本
2. **download_images_manual.md** - 详细的手动下载指南
3. **IMAGE_DOWNLOAD_GUIDE.md** - 完整的图片获取指南

## 快速开始（5分钟）

1. 打开浏览器
2. 访问：https://unsplash.com
3. 搜索："braised beef" 或 "chinese food"
4. 选择一张图片，下载
5. 重命名为 `tudou_dun_niunan.jpg`
6. 放入项目的 `images` 目录
7. 重复以上步骤，为其他菜品添加图片

## 临时方案

如果暂时没有图片：
- 代码已设置使用占位符图片
- 可以先测试功能
- 后续再替换为实际图片

## 需要帮助？

查看以下文件获取详细说明：
- `download_images_manual.md` - 手动下载详细步骤
- `IMAGE_DOWNLOAD_GUIDE.md` - 完整的图片获取指南

