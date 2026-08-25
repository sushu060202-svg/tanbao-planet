export function callCloud(name, data = {}) {
  return new Promise((resolve, reject) => {
    uniCloud.callFunction({ name, data, success: res => {
      const result = res.result || {}
      if (result.code && result.code !== 0) return reject(new Error(result.message || '操作失败'))
      resolve(result)
    }, fail: reject })
  })
}

export function saveUserSession(user) {
  uni.setStorageSync('user_session', user)
  uni.setStorageSync('user_identity', user.role)
  uni.setStorageSync('user_school_id', user.schoolId || 'school_001')
  uni.setStorageSync('user_school_name', user.schoolName || '')
  uni.setStorageSync('user_college', user.college || '')
  uni.setStorageSync('user_major', user.major || '')
  uni.setStorageSync('user_class_name', user.className || '')
  uni.setStorageSync('user_points', Number(user.points || 0))
  uni.setStorageSync('user_nickname', user.nickname || user.username)
  uni.setStorageSync('user_avatar', user.avatar || '/static/avatar-carbon.svg')
}

export function roleHome(role) {
  return role === 'enterprise' ? '/pages/enterprise/index' : role === 'campus' ? '/pages/campus/index' : '/pages/index/index'
}
