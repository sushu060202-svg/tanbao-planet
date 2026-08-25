'use strict'
exports.main = async (event) => {
  const db = uniCloud.database()
  const where = { schoolId: event.schoolId || 'school_001' }
  if (event.status) where.status = event.status
  const result = await db.collection('activity_submissions').where(where).orderBy('createdAt', 'desc').get()
  const activities = db.collection('activities')
  const users = db.collection('users')
  const data = await Promise.all(result.data.map(async row => {
    const [activity, user] = await Promise.all([activities.doc(row.activityId).get(), users.doc(row.userId).get()])
    return { ...row, activityTitle: activity.data[0]?.title || '活动', name: user.data[0]?.nickname || user.data[0]?.username || '未命名用户', username: user.data[0]?.username || '' }
  }))
  return { code: 0, data }
}
