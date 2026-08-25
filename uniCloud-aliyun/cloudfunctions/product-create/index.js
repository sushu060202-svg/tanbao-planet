'use strict'
exports.main = async (event) => {
  const { name, description = '', category = '绿色权益', icon = '', image = '', carbonLabel = '', carbonReduction = 0, points, stock, enterpriseId } = event
  if (!name || !enterpriseId || Number(points) < 0 || Number(stock) < 0) return { code: 400, message: '商品信息不完整' }
  const db = uniCloud.database()
  const accountResult = await db.collection('enterprise_accounts').where({ userId: enterpriseId }).get()
  const account = accountResult.data[0]
  if (!account || account.accountStatus !== 'active' || account.certificationStatus !== 'approved') return { code: 403, message: '企业认证通过后才能发布商品' }
  const result = await db.collection('products').add({ name, description, category, icon, image, carbonLabel, carbonReduction: Number(carbonReduction), points: Number(points), stock: Number(stock), enterpriseId, status: 'on_sale', createdAt: new Date() })
  return { code: 0, productId: result.id }
}
