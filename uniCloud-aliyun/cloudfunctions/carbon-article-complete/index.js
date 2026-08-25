'use strict'

exports.main = async (event) => {
  const userId = String(event.userId || '')
  const articleId = String(event.articleId || '')
  const durationSeconds = Number(event.durationSeconds || 0)
  if (!userId || !articleId) return { code: 400, message: '阅读信息不完整' }
  const db = uniCloud.database()
  const now = new Date()
  const readDate = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`
  const old = await db.collection('carbon_reading_records').where({ userId, articleId, readDate }).limit(1).get()
  if (old.data && old.data.length) return { code: 0, completed: true, duplicate: true, points: 0 }
  if (durationSeconds < 60) return { code: 400, message: '阅读时间不足 1 分钟' }
  const article = await db.collection('carbon_articles').doc(articleId).get()
  const title = article.data && article.data[0] ? article.data[0].title : ''
  await db.collection('carbon_reading_records').add({ userId, articleId, articleTitle: title, readDate, durationSeconds, completed: true, points: 5, createdAt: now })
  await db.collection('point_transactions').add({ userId, type: 'reward', source: 'reading', sourceId: articleId, amount: 5, createdAt: now })
  const users = await db.collection('users').doc(userId).get()
  if (users.data && users.data[0]) await db.collection('users').doc(userId).update({ points: Number(users.data[0].points || 0) + 5 })
  return { code: 0, completed: true, duplicate: false, points: 5 }
}
