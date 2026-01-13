const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();

// 配置 CORS - 允许所有来源（包括微信小程序）
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: false
}));

// 处理 OPTIONS 预检请求
app.options('*', cors());

// 添加请求日志中间件
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`, {
    headers: req.headers,
    ip: req.ip || req.connection.remoteAddress
  });
  next();
});

app.use(express.json());

// 数据库配置 - 请修改为你的数据库信息
// 注意：如果使用宝塔面板，可以在"数据库"页面查看root密码
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root', // 使用root用户
  password: process.env.DB_PASSWORD || 'd27299896610e289', // 请替换为宝塔面板中显示的root密码
  database: process.env.DB_NAME || 'weixin_app',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// 创建数据库连接池
const pool = mysql.createPool(dbConfig);

// 测试数据库连接
pool.getConnection()
  .then(connection => {
    console.log('数据库连接成功');
    connection.release();
  })
  .catch(err => {
    console.error('数据库连接失败:', err);
  });

// ==================== 商品相关接口 ====================

// 1. 获取商品订单次数
app.get('/api/product/:productId/orderCount', async (req, res) => {
  try {
    const productId = parseInt(req.params.productId);
    if (isNaN(productId)) {
      return res.status(400).json({ success: false, message: '无效的商品ID' });
    }

    const [rows] = await pool.execute(
      'SELECT order_count FROM product_stats WHERE product_id = ?',
      [productId]
    );
    
    const orderCount = rows.length > 0 ? rows[0].order_count : 0;
    res.json({ success: true, orderCount });
  } catch (error) {
    console.error('获取商品订单次数错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 2. 增加商品订单次数
app.post('/api/product/:productId/incrementOrder', async (req, res) => {
  try {
    const productId = parseInt(req.params.productId);
    if (isNaN(productId)) {
      return res.status(400).json({ success: false, message: '无效的商品ID' });
    }
    
    // 使用 INSERT ... ON DUPLICATE KEY UPDATE 实现 upsert
    await pool.execute(
      `INSERT INTO product_stats (product_id, order_count) 
       VALUES (?, 1) 
       ON DUPLICATE KEY UPDATE order_count = order_count + 1`,
      [productId]
    );
    
    res.json({ success: true, message: '更新成功' });
  } catch (error) {
    console.error('更新商品订单次数错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 3. 批量获取所有商品订单次数
app.get('/api/products/orderCounts', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT product_id, order_count FROM product_stats'
    );
    
    const data = {};
    rows.forEach(row => {
      data[row.product_id] = row.order_count;
    });
    
    res.json({ success: true, data });
  } catch (error) {
    console.error('获取所有商品订单次数错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// ==================== 厨师相关接口 ====================

// 4. 获取厨师完成单数
app.get('/api/chef/:chefId/orderCount', async (req, res) => {
  try {
    const chefId = parseInt(req.params.chefId);
    if (isNaN(chefId)) {
      return res.status(400).json({ success: false, message: '无效的厨师ID' });
    }

    const [rows] = await pool.execute(
      'SELECT orders_count FROM chef_stats WHERE chef_id = ?',
      [chefId]
    );
    
    const ordersCount = rows.length > 0 ? rows[0].orders_count : 0;
    res.json({ success: true, ordersCount });
  } catch (error) {
    console.error('获取厨师完成单数错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 5. 增加厨师完成单数
app.post('/api/chef/:chefId/incrementOrder', async (req, res) => {
  try {
    const chefId = parseInt(req.params.chefId);
    if (isNaN(chefId)) {
      return res.status(400).json({ success: false, message: '无效的厨师ID' });
    }
    
    await pool.execute(
      `INSERT INTO chef_stats (chef_id, orders_count) 
       VALUES (?, 1) 
       ON DUPLICATE KEY UPDATE orders_count = orders_count + 1`,
      [chefId]
    );
    
    res.json({ success: true, message: '更新成功' });
  } catch (error) {
    console.error('更新厨师完成单数错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 6. 批量获取所有厨师完成单数
app.get('/api/chefs/orderCounts', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT chef_id, orders_count FROM chef_stats'
    );
    
    const data = {};
    rows.forEach(row => {
      data[row.chef_id] = row.orders_count;
    });
    
    res.json({ success: true, data });
  } catch (error) {
    console.error('获取所有厨师完成单数错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 健康检查接口
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: '服务运行正常' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
  console.log(`API地址: http://localhost:${PORT}/api`);
});
