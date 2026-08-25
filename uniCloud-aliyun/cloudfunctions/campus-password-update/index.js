'use strict'
const crypto = require('crypto')
exports.main = async (event) => {
  const userId = String(event.userId || '')
  const oldPassword = String(event.oldPassword || '')
  const newPassword = String(event.newPassword || '')
  if (!userId || !oldPassword || newPassword.length < 6) return { code: 400, message: '密码信息不完整或新密码少于6位' }
  const db = uniCloud.database()
  const result = await db.collection('campus_admins').doc(userId).get()
  const account = result.data[0]
  if (!account) return { code: 404, message: '校园管理员账号不存在' }
  const oldHash = crypto.createHash('sha256').update(oldPassword).digest('hex')
  if (account.passwordHash !== oldHash) return { code: 401, message: '当前密码不正确' }
  const passwordHash = crypto.createHash('sha256').update(newPassword).digest('hex')
  await db.collection('campus_admins').doc(userId).update({ passwordHash, mustChangePassword: false, updatedAt: new Date() })
  return { code: 0 }
}
