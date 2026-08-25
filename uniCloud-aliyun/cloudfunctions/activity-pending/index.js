'use strict'
exports.main = async (event) => {
  const db = uniCloud.database()
  const result = await db.collection('activities').where({ schoolId: event.schoolId || 'school_001', status: 'pending' }).orderBy('createdAt', 'desc').get()
  return { code: 0, data: result.data }
}
