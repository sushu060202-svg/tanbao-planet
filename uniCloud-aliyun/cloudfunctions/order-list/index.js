'use strict'
exports.main = async (event) => {
  const db = uniCloud.database()
  const where = event.enterpriseId ? { enterpriseId: event.enterpriseId } : { userId: event.userId }
  const result = await db.collection('orders').where(where).orderBy('createdAt', 'desc').get()
  return { code: 0, data: result.data }
}
