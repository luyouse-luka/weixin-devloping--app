#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
菜品图片批量下载脚本
使用免费图片API和搜索引擎下载菜品图片
"""

import os
import requests
from PIL import Image
import io
import time
import json

# 菜品图片配置
PRODUCTS = [
    {
        'name': '土豆炖牛腩',
        'filename': 'tudou_dun_niunan.jpg',
        'keywords': ['braised beef', 'potato beef', 'chinese food', '土豆炖牛腩']
    },
    {
        'name': '红烧大虾',
        'filename': 'hongshao_daxia.jpg',
        'keywords': ['red braised prawns', 'chinese prawns', '红烧大虾', '大虾']
    },
    {
        'name': '五花肉烧鹌鹑蛋',
        'filename': 'wuhuarou_anchundan.jpg',
        'keywords': ['braised pork belly', 'quail eggs', '五花肉', '鹌鹑蛋']
    },
    {
        'name': '干锅花菜',
        'filename': 'ganguo_huacai.jpg',
        'keywords': ['dry pot cauliflower', 'chinese cauliflower', '干锅花菜', '花菜']
    },
    {
        'name': '海带烧肉',
        'filename': 'haidai_shaorou.jpg',
        'keywords': ['braised pork kelp', 'kelp pork', '海带烧肉', '海带']
    },
    {
        'name': '萝卜烧肉',
        'filename': 'luobo_shaorou.jpg',
        'keywords': ['braised pork radish', 'radish pork', '萝卜烧肉', '萝卜']
    },
    {
        'name': '西红柿炒鸡蛋',
        'filename': 'xihongshi_chaodan.jpg',
        'keywords': ['tomato eggs', 'scrambled eggs tomato', '西红柿炒鸡蛋', '番茄炒蛋']
    },
    {
        'name': '土豆丝',
        'filename': 'tudousi.jpg',
        'keywords': ['shredded potatoes', 'potato strips', '土豆丝', '酸辣土豆丝']
    },
    {
        'name': '芹菜香干',
        'filename': 'qincai_xianggan.jpg',
        'keywords': ['celery tofu', 'celery dried tofu', '芹菜香干', '芹菜']
    },
    {
        'name': '泡面',
        'filename': 'paomian.jpg',
        'keywords': ['instant noodles', 'ramen', '泡面', '方便面']
    },
    {
        'name': '紫菜鸡蛋汤',
        'filename': 'zicai_jidan_tang.jpg',
        'keywords': ['seaweed egg soup', 'egg soup', '紫菜鸡蛋汤', '蛋花汤']
    }
]

# Unsplash API (免费，需要注册获取API key)
UNSPLASH_ACCESS_KEY = ''  # 如果需要使用Unsplash API，请在此填入您的API key
UNSPLASH_API_URL = 'https://api.unsplash.com/search/photos'

# Pexels API (免费，需要注册获取API key)
PEXELS_API_KEY = ''  # 如果需要使用Pexels API，请在此填入您的API key
PEXELS_API_URL = 'https://api.pexels.com/v1/search'

# 图片保存目录
IMAGES_DIR = 'images'

def ensure_images_dir():
    """确保images目录存在"""
    if not os.path.exists(IMAGES_DIR):
        os.makedirs(IMAGES_DIR)
        print(f'创建目录: {IMAGES_DIR}')

def download_from_url(url, filename, max_size_mb=1):
    """从URL下载图片并优化"""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        # 检查文件大小
        if len(response.content) > max_size_mb * 1024 * 1024:
            print(f'  警告: 图片过大 ({len(response.content) / 1024 / 1024:.2f}MB)，跳过')
            return False
        
        # 打开并优化图片
        img = Image.open(io.BytesIO(response.content))
        
        # 转换为RGB模式（如果是RGBA）
        if img.mode == 'RGBA':
            img = img.convert('RGB')
        
        # 调整大小（最大1200px宽）
        if img.width > 1200:
            ratio = 1200 / img.width
            new_height = int(img.height * ratio)
            img = img.resize((1200, new_height), Image.Resampling.LANCZOS)
        
        # 保存为JPG，质量85%
        filepath = os.path.join(IMAGES_DIR, filename)
        img.save(filepath, 'JPEG', quality=85, optimize=True)
        
        file_size = os.path.getsize(filepath) / 1024
        print(f'  ✓ 下载成功: {filename} ({file_size:.1f}KB)')
        return True
    except Exception as e:
        print(f'  ✗ 下载失败: {str(e)}')
        return False

def search_unsplash(keywords, filename):
    """从Unsplash搜索并下载图片"""
    if not UNSPLASH_ACCESS_KEY:
        return False
    
    try:
        query = ' '.join(keywords[:2])  # 使用前两个关键词
        params = {
            'query': query,
            'per_page': 1,
            'orientation': 'landscape'
        }
        headers = {
            'Authorization': f'Client-ID {UNSPLASH_ACCESS_KEY}'
        }
        
        response = requests.get(UNSPLASH_API_URL, params=params, headers=headers, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        if data.get('results') and len(data['results']) > 0:
            image_url = data['results'][0]['urls']['regular']
            return download_from_url(image_url, filename)
    except Exception as e:
        print(f'  Unsplash搜索失败: {str(e)}')
    
    return False

def search_pexels(keywords, filename):
    """从Pexels搜索并下载图片"""
    if not PEXELS_API_KEY:
        return False
    
    try:
        query = ' '.join(keywords[:2])
        headers = {
            'Authorization': PEXELS_API_KEY
        }
        params = {
            'query': query,
            'per_page': 1,
            'orientation': 'landscape'
        }
        
        response = requests.get(PEXELS_API_URL, params=params, headers=headers, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        if data.get('photos') and len(data['photos']) > 0:
            image_url = data['photos'][0]['src']['large']
            return download_from_url(image_url, filename)
    except Exception as e:
        print(f'  Pexels搜索失败: {str(e)}')
    
    return False

def download_from_placeholder(product):
    """使用占位图片服务（作为备选方案）"""
    # 使用placeholder.com生成占位图
    placeholder_url = f'https://via.placeholder.com/800x600/FF6B6B/FFFFFF?text={product["name"]}'
    return download_from_url(placeholder_url, product['filename'])

def main():
    """主函数"""
    print('=' * 60)
    print('菜品图片批量下载工具')
    print('=' * 60)
    print()
    
    ensure_images_dir()
    
    # 检查已存在的文件
    existing_files = []
    for product in PRODUCTS:
        filepath = os.path.join(IMAGES_DIR, product['filename'])
        if os.path.exists(filepath):
            existing_files.append(product['filename'])
    
    if existing_files:
        print(f'发现已存在的图片 ({len(existing_files)} 个):')
        for f in existing_files:
            print(f'  - {f}')
        print()
        response = input('是否覆盖已存在的图片? (y/n): ')
        if response.lower() != 'y':
            print('跳过已存在的图片')
            print()
    
    print('开始下载图片...')
    print()
    
    success_count = 0
    fail_count = 0
    
    for i, product in enumerate(PRODUCTS, 1):
        print(f'[{i}/{len(PRODUCTS)}] {product["name"]} -> {product["filename"]}')
        
        filepath = os.path.join(IMAGES_DIR, product['filename'])
        if os.path.exists(filepath) and response.lower() != 'y':
            print('  跳过（已存在）')
            success_count += 1
            continue
        
        # 尝试从Unsplash下载
        if search_unsplash(product['keywords'], product['filename']):
            success_count += 1
            time.sleep(1)  # 避免请求过快
            continue
        
        # 尝试从Pexels下载
        if search_pexels(product['keywords'], product['filename']):
            success_count += 1
            time.sleep(1)
            continue
        
        # 如果API都不可用，使用占位图
        print('  使用占位图服务...')
        if download_from_placeholder(product):
            success_count += 1
        else:
            fail_count += 1
        
        time.sleep(0.5)  # 避免请求过快
        print()
    
    print('=' * 60)
    print(f'下载完成! 成功: {success_count}, 失败: {fail_count}')
    print('=' * 60)
    print()
    print('注意:')
    print('1. 如果使用了占位图，请手动替换为实际菜品图片')
    print('2. 建议使用搜索引擎手动下载高质量图片')
    print('3. 确保图片有商用授权')
    print()
    print('推荐网站:')
    print('- Unsplash: https://unsplash.com')
    print('- Pexels: https://www.pexels.com')
    print('- Pixabay: https://pixabay.com')
    print('- 百度图片: https://image.baidu.com')

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print('\n\n下载已取消')
    except Exception as e:
        print(f'\n错误: {str(e)}')

