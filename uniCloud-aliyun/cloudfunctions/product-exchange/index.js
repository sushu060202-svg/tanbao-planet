'use strict'
exports.main = async (event) => {
  const { productId, userId } = event
  if (!productId || !userId) return { code: 400, message: '兑换参数不完整' }
  const db = uniCloud.database()
  const productResult = await db.collection('products').doc(productId).get()
  const userResult = await db.collection('users').doc(userId).get()
  const product = productResult.data[0]; const user = userResult.data[0]
  if (!product || product.status !== 'on_sale') return { code: 404, message: '商品不存在或已下架' }
  if (!user) return { code: 404, message: '用户不存在' }
  if (!user.receiverName || !user.phone || !user.address) return { code: 400, message: '请先完善收货信息' }
  if (product.stock < 1) return { code: 400, message: '库存不足' }
  if (Number(user.points || 0) < product.points) return { code: 400, message: '积分不足' }
  const now = new Date(); const orders = db.collection('orders')
  const order = await orders.add({ productId, productName: product.name, userId, enterpriseId: product.enterpriseId, points: product.points, receiverName: user.receiverName, phone: user.phone, address: user.address, status: 'success', createdAt: now })
  await db.collection('products').doc(productId).update({ stock: product.stock - 1 })
  await db.collection('users').doc(userId).update({ points: Number(user.points || 0) - product.points })
  await db.collection('point_transactions').add({ userId, type: 'exchange', amount: -product.points, source: 'exchange', orderId: order.id, createdAt: now })
  return { code: 0, orderId: order.id, points: Number(user.points || 0) - product.points, stock: product.stock - 1 }
}
