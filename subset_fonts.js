const fs = require('fs');
const path = require('path');
const Fontmin = require('fontmin');

/**
 * 字体子集化脚本
 * 根据 used_chars.txt 生成字体子集
 */

const projectRoot = __dirname;
const fontsDir = path.join(projectRoot, 'fonts');
const outputDir = path.join(fontsDir, 'subset');
const charsFile = path.join(projectRoot, 'used_chars_plain.txt');

// 确保输出目录存在
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

/**
 * 读取需要保留的字符
 */
function readChars() {
    if (!fs.existsSync(charsFile)) {
        console.error('❌ 错误：找不到 used_chars_plain.txt 文件');
        console.log('请先运行: node scan_text.js');
        process.exit(1);
    }

    const chars = fs.readFileSync(charsFile, 'utf8');
    console.log(`✓ 读取到 ${chars.length} 个字符`);
    return chars;
}

/**
 * 查找字体文件
 */
function findFontFiles() {
    if (!fs.existsSync(fontsDir)) {
        console.error('❌ 错误：fonts 目录不存在');
        return [];
    }

    const files = fs.readdirSync(fontsDir);
    const fontFiles = files.filter(f =>
        ['.ttf', '.otf', '.woff', '.woff2'].includes(path.extname(f).toLowerCase())
    );

    return fontFiles.map(f => path.join(fontsDir, f));
}

/**
 * 子集化单个字体文件
 */
function subsetFont(fontPath, chars) {
    return new Promise((resolve, reject) => {
        const fontName = path.basename(fontPath);
        const ext = path.extname(fontPath);
        const baseName = path.basename(fontPath, ext);

        console.log(`\n处理: ${fontName}`);

        const fontmin = new Fontmin()
            .src(fontPath)
            .use(Fontmin.glyph({
                text: chars,
                hinting: false // 移除 hinting 以减小文件大小
            }))
            .use(Fontmin.ttf2woff2()) // 转换为 woff2（最佳压缩）
            .dest(outputDir);

        fontmin.run((err, files) => {
            if (err) {
                console.error(`  ❌ 失败: ${err.message}`);
                reject(err);
            } else {
                // 获取原始文件大小
                const originalSize = fs.statSync(fontPath).size;

                // 获取生成的文件
                const outputFiles = files.filter(f => f.path);

                if (outputFiles.length > 0) {
                    outputFiles.forEach(file => {
                        const newSize = file.contents.length;
                        const saved = ((1 - newSize / originalSize) * 100).toFixed(1);
                        const outputName = path.basename(file.path);

                        console.log(`  ✓ 生成: ${outputName}`);
                        console.log(`    原始: ${(originalSize / 1024).toFixed(2)} KB`);
                        console.log(`    子集: ${(newSize / 1024).toFixed(2)} KB`);
                        console.log(`    节省: ${saved}%`);
                    });
                }

                resolve();
            }
        });
    });
}

/**
 * 主函数
 */
async function main() {
    console.log('=== 字体子集化工具 ===\n');

    // 读取字符集
    const chars = readChars();

    // 查找字体文件
    const fontFiles = findFontFiles();

    if (fontFiles.length === 0) {
        console.log('\n❌ 未找到字体文件');
        console.log('请将字体文件（.ttf, .otf, .woff, .woff2）放入 fonts 目录');
        return;
    }

    console.log(`\n找到 ${fontFiles.length} 个字体文件：`);
    fontFiles.forEach(f => console.log(`  - ${path.basename(f)}`));

    // 处理每个字体文件
    console.log('\n开始处理...');

    for (const fontFile of fontFiles) {
        try {
            await subsetFont(fontFile, chars);
        } catch (err) {
            console.error(`处理 ${path.basename(fontFile)} 时出错:`, err.message);
        }
    }

    console.log('\n=== 完成！===');
    console.log(`\n子集字体已保存到: ${outputDir}`);
    console.log('\n下一步：');
    console.log('1. 将生成的 .woff2 文件上传到云存储');
    console.log('2. 在 app.wxss 中更新字体路径');
    console.log('3. 测试字体显示效果');
}

main().catch(err => {
    console.error('发生错误:', err);
    process.exit(1);
});
