// cloudfunctions/sendOrderNotification/index.js
// 云函数：发送订单订阅消息给管理者
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {
  const { templateId, orderData, managerOpenId } = event
  
  console.log('收到发送订阅消息请求:', { templateId, managerOpenId, orderId: orderData.orderId })
  
  // 检查必要参数
  if (!templateId) {
    return {
      success: false,
      error: '模板ID不能为空'
    }
  }
  
  if (!managerOpenId) {
    return {
      success: false,
      error: '管理者openid不能为空'
    }
  }
  
  try {
    // 构建订阅消息数据
    // 注意：这里的字段需要根据你在小程序后台配置的模板字段来调整
    const messageData = {
      // 示例字段，需要根据实际模板调整
      thing1: {  // 订单内容
        value: orderData.cart.map(item => item.name).join('、').substring(0, 20) || '订单商品'
      },
      time2: {  // 下单时间
        value: orderData.orderTime || new Date().toLocaleString('zh-CN')
      },
      thing3: {  // 订单状态
        value: '新订单'
      },
      amount4: {  // 订单金额
        value: orderData.totalPrice || '0'
      },
      thing5: {  // 厨师信息
        value: orderData.chef ? orderData.chef.name : '未指定'
      }
    }
    
    // 发送订阅消息
    const result = await cloud.openapi.subscribeMessage.send({
      touser: managerOpenId,
      template_id: templateId,
      page: 'pages/managerOrders/managerOrders', // 点击消息跳转的页面
      data: messageData,
      miniprogram_state: 'formal' // 正式版：formal，开发版：developer，体验版：trial
    })
    
    console.log('订阅消息发送成功:', result)
    
    return {
      success: true,
      result: result
    }
  } catch (err) {
    console.error('发送订阅消息失败:', err)
    return {
      success: false,
      error: err.message || err.errMsg || '发送失败'
    }
  }
}


