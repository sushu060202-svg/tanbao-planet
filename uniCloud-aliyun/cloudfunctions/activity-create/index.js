'use strict'
exports.main = async (event) => {
  const { title, organizerId, organizerType, schoolId, type, date, startAt = '', endAt = '', location, reward = 0, desc = '' } = event
  if (!title || !organizerId || !['campus', 'enterprise'].includes(organizerType)) return { code: 400, message: '活动信息不完整' }
  const db = uniCloud.database()
  if (endAt && startAt && new Date(endAt) < new Date(startAt)) return { code: 400, message: '截止时间不能早于开始时间' }
  const result = await db.collection('activities').add({ title, organizerId, organizerType, schoolId: schoolId || 'school_001', type: type || 'other', date: date || '', startAt, endAt, location: location || '', reward: Number(reward), desc, status: 'published', createdAt: new Date() })
  return { code: 0, activityId: result.id, status: 'published' }
}
