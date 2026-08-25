'use strict'
exports.main = async (event) => {
  const userId = String(event.userId || '')
  if (!userId) return { code: 400, message: '缺少用户信息' }
  const db = uniCloud.database()
  const now = new Date()
  const answerDate = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`
  const listResult = await db.collection('carbon_questions').where({ status: 'enabled' }).orderBy('createdAt', 'asc').get()
  const list = listResult.data || []
  if (!list.length) return { code: 404, message: '暂无可用题目' }
  let hash = 0
  for (const char of `${userId}-${answerDate}`) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  const question = list[hash % list.length]
  const old = await db.collection('carbon_quiz_records').where({ userId, questionId: question._id, answerDate }).limit(1).get()
  return { code: 0, data: { _id: question._id, title: question.title, options: question.options, category: question.category, points: question.points }, answerDate, completed: Boolean(old.data && old.data.length) }
}
