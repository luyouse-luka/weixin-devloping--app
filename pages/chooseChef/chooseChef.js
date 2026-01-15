const serverApi = require('../../utils/serverApi');

Page({
  data: {
    favorites: [],
    chefs: [
      {
        id: 1,
        name: '大锤',
        avatar: 'https://family-app-images.oss-cn-shanghai.aliyuncs.com/大锤.jpg', // Reference image on OSS
        description: '顶呱呱，不多谈了',
        specialties: ['全能',"金牌"],
        rating: 4.9,
        ordersCount: 0 // 已经做过的次数
      },
      {
        id: 2,
        name: '宇哥',
        avatar: 'https://family-app-images.oss-cn-shanghai.aliyuncs.com/宇哥.jpg',
        description: '顶呱呱，擅长泡面，清水挂面',
        specialties: ['还行',"银牌"],
        rating: 4.8,
        ordersCount: 0
      },
      {
        id: 3,
        name: '我爷',
        avatar: 'https://family-app-images.oss-cn-shanghai.aliyuncs.com/hongshaorou.jpg', // Placeholder until generation is possible
        description: '年轻的时候凑合，现在全是黑暗料理，谁吃谁不啧声',
        specialties: ['现在只能一星'],
        rating: 2.2,
        ordersCount: 0
      },

    ],
    selectedChefId: null,
    selectedChef: null
  },

  async onLoad(options) {
    // 接收已收藏的菜品
    const favorites = JSON.parse(decodeURIComponent(options.favorites || '[]'));

    // 从服务器/本地加载每个人已经做过的次数
    const cookCounts = await serverApi.getAllChefOrderCounts();
    const chefsWithCounts = this.data.chefs.map(chef => ({
      ...chef,
      ordersCount: cookCounts[chef.id] || 0
    }));

    this.setData({
      favorites,
      chefs: chefsWithCounts
    });
  },

  // 选择家里谁来做
  selectChef(e) {
    const chefId = e.currentTarget.dataset.id;

    // 特殊规则：只有全部是主食(categoryId === 5)时，才能选择宇哥(id === 2)
    if (chefId === 2) {
      const { favorites } = this.data;
      const hasNonMain = favorites.some(dish => dish.categoryId !== 5);
      if (hasNonMain) {
        wx.showModal({
          title: '提示',
          content: '宇哥还不会，请点大锤',
          showCancel: false
        });
        return;
      }
    }

    const chef = this.data.chefs.find(c => c.id === chefId);

    this.setData({
      selectedChefId: chefId,
      selectedChef: chef
    });

    // 显示选择提示
    wx.showToast({
      title: `已选择 ${chef.name}`,
      icon: 'success',
      duration: 1500
    });
  },

  // 确认安排
  async confirmAndSubmit() {
    if (!this.data.selectedChefId) {
      wx.showToast({
        title: '请先选择家里谁来做',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    const { favorites, selectedChef } = this.data;

    // 保存安排信息到本地缓存，并添加时间戳和执行人信息
    const timestamp = new Date().getTime();
    const planData = {
      id: 'PLAN' + timestamp,
      timestamp,
      timeText: this.formatTime(timestamp),
      cook: {
        id: selectedChef.id,
        name: selectedChef.name,
        avatar: selectedChef.avatar
      },
      dishes: favorites
    };
    wx.setStorageSync('lastCookPlan', planData);

    // 服务器记录：家人做饭次数 +1
    await serverApi.incrementChefOrderCount(selectedChef.id);

    // 重新获取最新的做饭次数
    const cookCounts = await serverApi.getAllChefOrderCounts();
    const updatedChefs = this.data.chefs.map(c => ({
      ...c,
      ordersCount: cookCounts[c.id] || 0
    }));
    this.setData({ chefs: updatedChefs });

    // 显示成功提示
    wx.showToast({
      title: '安排好了，等开饭～',
      icon: 'success',
      duration: 2000
    });

    const pages = getCurrentPages();
    if (pages.length > 1) {
      const prevPage = pages[pages.length - 2];
      // 只要上一页有 products / selectedCount，就尝试重置选中状态和角标数字
      if (prevPage && prevPage.data && Array.isArray(prevPage.data.products)) {
        const resetProducts = (prevPage.data.products || []).map(p => ({
          ...p,
          selected: false
        }));
        prevPage.setData({
          products: resetProducts,
          selectedCount: 0
        });
        // 同步刷新分类视图里用到的列表，避免界面残留高亮
        if (typeof prevPage.switchCategory === 'function') {
          prevPage.switchCategory({
            currentTarget: { dataset: { id: prevPage.data.activeCategoryId || 0 } }
          });
        }
      }
    }

    setTimeout(() => {
      wx.navigateBack({
        delta: 1
      });
    }, 600);
  },

  // 格式化时间
  formatTime(timestamp) {
    const date = new Date(parseInt(timestamp));
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hour}:${minute}`;
  },

  // 返回上一页
  goBack() {
    wx.navigateBack({
      delta: 1
    });
  }
});
