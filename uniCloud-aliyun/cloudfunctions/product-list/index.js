'use strict'
exports.main = async (event) => {
  const db = uniCloud.database()
  const where = { status: 'on_sale' }
  if (event.enterpriseId) where.enterpriseId = event.enterpriseId
  const result = await db.collection('products').where(where).orderBy('createdAt', 'desc').get()
  return { code: 0, data: result.data }
}
