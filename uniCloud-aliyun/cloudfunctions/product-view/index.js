'use strict'

exports.main = async (event) => {
  const { productId, userId, enterpriseId } = event
  if (!productId || !userId || !enterpriseId) return { code: 400, message: '访问参数不完整' }
  const db = uniCloud.database()
  const now = new Date()
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const existed = await db.collection('product_views').where({ productId, userId, month }).limit(1).get()
  if (existed.data && existed.data.length) return { code: 0, deduplicated: true }
  await db.collection('product_views').add({ productId, userId, enterpriseId, month, createdAt: now })
  return { code: 0 }
}
