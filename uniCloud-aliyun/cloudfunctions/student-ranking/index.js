'use strict'

exports.main = async (event) => {
  const scope = String(event.scope || 'major')
  const studentId = String(event.studentId || '')
  if (!studentId) return { code: 400, message: '缺少学号' }
  const db = uniCloud.database()
  const result = await db.collection('student_profiles').get()
  const students = result.data || []
  const current = students.find(item => String(item.studentId ?? item['学号'] ?? '') === studentId)
  if (!current) return { code: 404, message: '未找到当前学生档案，请检查学号' }
  const school = current.schoolName || current['学校'] || ''
  const college = current.college || current['学院'] || ''
  const major = current.major || current['专业'] || ''
  const className = current.className || current['班级'] || ''
  const same = item => {
    const itemSchool = item.schoolName || item['学校'] || ''
    const itemCollege = item.college || item['学院'] || ''
    const itemMajor = item.major || item['专业'] || ''
    const itemClass = item.className || item['班级'] || ''
    if (scope === 'class') return itemSchool === school && itemCollege === college && itemMajor === major && itemClass === className
    if (scope === 'college') return itemSchool === school && itemCollege === college
    return itemSchool === school && itemCollege === college && itemMajor === major
  }
  const rows = students.filter(item => same(item)).map(item => ({
    id: item._id,
    studentId: String(item.studentId ?? item['学号'] ?? ''),
    name: item.name || item['姓名'] || '未命名学生',
    score: Number(item.totalPoints ?? item['累计积分'] ?? 0),
    isMe: String(item.studentId ?? item['学号'] ?? '') === studentId
  })).sort((a, b) => b.score - a.score || a.studentId.localeCompare(b.studentId)).map((item, index) => ({ ...item, rank: index + 1 }))
  return { code: 0, scope, data: rows, current: { school, college, major, className } }
}
