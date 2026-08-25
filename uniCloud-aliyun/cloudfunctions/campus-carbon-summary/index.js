'use strict'
exports.main = async (event) => {
  const schoolId = String(event.schoolId || 'school_001')
  const db = uniCloud.database()
  const students = await db.collection('users').where({ role: 'personal', schoolId }).field({ _id: true }).get()
  const studentIds = (students.data || []).map(item => item._id)
  const result = studentIds.length ? await db.collection('point_transactions').where({ userId: db.command.in(studentIds), type: 'reward' }).get() : { data: [] }
  const total = (result.data || []).reduce((sum, item) => sum + Number(item.carbonReduction || 0), 0)
  return { code: 0, total: Number(total.toFixed(2)), target: 7000, progress: Math.min(100, Math.round(total / 7000 * 100)), participantCount: studentIds.length }
}
