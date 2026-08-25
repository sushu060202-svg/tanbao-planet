'use strict'
exports.main = async (event) => {
  const db = uniCloud.database()
  const schoolId = event.schoolId || 'school_001'
  const where = event.viewerRole === 'campus'
    ? db.command.and({ status: 'published' }, db.command.or([{ organizerType: 'enterprise' }, { organizerType: 'campus', schoolId }]))
    : { status: 'published', schoolId }
  const result = await db.collection('activities').where(where).orderBy('createdAt', 'desc').get()
  return { code: 0, data: result.data }
}
