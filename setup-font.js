/**
 * 字体配置辅助脚本
 * 用于检查和配置字体文件
 */

// 检查字体文件是否存在
function checkFontFile() {
  const fs = require('fs');
  const path = require('path');
  
  const fontPath = path.join(__dirname, 'fonts', 'cute-font.ttf');
  
  if (fs.existsSync(fontPath)) {
    const stats = fs.statSync(fontPath);
    const fileSize = (stats.size / 1024 / 1024).toFixed(2); // MB
    
    console.log('✅ 字体文件已找到！');
    console.log('📁 文件路径:', fontPath);
    console.log('📦 文件大小:', fileSize, 'MB');
    
    if (stats.size > 2 * 1024 * 1024) {
      console.warn('⚠️  警告：字体文件较大，可能影响加载速度');
    }
    
    return true;
  } else {
    console.log('❌ 字体文件未找到');
    console.log('📝 请按照以下步骤操作：');
    console.log('   1. 访问：https://www.zcool.com.cn/special/zcoolfonts/');
    console.log('   2. 下载"站酷快乐体"字体');
    console.log('   3. 将 .ttf 文件放入 fonts 文件夹');
    console.log('   4. 重命名为 cute-font.ttf');
    return false;
  }
}

// 如果是在Node.js环境中运行
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { checkFontFile };
}


