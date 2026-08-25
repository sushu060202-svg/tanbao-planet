'use strict'
exports.main = async (event) => {
  const userId = String(event.userId || '')
  if (!userId) return { code: 400, message: '缺少用户信息' }
  const db = uniCloud.database()
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6)
  const result = await db.collection('point_transactions').where({ userId, type: 'reward', createdAt: db.command.gte(start) }).get()
  const totals = {}
  for (let index = 0; index < 7; index++) { const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (6 - index)); totals[`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`] = 0 }
  for (const item of result.data || []) { const date = new Date(item.createdAt); const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`; if (totals[key] !== undefined) totals[key] += Number(item.amount || 0) }
  return { code: 0, data: Object.keys(totals).map((key, index) => ({ date: key, points: totals[key], day: ['一','二','三','四','五','六','日'][new Date(now.getFullYear(), now.getMonth(), now.getDate() - (6 - index)).getDay()] })) }
}
