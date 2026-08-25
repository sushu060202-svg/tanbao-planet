'use strict'
exports.main = async (event) => {
  const { certificationId, auditorId, result, reason = '' } = event
  if (!certificationId || !auditorId || !['approved', 'rejected'].includes(result)) return { code: 400, message: '审核参数不完整' }
  const db = uniCloud.database()
  const now = new Date()
  const certification = await db.collection('certifications').doc(certificationId).get()
  const record = certification.data[0]
  if (!record) return { code: 404, message: '认证材料不存在' }
  await db.collection('certifications').doc(certificationId).update({ status: result, reason: result === 'rejected' ? reason : '', auditorId, updatedAt: now })
  const accounts = db.collection('enterprise_accounts')
  const existing = await accounts.where({ userId: record.enterpriseId }).get()
  const values = { certificationId, certificationStatus: result, accountStatus: result === 'approved' ? 'active' : 'disabled', updatedAt: now }
  if (existing.data.length) await accounts.doc(existing.data[0]._id).update(values)
  else await accounts.add({ userId: record.enterpriseId, enterpriseName: record.enterpriseId, enterpriseCode: record.enterpriseId, ...values, createdAt: now })
  return { code: 0, status: result }
}
