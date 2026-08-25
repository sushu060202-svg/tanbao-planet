'use strict'
exports.main = async (event) => {
  const enterpriseId = String(event.enterpriseId || '')
  if (!enterpriseId) return { code: 400, message: '企业信息不能为空' }
  const result = await uniCloud.database().collection('certifications').where({ enterpriseId }).orderBy('createdAt', 'desc').limit(1).get()
  return { code: 0, data: result.data[0] || null }
}
