# 快速字体配置指南

## 🎨 推荐字体：站酷快乐体

最适合家庭点餐小程序的可爱风格字体，完全免费可商用。

## 📥 下载步骤（3分钟完成）

### 步骤1：下载字体文件

**方法一：站酷官网（推荐）**
1. 打开浏览器，访问：**https://www.zcool.com.cn/special/zcoolfonts/**
2. 在页面中找到 **"站酷快乐体"**
3. 点击 **"免费下载"** 按钮
4. 下载完成后解压zip文件
5. 找到 `.ttf` 格式的字体文件（文件名类似：`站酷快乐体.ttf`）

**方法二：备用下载**
- 字客网：https://www.fontke.com/font/10248718/
- 搜索"站酷快乐体"下载

### 步骤2：放置字体文件

1. 将下载的 `.ttf` 文件复制到项目的 `fonts` 文件夹
2. 重命名为：`cute-font.ttf`

**文件路径应该是：**
```
weixin-devloping--app/
└── fonts/
    └── cute-font.ttf  ← 字体文件放这里
```

### 步骤3：启用字体

打开 `app.wxss` 文件，找到以下代码（大约第10-18行）：

**找到这段代码：**
```css
/*
@font-face {
  font-family: 'CuteFont';
  src: url('/fonts/cute-font.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}
*/
```

**修改为（删除 `/*` 和 `*/`）：**
```css
@font-face {
  font-family: 'CuteFont';
  src: url('/fonts/cute-font.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}
```

**然后在第25行左右，找到：**
```css
font-family: 
  /* 'CuteFont', */        /* 自定义字体（取消注释后启用） */
  'PingFang SC',
  ...
```

**修改为（删除注释符号）：**
```css
font-family: 
  'CuteFont',              /* 自定义字体 */
  'PingFang SC',
  ...
```

### 步骤4：测试

1. 保存文件
2. 重新编译小程序
3. 查看字体效果

## ⚠️ 重要提示

### 小程序字体限制

**微信小程序不支持直接使用本地字体文件！**

需要使用以下方式之一：

#### 方式一：使用网络字体（推荐）

1. **将字体文件上传到服务器**
   - 上传到支持HTTPS的服务器
   - 确保服务器支持CORS（跨域）

2. **使用 wx.loadFontFace 动态加载**

在 `app.js` 的 `onLaunch` 中：

```javascript
wx.loadFontFace({
  family: 'CuteFont',
  source: 'url("https://your-server.com/fonts/cute-font.ttf")',
  success: (res) => {
    console.log('字体加载成功');
  },
  fail: (err) => {
    console.error('字体加载失败', err);
  }
});
```

#### 方式二：使用系统字体（当前方案）

当前已配置柔和风格的系统字体组合，无需下载，直接使用。

**优点：**
- ✅ 无需下载文件
- ✅ 加载速度快
- ✅ 兼容性好
- ✅ 已优化为柔和风格

**当前使用的字体：**
- PingFang SC（苹方）- 柔和圆润
- Hiragino Sans GB（冬青黑体）- 优雅
- Microsoft YaHei（微软雅黑）- 清晰柔和

## 🎯 推荐方案

**建议使用当前配置的系统字体组合**，因为：
1. 已经足够柔和美观
2. 无需额外配置
3. 性能更好
4. 兼容性更强

如果确实需要更个性化的字体，建议：
1. 将字体文件上传到CDN或服务器
2. 使用 `wx.loadFontFace` 动态加载
3. 确保服务器支持HTTPS和CORS

## 📝 当前状态

✅ 已配置柔和风格的系统字体
✅ 已优化字间距和行高
✅ 已创建字体文件夹结构
✅ 已预留自定义字体配置代码

**当前字体效果已经比较柔和，建议先测试效果，如果满意则无需下载自定义字体。**


