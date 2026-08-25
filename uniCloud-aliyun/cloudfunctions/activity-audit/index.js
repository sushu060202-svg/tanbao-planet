'use strict'
exports.main = async (event) => {
  const { activityId, auditorId, result, reason = '' } = event
  if (!activityId || !auditorId || !['approved', 'rejected'].includes(result)) return { code: 400, message: '审核参数不完整' }
  const db = uniCloud.database()
  await db.collection('activities').doc(activityId).update({ status: result })
  await db.collection('audit_records').add({ targetId: activityId, auditorId, result, reason, createdAt: new Date() })
  return { code: 0, status: result }
}
