'use strict'
exports.main = async (event) => {
  const { userId, schoolId, schoolName, college, major, className, receiverName, phone, address } = event
  if (!userId || !schoolId) return { code: 400, message: '请选择学校' }
  const db = uniCloud.database()
  const school = await db.collection('schools').doc(schoolId).get()
  if (!school.data.length && schoolId !== 'school_001') return { code: 404, message: '学校不存在' }
  await db.collection('users').doc(userId).update({ schoolId, schoolName, college, major, className, receiverName, phone, address })
  return { code: 0, schoolId }
}
