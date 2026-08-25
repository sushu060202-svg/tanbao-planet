'use strict'

exports.main = async (event) => {
  const userId = String(event.userId || '').trim()
  if (!userId) return { code: 400, message: '缺少用户信息' }
  const db = uniCloud.database()
  const result = await db.collection('users').doc(userId).get()
  const user = result.data && result.data[0]
  if (!user || user.role !== 'campus') return { code: 403, message: '仅学校管理员可以提交认证' }
  const schoolName = String(event.schoolName || '').trim()
  const adminName = String(event.adminName || '').trim()
  const workNo = String(event.workNo || '').trim()
  const phone = String(event.phone || '').trim()
  if (!schoolName || !adminName || !workNo || !phone) return { code: 400, message: '请完整填写学校和管理员信息' }
  await db.collection('users').doc(userId).update({ schoolName, schoolId: String(event.schoolId || user.schoolId || 'school_001'), campusAdminName: adminName, campusWorkNo: workNo, phone, campusMaterialUrl: String(event.materialUrl || ''), campusVerificationStatus: 'pending', campusVerificationReason: '', updatedAt: new Date() })
  return { code: 0, status: 'pending' }
}
