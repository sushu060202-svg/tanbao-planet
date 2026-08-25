'use strict'
exports.main = async (event) => {
  const enterpriseId = String(event.enterpriseId || '')
  if (!enterpriseId) return { code: 400, message: '缺少企业信息' }
  const db = uniCloud.database()
  const products = (await db.collection('products').where({ enterpriseId, status: 'on_sale' }).get()).data || []
  const certification = (await db.collection('certifications').where({ enterpriseId, status: 'pending' }).get()).data || []
  const orders = (await db.collection('orders').where({ enterpriseId, status: 'pending' }).get()).data || []
  const lowStock = products.filter(item => Number(item.stock || 0) < 50)
  const month = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`
  const analytics = await uniCloud.callFunction({ name: 'product-analytics', data: { enterpriseId, month } })
  const stats = analytics.result || {}
  const reduction = products.reduce((sum, item) => sum + Number(item.carbonReduction || 0) * Number(item.stock || 0), 0)
  return { code: 0, pending: { certification: certification.length, lowStock: lowStock.length, lowStockProducts: lowStock.map(item => ({ id: item._id, name: item.name, image: item.image || '', stock: Number(item.stock || 0), points: Number(item.points || 0), carbonReduction: Number(item.carbonReduction || 0) })), orders: orders.length }, overview: { productCount: products.length, exchangeCount: stats.orders || 0, reduction: Number(reduction.toFixed(2)), lowStock: lowStock.length } }
}
