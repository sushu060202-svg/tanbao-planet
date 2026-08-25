'use strict'
exports.main = async () => {
  const result = await uniCloud.database().collection('schools').where({ status: 'active' }).orderBy('createdAt', 'asc').get()
  if (result.data.length) return { code: 0, data: result.data }
  return { code: 0, data: [{ _id: 'school_001', name: '安徽理工大学', province: '安徽', status: 'active' }] }
}
