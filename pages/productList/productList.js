// ... existing code ...
const serverApi = require('../../utils/serverApi');

Page({
  data: {
    categories: [
      { id: 0, name: '厨神的菜单' },
      { id: 1, name: '拿手好戏' },
      { id: 2, name: '季节新品' },
      { id: 3, name: '必吃榜' },
      { id: 4, name: '第九大菜系' },
      { id: 5, name: '主食' },
      { id: 6, name: '国窖' }
    ],
    activeCategoryId: 0,
    products: [], // 初始化为空数组
    filteredProducts: [],
    categorizedProducts: {},
    selectedCount: 0 // 已选中的菜品数量
  },
  async onLoad() {
    await this.loadInitialProducts(); // 先加载商品数据
    this.switchCategory({ currentTarget: { dataset: { id: 0 } } });
  },
  
  async onShow() {
    // 每次返回列表页，重新加载商品，并按照当前分类刷新列表，避免残留高亮
    await this.loadInitialProducts(); // 先加载商品数据
    this.switchCategory({
      currentTarget: { dataset: { id: this.data.activeCategoryId || 0 } }
    });
  },
  // 切换商品分类
  switchCategory(e) {
    const id = e.currentTarget.dataset.id;
    let filteredProducts = [];
    let categorizedProducts = {};

    if (id === 0) {
      this.data.categories.slice(1).forEach(category => {
        const categoryId = category.id;
        categorizedProducts[categoryId] = this.data.products.filter(
          product => product.categoryId === categoryId
        );
      });
      console.log('categorizedProducts 数据结构:', JSON.stringify(categorizedProducts));
    } else {
      filteredProducts = this.data.products.filter(item => item.categoryId === id);
    }

    this.setData({
      activeCategoryId: id,
      filteredProducts,
      categorizedProducts
    });
  },


  // 加载初始商品数据
  async loadInitialProducts() {
    // 模拟从服务器获取商品数据
    const mockProducts = [
      // 拿手好戏
      {
        id: 1,
        name: '红烧肉',
        price: 28,
        categoryId: 1,
        // image: '/images/gongbao.jpg', // old
        image: 'https://family-app-images.oss-cn-shanghai.aliyuncs.com/hongshaorou.jpg', // new
        orderCount: 0,
        sold: 0,
        intro: '大王招牌',
        likes: 0
      },
      {
        id: 2,
        name: '红烧排骨',
        price: 26,
        categoryId: 1,
        // image: '/images/yuxiang.jpg', // old
        image: 'https://family-app-images.oss-cn-shanghai.aliyuncs.com/paigu.jpg', // new
        orderCount: 0,
        sold: 0,
        intro: '顶呱呱',
        likes: 0
      },
      {
        id: 3,
        name: '土豆炖牛腩',
        price: 38,
        categoryId: 1,
        image: 'https://family-app-images.oss-cn-shanghai.aliyuncs.com/tudou_dun_niunan.jpg',
        orderCount: 0,
        sold: 0,
        intro: '软糯鲜香，营养丰富',
        likes: 0
      },
      {
        id: 14,
        name: '红烧大虾',
        price: 45,
        categoryId: 1,
        image: 'https://family-app-images.oss-cn-shanghai.aliyuncs.com/hongshao_daxia.jpg',
        orderCount: 0,
        sold: 0,
        intro: '鲜香Q弹，色香味俱全',
        likes: 0
      },
      {
        id: 15,
        name: '五花肉烧鹌鹑蛋',
        price: 32,
        categoryId: 1,
        image: 'https://family-app-images.oss-cn-shanghai.aliyuncs.com/wuhuarou_anchundan.jpg',
        orderCount: 0,
        sold: 0,
        intro: '肥而不腻，入口即化',
        likes: 0
      },
         {
        id: 25,
        name: '清蒸大闸蟹',
        price: 128,
        categoryId: 1,
        image: 'https://family-app-images.oss-cn-shanghai.aliyuncs.com/dazhaxie.jpg',
        orderCount: 0,
        sold: 0,
        intro: '就是有钳',
        likes: 0
      },
      // 季节新品
      {
        id: 4,
        name: '时令蔬菜',
        price: 18,
        categoryId: 2,
        image: 'https://family-app-images.oss-cn-shanghai.aliyuncs.com/shiling_shucai.jpg',
        orderCount: 0,
        sold: 0,
        intro: '新鲜时令，健康美味',
        likes: 0
      },
      {
        id: 5,
        name: '季节限定',
        price: 25,
        categoryId: 2,
        image: 'https://family-app-images.oss-cn-shanghai.aliyuncs.com/dazhaxie.jpg',
        orderCount: 0,
        sold: 0,
        intro: '限时供应，错过等一年',
        likes: 0
      },
      // 好吃但还不会做
      {
        id: 6,
        name: '糖醋里脊',
        price: 32,
        categoryId: 3,
        image: 'https://family-app-images.oss-cn-shanghai.aliyuncs.com/tangcu_liji.jpg',
        orderCount: 0,
        sold: 0,
        intro: '酸甜开胃，外酥里嫩',
        likes: 0
      },
      {
        id: 7,
        name: '水煮鱼',
        price: 45,
        categoryId: 3,
        image: 'https://family-app-images.oss-cn-shanghai.aliyuncs.com/shuizhu_yu.jpg',
        orderCount: 0,
        sold: 0,
        intro: '麻辣鲜香，回味无穷',
        likes: 0
      },
      // 特色小炒
      {
        id: 8,
        name: '小炒肉',
        price: 24,
        categoryId: 4,
        image: 'https://family-app-images.oss-cn-shanghai.aliyuncs.com/xiaochaorou.jpg',
        orderCount: 0,
        sold: 0,
        intro: '香辣下饭，家常美味',
        likes: 0
      },
      {
        id: 9,
        name: '干锅花菜',
        price: 20,
        categoryId: 4,
        image: 'https://family-app-images.oss-cn-shanghai.aliyuncs.com/ganguohuacai.jpg',
        orderCount: 0,
        sold: 0,
        intro: '干香爽脆',
        likes: 0
      },
      {
        id: 16,
        name: '海带烧肉',
        price: 28,
        categoryId: 4,
        image: 'https://family-app-images.oss-cn-shanghai.aliyuncs.com/haidaishaorou.jpg',
        orderCount: 0,
        sold: 0,
        intro: '鲜香软糯，营养丰富',
        likes: 0
      },
      {
        id: 17,
        name: '萝卜烧肉',
        price: 26,
        categoryId: 4,
        image: 'https://family-app-images.oss-cn-shanghai.aliyuncs.com/luobo_shaorou.jpg',
        orderCount: 0,
        sold: 0,
        intro: '清甜爽口，解腻下饭',
        likes: 0
      },
      {
        id: 18,
        name: '西红柿炒鸡蛋',
        price: 18,
        categoryId: 4,
        image: 'https://family-app-images.oss-cn-shanghai.aliyuncs.com/xihongshichaojidan.jpg',
        orderCount: 0,
        sold: 0,
        intro: '经典家常，酸甜开胃',
        likes: 0
      },
      {
        id: 19,
        name: '土豆丝',
        price: 15,
        categoryId: 4,
        image: 'https://family-app-images.oss-cn-shanghai.aliyuncs.com/tudousi.jpg',
        orderCount: 0,
        sold: 0,
        intro: '爽脆可口，下饭神器',
        likes: 0
      },
      {
        id: 20,
        name: '芹菜香干',
        price: 16,
        categoryId: 4,
        image: 'https://family-app-images.oss-cn-shanghai.aliyuncs.com/qincai_xianggan.jpg',
        orderCount: 0,
        sold: 0,
        intro: '清香爽脆，健康美味',
        likes: 0
      },
      // 主食
      {
        id: 10,
        name: '蛋炒饭',
        price: 15,
        categoryId: 5,
        image: 'https://family-app-images.oss-cn-shanghai.aliyuncs.com/danchaofan.jpg',
        orderCount: 0,
        sold: 0,
        intro: '粒粒分明，香气扑鼻',
        likes: 0
      },
      {
        id: 11,
        name: '手工面条',
        price: 18,
        categoryId: 5,
        image: 'https://family-app-images.oss-cn-shanghai.aliyuncs.com/miantiao.jpg',
        orderCount: 0,
        sold: 0,
        intro: '手工制作，Q弹有劲',
        likes: 0
      },
      {
        id: 21,
        name: '世界第一的泡面',
        price: 12,
        categoryId: 5,
        image: 'https://family-app-images.oss-cn-shanghai.aliyuncs.com/paomian.jpg',
        orderCount: 0,
        sold: 0,
        intro: '没人比我更懂泡面',
        likes: 0
      },
      {
        id: 22,
        name: '紫菜鸡蛋汤',
        price: 10,
        categoryId: 5,
        image: 'https://family-app-images.oss-cn-shanghai.aliyuncs.com/zicai_jidan_tang.jpg',
        orderCount: 0,
        sold: 0,
        intro: '品鉴上百家不如自己烧的好喝',
        likes: 0
      },
      {
        id: 27,
        name: '馒头',
        price: 2,
        categoryId: 5,
        image: 'https://family-app-images.oss-cn-shanghai.aliyuncs.com/mantou.jpg',
        orderCount: 0,
        sold: 0,
        intro: '松软香甜，经典主食',
        likes: 0
      },
      {
        id: 28,
        name: '花卷',
        price: 3,
        categoryId: 5,
        image: 'https://family-app-images.oss-cn-shanghai.aliyuncs.com/huajuan.jpg',
        orderCount: 0,
        sold: 0,
        intro: '层次分明，口感丰富',
        likes: 0
      },
      {
        id: 29,
        name: '米饭',
        price: 2,
        categoryId: 5,
        image: 'https://family-app-images.oss-cn-shanghai.aliyuncs.com/mifan.jpg',
        orderCount: 0,
        sold: 0,
        intro: '粒粒饱满，香糯可口',
        likes: 0
      },
      // 茶饮
      {
        id: 12,
        name: '柠檬蜂蜜茶',
        price: 12,
        categoryId: 6,
        image: 'https://family-app-images.oss-cn-shanghai.aliyuncs.com/ningmeng_fengmi_cha.jpg',
        orderCount: 0,
        sold: 0,
        intro: '清新解腻，酸甜可口',
        likes: 0
      },
      {
        id: 13,
        name: '桂花乌龙',
        price: 15,
        categoryId: 6,
        image: 'https://family-app-images.oss-cn-shanghai.aliyuncs.com/guihuawulong.jpg',
        orderCount: 0,
        sold: 0,
        intro: '清香淡雅，回味甘甜',
        likes: 0
      },
         {
        id: 23,
        name: '勇闯天涯',
        price: 6,
        categoryId: 6,
        image: 'https://family-app-images.oss-cn-shanghai.aliyuncs.com/pijiu.jpg',
        orderCount: 0,
        sold: 0,
        intro: '冰镇国窖',
        likes: 0
      },   
      {
        id: 24,
        name: '罗曼尼康帝',
        price: 999,
        categoryId: 6,
        image: 'https://family-app-images.oss-cn-shanghai.aliyuncs.com/lafei.jpg',
        orderCount: 0,
        sold: 0,
        intro: '82年的罗曼尼康帝，无敌是多~多么寂寞~',
        likes: 0
      },   {
        id: 25,
        name: '鸡尾酒',
        price: 25,
        categoryId: 6,
        image: 'https://family-app-images.oss-cn-shanghai.aliyuncs.com/jiweijiu.jpg',
        orderCount: 0,
        sold: 0,
        intro: '皇家一级调酒师，精心调制',
        likes: 0
      },   {
        id: 26,
        name: '阿萨姆巧克力奶茶',
        price: 6,
        categoryId: 6,
        image: 'https://family-app-images.oss-cn-shanghai.aliyuncs.com/asamu.jpg',
        orderCount: 0,
        sold: 0,
        intro: '6块',
        likes: 0
      },
    ];

    // 从服务器获取“已经吃了X次”统计
    const orderCounts = await serverApi.getAllProductOrderCounts();

    // 从本地恢复喜欢状态，但不影响“今天谁下厨”的选中状态
    const likedIds = wx.getStorageSync('likedIds') || [];
    const productsWithCountsAndLikes = mockProducts.map(p => ({
      ...p,
      orderCount: orderCounts[p.id] || 0,
      liked: likedIds.includes(p.id),
      // 进入页面或返回时，默认都视为“未选中本次要做的菜”
      selected: false
    }));

    this.setData({
      products: productsWithCountsAndLikes,
      // 角标数字只统计本次选中的菜品，初始为 0
      selectedCount: 0
    });
  },

  // 图片加载错误处理
  onImageError(e) {
    const id = e.currentTarget.dataset.id;
    const products = this.data.products.map(item => {
      if (item.id === id) {
        return { ...item, image: 'https://family-app-images.oss-cn-shanghai.aliyuncs.com/product1.jpg' }; // 使用默认图片
      }
      return item;
    });
    this.setData({ products });
  },

  // 切换喜欢状态，并为该菜品增加“已吃次数”
  async toggleLike(e) {
    const id = e.currentTarget.dataset.id;
    let products = this.data.products.map(item => {
      if (item.id === id) {
        const liked = !item.liked;
        return { ...item, liked };
      }
      return item;
    });

    // 如果是从未喜欢 -> 喜欢，则为这道菜在服务器上 +1 次“已吃”
    const changedItem = products.find(p => p.id === id);
    if (changedItem && changedItem.liked) {
      await serverApi.incrementProductOrderCount(id);
      // 重新获取所有菜品的已吃次数，保持和服务器同步
      const orderCounts = await serverApi.getAllProductOrderCounts();
      products = products.map(p => ({
        ...p,
        orderCount: orderCounts[p.id] || 0
      }));
    }

    const selectedCount = products.filter(p => p.selected).length;

    // 重新计算当前分类下的数据
    this.setData({ products, selectedCount });
    this.switchCategory({ currentTarget: { dataset: { id: this.data.activeCategoryId } } });

    // 持久化到本地
    const likedIds = [];
    products.forEach(p => {
      if (p.liked) {
        likedIds.push(p.id);
      }
    });
    wx.setStorageSync('likedIds', likedIds);
  },

  // 点击整个菜品，控制“选中状态”，用于统计“今天谁下厨”的数量
  toggleSelect(e) {
    const id = e.currentTarget.dataset.id;
    const products = this.data.products.map(item => {
      if (item.id === id) {
        const selected = !item.selected;
        return { ...item, selected };
      }
      return item;
    });

    const selectedCount = products.filter(p => p.selected).length;
    this.setData({ products, selectedCount });
    this.switchCategory({ currentTarget: { dataset: { id: this.data.activeCategoryId } } });
  },

  // 跳转到“选择家里谁来做”页面
  goToChooseCook() {
    const favorites = this.data.products.filter(item => item.selected);
    if (!favorites.length) {
      wx.showToast({
        title: '先点几道喜欢的菜',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    wx.navigateTo({
      url: `/pages/chooseChef/chooseChef?favorites=${encodeURIComponent(JSON.stringify(favorites))}`
    });
  },

});
