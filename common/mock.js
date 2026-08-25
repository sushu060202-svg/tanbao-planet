export const identityKey = 'user_identity'

export const challenges = [
  { id: 1, icon: '☼', title: '光盘行动', desc: '连续完成 5 天光盘打卡，减少食物浪费', reward: 50, progress: 3, target: 5, status: 'in_progress' },
  { id: 2, icon: '♧', title: '单车出行', desc: '骑行完成一次绿色出行', reward: 100, progress: 0, target: 1, status: 'not_started' },
  { id: 3, icon: '▣', title: '拒用塑料袋', desc: '购物时坚持使用可循环购物袋', reward: 30, progress: 0, target: 3, status: 'not_started' },
  { id: 4, icon: '♻', title: '垃圾分类达人', desc: '完成 5 次正确垃圾分类打卡', reward: 80, progress: 5, target: 5, status: 'completed' }
]

export const activities = [
  { id: 1, title: '校园废品回收周', organizer: '环保社团', type: '校园活动', time: '2026-08-25 至 08-31', location: '南区操场', reward: 80, status: 'open', desc: '参与校园废品回收行动，完成纸张、塑料瓶等可回收物分类投放。' },
  { id: 2, title: '个人植树行动倡议', organizer: '张三（软件工程）', type: '个人申请', time: '2026-08-28', location: '东区绿化带', reward: 60, status: 'pending', desc: '申请在东区绿化带进行个人植树活动，完成后获得校园场地许可及碳积分奖励。' },
  { id: 3, title: '绿色骑行日', organizer: '绿色品牌联合发起', type: '企业活动', time: '2026-09-01', location: '校园北门', reward: 100, status: 'open', desc: '骑行打卡并上传绿色出行记录，领取企业联名环保权益。' }
]

export const products = [
  { id: 1, name: '碳宝星球环保水杯', category: '联名周边', points: 300, stock: 36, icon: '♧', desc: '减少一次性塑料杯使用，随身携带更环保。' },
  { id: 2, name: '绿色品牌优惠券', category: '企业权益', points: 180, stock: 80, icon: '◇', desc: '兑换合作品牌低碳生活优惠权益。' },
  { id: 3, name: '公益植树证书', category: '公益证书', points: 100, stock: 999, icon: '✿', desc: '用积分支持校园公益植树项目。' }
]

export function go(url) { uni.navigateTo({ url }) }
export function toast(title) { uni.showToast({ title, icon: 'none' }) }
export function currentIdentity() { return uni.getStorageSync(identityKey) || 'personal' }
