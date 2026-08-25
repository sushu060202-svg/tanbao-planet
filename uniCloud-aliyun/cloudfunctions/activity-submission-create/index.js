'use strict'
exports.main = async (event) => {
  const { activityId, userId, schoolId, image, remark = '' } = event
  if (!activityId || !userId || !schoolId || !image) return { code: 400, message: '活动凭证信息不完整' }
  const db = uniCloud.database()
  const activity = await db.collection('activities').doc(activityId).get()
  if (!activity.data.length) return { code: 404, message: '活动不存在' }
  const now = new Date()
  const submissions = db.collection('activity_submissions')
  const existing = await submissions.where({ activityId, userId }).get()
  if (existing.data.some(item => item.status === 'pending')) return { code: 409, message: '凭证已提交，请等待审核' }
  let submissionId
  if (existing.data.length) {
    await submissions.doc(existing.data[0]._id).update({ schoolId, image, remark, status: 'pending', reason: '', updatedAt: now })
    submissionId = existing.data[0]._id
  } else {
    const result = await submissions.add({ activityId, userId, schoolId, image, remark, status: 'pending', reason: '', createdAt: now, updatedAt: now })
    submissionId = result.id
  }
  const participants = db.collection('activity_participants')
  const participant = await participants.where({ activityId, userId }).get()
  if (participant.data.length) await participants.doc(participant.data[0]._id).update({ status: 'submitted', updatedAt: now })
  else await participants.add({ activityId, userId, schoolId, status: 'submitted', createdAt: now, updatedAt: now })
  return { code: 0, submissionId, status: 'pending' }
}
