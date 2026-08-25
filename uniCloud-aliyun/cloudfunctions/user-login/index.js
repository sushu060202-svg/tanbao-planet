'use strict'
const crypto = require('crypto')

exports.main = async (event) => {
  const username = String(event.username || '').trim()
  const password = String(event.password || '')
  if (!username || !password) return { code: 400, message: '请输入用户名和密码' }
  const db = uniCloud.database()
  const passwordHash = crypto.createHash('sha256').update(password).digest('hex')
  const campusResult = await db.collection('campus_admins').where({ username }).limit(1).get()
  const campusAdmin = campusResult.data[0]
  if (campusAdmin) {
    if (campusAdmin.passwordHash !== passwordHash) return { code: 401, message: '用户名或密码不正确' }
    if (campusAdmin.status !== 'enabled') return { code: 403, message: '校园管理员账号尚未启用' }
    return { code: 0, user: { id: campusAdmin._id, username: campusAdmin.username, role: 'campus', schoolId: campusAdmin.schoolId, schoolName: campusAdmin.schoolName, nickname: campusAdmin.name, campusAdminName: campusAdmin.name, campusWorkNo: campusAdmin.workNo, department: campusAdmin.department || '', phone: campusAdmin.phone || '', avatar: '/static/avatar-carbon.svg', points: 0, campusVerificationStatus: 'approved' } }
  }
  const profileResult = await db.collection('student_profiles').where({ studentId: username }).limit(1).get()
  const profile = profileResult.data[0]
  const defaultInitialPassword = 'Tanbao@2026'
  if (profile) {
    if (profile.status === 'disabled') return { code: 403, message: '该学生档案已停用' }
    const passwordMatches = profile.passwordHash
      ? profile.passwordHash === passwordHash || profile.initialPassword === password
      : password === (profile.initialPassword || defaultInitialPassword)
    if (!passwordMatches) return { code: 401, message: '用户名或密码不正确' }
    const student = { name: profile.name || '', schoolId: profile.schoolId || 'school_001', schoolName: profile.schoolName || '', college: profile.college || '', major: profile.major || '', className: profile.className || '', points: Number(profile.totalPoints || 0) }
    return { code: 0, user: buildUser({ _id: profile._id, username: profile.studentId, role: 'personal', ...student, nickname: student.name, avatar: '/static/avatar-carbon.svg' }) }
  }
  const result = await db.collection('users').where({ username }).limit(1).get()
  const existing = result.data[0]
  if (existing) {
    if (existing.passwordHash !== passwordHash) return { code: 401, message: '用户名或密码不正确' }
    if (existing.role === 'campus' && existing.campusVerificationStatus !== 'approved') return { code: 403, message: '校园管理员账号尚未由后台启用' }
    return { code: 0, user: buildUser(existing) }
  }
  return { code: 401, message: '用户名或密码不正确' }
}

function buildUser(user) {
  return { id: user._id, username: user.username, role: user.role, schoolId: user.schoolId || '', schoolName: user.schoolName || '', college: user.college || '', major: user.major || '', className: user.className || '', nickname: user.nickname || '', avatar: user.avatar || '/static/avatar-carbon.svg', points: Number(user.points || 0), campusVerificationStatus: user.campusVerificationStatus || '', campusVerificationReason: user.campusVerificationReason || '', campusAdminName: user.campusAdminName || '', campusWorkNo: user.campusWorkNo || '', phone: user.phone || '' }
}
