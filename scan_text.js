const fs = require('fs');
const path = require('path');

/**
 * 扫描项目中所有使用的文字
 * 支持 .wxml, .js, .json, .wxss 文件
 */

const projectRoot = __dirname;
const outputFile = path.join(projectRoot, 'used_chars.txt');

// 需要扫描的文件扩展名
const extensions = ['.wxml', '.js', '.json', '.wxss', '.md'];

// 需要排除的目录
const excludeDirs = ['node_modules', '.git', 'miniprogram_npm', 'fonts'];

// 存储所有找到的字符
const charsSet = new Set();

/**
 * 递归扫描目录
 */
function scanDirectory(dir) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            // 跳过排除的目录
            if (!excludeDirs.includes(file)) {
                scanDirectory(fullPath);
            }
        } else if (stat.isFile()) {
            const ext = path.extname(file);
            if (extensions.includes(ext)) {
                scanFile(fullPath);
            }
        }
    });
}

/**
 * 扫描单个文件
 */
function scanFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        extractChars(content);
    } catch (err) {
        console.error(`Error reading file ${filePath}:`, err.message);
    }
}

/**
 * 从内容中提取字符
 */
function extractChars(content) {
    // 提取所有字符
    for (const char of content) {
        const code = char.charCodeAt(0);

        // 保留以下字符：
        // - 中文字符 (U+4E00 到 U+9FFF)
        // - 中文标点 (U+3000 到 U+303F)
        // - 全角字符 (U+FF00 到 U+FFEF)
        // - 数字 (0-9)
        // - 英文字母 (a-z, A-Z)
        // - 常用标点符号
        // - 空格

        if (
            (code >= 0x4E00 && code <= 0x9FFF) ||  // 中文
            (code >= 0x3000 && code <= 0x303F) ||  // 中文标点
            (code >= 0xFF00 && code <= 0xFFEF) ||  // 全角字符
            (code >= 0x0030 && code <= 0x0039) ||  // 数字 0-9
            (code >= 0x0041 && code <= 0x005A) ||  // 大写字母 A-Z
            (code >= 0x0061 && code <= 0x007A) ||  // 小写字母 a-z
            [' ', ',', '.', '!', '?', ':', ';', '-', '_', '/', '\\', '(', ')', '[', ']', '{', '}', '<', '>', '=', '+', '*', '&', '%', '$', '#', '@', '~', '`', '\'', '"', '|'].includes(char)
        ) {
            charsSet.add(char);
        }
    }
}

/**
 * 添加常用字符
 */
function addCommonChars() {
    // 添加常用标点符号
    const punctuation = '\uFF0C\u3002\uFF01\uFF1F\uFF1B\uFF1A\u201C\u201D\u2018\u2019\uFF08\uFF09\u3010\u3011\u300A\u300B\u3001\u00B7\u2026\u2014';
    for (const char of punctuation) {
        charsSet.add(char);
    }

    // 添加数字
    for (let i = 0; i <= 9; i++) {
        charsSet.add(i.toString());
    }

    // 添加英文字母
    for (let i = 65; i <= 90; i++) {
        charsSet.add(String.fromCharCode(i)); // A-Z
        charsSet.add(String.fromCharCode(i + 32)); // a-z
    }

    // 添加空格
    charsSet.add(' ');
}

/**
 * 保存结果
 */
function saveResults() {
    // 转换为数组并排序
    const chars = Array.from(charsSet).sort();

    // 生成统计信息
    const stats = {
        total: chars.length,
        chinese: chars.filter(c => {
            const code = c.charCodeAt(0);
            return code >= 0x4E00 && code <= 0x9FFF;
        }).length,
        punctuation: chars.filter(c => {
            const code = c.charCodeAt(0);
            return (code >= 0x3000 && code <= 0x303F) ||
                [',', '.', '!', '?', ':', ';', '，', '。', '！', '？', '；', '：'].includes(c);
        }).length,
        numbers: chars.filter(c => /[0-9]/.test(c)).length,
        letters: chars.filter(c => /[a-zA-Z]/.test(c)).length
    };

    // 创建输出内容
    let output = '# 项目中使用的所有字符\n\n';
    output += `## 统计信息\n`;
    output += `- 总字符数: ${stats.total}\n`;
    output += `- 中文字符: ${stats.chinese}\n`;
    output += `- 标点符号: ${stats.punctuation}\n`;
    output += `- 数字: ${stats.numbers}\n`;
    output += `- 字母: ${stats.letters}\n\n`;
    output += `## 字符列表\n\n`;
    output += chars.join('');

    // 保存到文件
    fs.writeFileSync(outputFile, output, 'utf8');

    // 同时保存纯文本版本（用于 pyftsubset）
    const plainTextFile = path.join(projectRoot, 'used_chars_plain.txt');
    fs.writeFileSync(plainTextFile, chars.join(''), 'utf8');

    console.log('\n✓ 扫描完成！');
    console.log(`\n统计信息：`);
    console.log(`  总字符数: ${stats.total}`);
    console.log(`  中文字符: ${stats.chinese}`);
    console.log(`  标点符号: ${stats.punctuation}`);
    console.log(`  数字: ${stats.numbers}`);
    console.log(`  字母: ${stats.letters}`);
    console.log(`\n结果已保存到：`);
    console.log(`  - ${outputFile}`);
    console.log(`  - ${plainTextFile}`);
    console.log(`\n下一步：运行 'node subset_fonts.js' 生成字体子集`);
}

// 主函数
function main() {
    console.log('开始扫描项目文件...\n');

    // 扫描项目目录
    scanDirectory(projectRoot);

    // 添加常用字符
    addCommonChars();

    // 保存结果
    saveResults();
}

main();
