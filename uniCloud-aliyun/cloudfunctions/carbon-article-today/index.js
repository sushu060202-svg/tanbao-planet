'use strict'
exports.main = async () => {
  const db = uniCloud.database()
  const today = new Date()
  const dateKey = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
  const result = await db.collection('carbon_articles').where({ status: 'enabled' }).orderBy('createdAt', 'asc').get()
  const list = result.data || []
  if (!list.length) return { code: 404, message: '暂无可阅读文章' }
  let hash = 0
  for (const char of dateKey) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  const article = list[hash % list.length]
  return { code: 0, data: article, readDate: dateKey, requiredSeconds: Number(article.readingMinutes || 1) * 60 }
}
