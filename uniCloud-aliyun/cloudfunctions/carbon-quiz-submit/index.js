'use strict'
exports.main = async (event) => {
  const userId = String(event.userId || '')
  const questionId = String(event.questionId || '')
  const answer = String(event.answer || '')
  if (!userId || !questionId || !answer) return { code: 400, message: '答题信息不完整' }
  const db = uniCloud.database()
  const now = new Date()
  const answerDate = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`
  const old = await db.collection('carbon_quiz_records').where({ userId, questionId, answerDate }).limit(1).get()
  if (old.data && old.data.length) return { code: 409, message: '今日已经答过题了' }
  const result = await db.collection('carbon_questions').doc(questionId).get()
  const question = result.data && result.data[0]
  if (!question) return { code: 404, message: '题目不存在' }
  const isCorrect = answer === question.answer
  const points = isCorrect ? Number(question.points || 10) : 0
  await db.collection('carbon_quiz_records').add({ userId, questionId, answerDate, answer, isCorrect, points, createdAt: now })
  if (points > 0) await db.collection('point_transactions').add({ userId, type: 'reward', source: 'quiz', sourceId: questionId, amount: points, createdAt: now })
  if (points > 0) { const users = await db.collection('users').doc(userId).get(); if (users.data && users.data[0]) await db.collection('users').doc(userId).update({ points: Number(users.data[0].points || 0) + points }) }
  return { code: 0, isCorrect, points, answer: question.answer, analysis: question.analysis }
}
