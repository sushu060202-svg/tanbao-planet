'use strict'
const crypto = require('crypto')

exports.main = async (event) => {
  const username = String(event.username || '').trim()
  const { password, role = 'personal', schoolId = '' } = event
  if (!username || !password) return { code: 400, message: '用户名和密码不能为空' }
  if (!['personal', 'campus', 'enterprise'].includes(role)) return { code: 400, message: '身份类型不正确' }
  const users = uniCloud.database().collection('users')
  if ((await users.where({ username }).count()).total) return { code: 409, message: '用户名已存在' }
  const passwordHash = crypto.createHash('sha256').update(password).digest('hex')
  try {
    const result = await users.add({ username, passwordHash, role, schoolId, points: 1280, nickname: username, avatar: '', createdAt: new Date() })
    return { code: 0, userId: result.id, role }
  } catch (error) {
    return { code: 409, message: '用户名已存在' }
  }
}
