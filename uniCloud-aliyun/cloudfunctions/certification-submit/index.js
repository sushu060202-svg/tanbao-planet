'use strict'
exports.main = async (event) => {
  const { enterpriseId, materials = [] } = event
  if (!enterpriseId || !materials.length) return { code: 400, message: '请至少上传一份认证材料' }
  const db = uniCloud.database()
  const result = await db.collection('certifications').add({ enterpriseId, materials, status: 'pending', reason: '', createdAt: new Date(), updatedAt: new Date() })
  return { code: 0, certificationId: result.id, status: 'pending' }
}
