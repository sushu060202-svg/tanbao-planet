'use strict'
exports.main = async (event) => {
  const db = uniCloud.database()
  const activityId = event.activityId
  if (!activityId) return { code: 400, message: '活动参数不完整' }
  const activity = await db.collection('activities').doc(activityId).get()
  if (!activity.data.length) return { code: 404, message: '活动不存在' }
  const rows = await db.collection('activity_participants').where({ activityId }).orderBy('createdAt', 'desc').get()
  const users = db.collection('users')
  const data = await Promise.all(rows.data.map(async row => {
    const result = await users.doc(row.userId).get()
    const user = result.data[0] || {}
    return { ...row, name: user.nickname || user.username || '未命名用户', username: user.username || '', schoolId: row.schoolId }
  }))
  return { code: 0, activity: activity.data[0], data }
}
