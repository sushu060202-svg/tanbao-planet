'use strict'
exports.main = async (event) => {
  const { submissionId, auditorId, result, reason = '' } = event
  if (!submissionId || !auditorId || !['approved', 'rejected'].includes(result)) return { code: 400, message: '审核参数不完整' }
  const db = uniCloud.database()
  const existing = await db.collection('activity_submissions').doc(submissionId).get()
  const submission = existing.data[0]
  if (!submission) return { code: 404, message: '凭证不存在' }
  if (submission.status !== 'pending') return { code: 409, message: '该凭证已处理' }
  const now = new Date()
  await db.collection('activity_submissions').doc(submissionId).update({ status: result, reason, updatedAt: now })
  await db.collection('activity_participants').where({ activityId: submission.activityId, userId: submission.userId }).update({ status: result, updatedAt: now })
  if (result === 'approved') {
    const activity = await db.collection('activities').doc(submission.activityId).get()
    const reward = Number(activity.data[0]?.reward || 0)
    if (reward > 0) await db.collection('point_transactions').add({ userId: submission.userId, schoolId: submission.schoolId, type: 'reward', amount: reward, carbonReduction: Number((reward * 0.1).toFixed(2)), source: 'activity', sourceId: submission.activityId, description: `活动凭证通过：${activity.data[0]?.title || ''}`, createdAt: now })
  }
  await db.collection('audit_records').add({ targetId: submissionId, targetType: 'activity_submission', auditorId, result, reason, createdAt: now })
  return { code: 0, status: result }
}
