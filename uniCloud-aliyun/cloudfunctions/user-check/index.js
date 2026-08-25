'use strict'

exports.main = async (event) => {
  const username = String(event.username || '').trim()
  if (!username) return { code: 400, message: '用户名不能为空' }
  const result = await uniCloud.database().collection('users').where({ username }).limit(1).get()
  return { code: 0, exists: result.data.length > 0 }
}
