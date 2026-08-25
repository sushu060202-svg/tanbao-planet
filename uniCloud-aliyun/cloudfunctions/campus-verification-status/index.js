'use strict'

exports.main = async (event) => {
  const userId = String(event.userId || '').trim()
  if (!userId) return { code: 400, message: '缺少用户信息' }
  const result = await uniCloud.database().collection('users').doc(userId).get()
  const user = result.data && result.data[0]
  if (!user || user.role !== 'campus') return { code: 403, message: '校园管理员账号不存在' }
  return { code: 0, data: { status: user.campusVerificationStatus || 'pending', reason: user.campusVerificationReason || '', schoolName: user.schoolName || '', adminName: user.campusAdminName || '', workNo: user.campusWorkNo || '', phone: user.phone || '' } }
}
