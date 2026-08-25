'use strict'

exports.main = async (event) => {
  const content = String(event.content || '').trim()
  const userId = String(event.userId || '')
  const role = String(event.role || 'personal')
  if (!content || !userId) return { code: 400, message: '咨询内容和用户信息不能为空' }

  const db = uniCloud.database()
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000)
  const recent = await db.collection('ai_records').where({ userId, createdAt: db.command.gte(since) }).count()
  if (recent.total >= 5) return { code: 429, message: '每日 AI 咨询次数已达到 5 次，请明天再试' }

  let reply = '暂时无法连接 DeepSeek，请稍后再试。'
  const apiKey = process.env.DEEPSEEK_API_KEY
  if (apiKey) {
    try {
      const response = await uniCloud.httpclient.request('https://api.deepseek.com/chat/completions', {
        method: 'POST', dataType: 'json', timeout: 30000,
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        data: { model: process.env.DEEPSEEK_MODEL || 'deepseek-chat', messages: [
          { role: 'system', content: `你是碳宝AI，直接自然地回答用户问题，不要固定输出 JSON，不限制话题。当前用户身份：${role}` },
          { role: 'user', content }
        ] }
      })
      console.log('[DeepSeek] status:', response.status)
      console.log('[DeepSeek] response:', JSON.stringify(response.data || {}))
      reply = response.data.choices?.[0]?.message?.content || reply
    } catch (error) {
      console.error('[DeepSeek] request failed:', error && error.message ? error.message : String(error))
    }
  }
  await db.collection('ai_records').add({ userId, role, content, reply, createdAt: new Date() })
  return { code: 0, reply }
}
