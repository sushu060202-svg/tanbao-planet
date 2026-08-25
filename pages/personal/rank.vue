<template>
  <view class="page rank-page">
    <view class="topbar"><text class="back" @tap="back">‹</text><text class="topbar-title">排名分析</text><view class="placeholder" /></view>
    <view class="head"><text class="eyebrow">校园激励</text><text class="title">排名分析</text><text class="subtitle">按照导入学生档案中的累计积分排名</text></view>
    <view class="scope-tabs"><text v-for="item in scopes" :key="item.key" :class="['scope-tab', { selected: scope === item.key }]" @tap="changeScope(item.key)">{{ item.label }}</text></view>
    <view v-if="scopeName" class="scope-info"><text>{{ scopeName }}</text><text class="muted">共 {{ rows.length }} 人</text></view>
    <view v-if="loading" class="empty card">正在读取学生档案排名…</view>
    <view v-else-if="error" class="empty card">{{ error }}</view>
    <view v-else-if="!rows.length" class="empty card">暂无排名数据</view>
    <block v-else>
      <view class="podium"><view v-for="item in topThree" :key="item.id" :class="['podium-item', item.rank === 1 ? 'first' : '']"><text class="medal">{{ medals[item.rank - 1] }}</text><text>{{ item.name }}</text><text class="podium-score">{{ item.score }} 分</text></view></view>
      <view class="rank-card card"><view v-for="item in remaining" :key="item.id" class="rank-row"><text class="number">{{ item.rank }}</text><view class="rank-avatar">{{ item.name.slice(0, 1) }}</view><text class="rank-name">{{ item.name }}<text v-if="item.isMe" class="me">（我）</text></text><text class="rank-score">{{ item.score }} 分</text></view></view>
    </block>
    <BottomNav active="profile" />
  </view>
</template>

<script>
import BottomNav from '../../components/BottomNav.vue'
import { callCloud } from '../../common/cloud.js'
export default {
  components: { BottomNav },
  data() { return { scope: 'major', scopes: [{ key: 'major', label: '专业' }, { key: 'college', label: '学院' }, { key: 'class', label: '班级' }], rows: [], scopeName: '', loading: false, error: '', medals: ['🥇', '🥈', '🥉'] } },
  computed: { topThree() { return this.rows.slice(0, 3) }, remaining() { return this.rows.slice(3) } },
  onShow() { this.loadRanking() },
  methods: {
    changeScope(scope) { this.scope = scope; this.loadRanking() },
    async loadRanking() {
      const session = uni.getStorageSync('user_session') || {}
      const studentId = session.username || uni.getStorageSync('user_student_id') || ''
      if (!studentId) { this.error = '当前账号没有学号，无法查询排名'; return }
      this.loading = true; this.error = ''
      try { const result = await callCloud('student-ranking', { studentId, scope: this.scope }); this.rows = result.data || []; const current = result.current || {}; this.scopeName = this.scope === 'class' ? current.className : this.scope === 'college' ? current.college : current.major } catch (error) { this.rows = []; this.error = error.message || '排名读取失败' } finally { this.loading = false }
    },
    back() { uni.navigateBack() }
  }
}
</script>

<style lang="scss">
@import '../../common/portal.scss';
.rank-page { padding-bottom:150rpx; }.topbar{display:flex;align-items:center;justify-content:space-between;height:88rpx}.back{width:64rpx;font-size:70rpx}.topbar-title{font-size:32rpx}.placeholder{width:64rpx}.head{padding:25rpx 0}.eyebrow{display:block;color:#4c8b61;font-size:25rpx}.title{display:block;margin-top:10rpx;font-size:52rpx;font-weight:700}.subtitle{display:block;margin-top:10rpx;color:#7a8980;font-size:25rpx}.scope-tabs{display:flex;padding:8rpx;border-radius:44rpx;background:#e5e9e7}.scope-tab{flex:1;padding:18rpx 8rpx;border-radius:36rpx;color:#53615f;text-align:center;font-size:25rpx}.scope-tab.selected{color:#fff;background:#26743e}.scope-info{display:flex;justify-content:space-between;margin:25rpx 6rpx;color:#397a4f;font-size:25rpx}.podium{display:flex;align-items:flex-end;justify-content:space-around;margin:28rpx 0;padding:30rpx 15rpx 24rpx;border-radius:30rpx;background:linear-gradient(180deg,#d8efe3,#fff)}.podium-item{display:flex;flex-direction:column;align-items:center;color:#53615f;font-size:22rpx}.podium-item.first{transform:translateY(-26rpx)}.medal{font-size:48rpx}.podium-score{margin-top:8rpx;color:#486856;font-size:26rpx;font-weight:700}.rank-card{padding:16rpx 28rpx}.rank-row{display:flex;align-items:center;padding:24rpx 0;border-bottom:1rpx solid #edf1ef}.number{width:52rpx;color:#8c9a92;font-size:25rpx}.rank-avatar{display:flex;align-items:center;justify-content:center;width:58rpx;height:58rpx;margin-right:16rpx;border-radius:50%;background:#dceae5;color:#277346;font-size:28rpx}.rank-name{flex:1;color:#3d4a3f;font-size:26rpx}.me{color:#7d8d83;font-size:21rpx}.rank-score{color:#26743e;font-size:25rpx;font-weight:700}.empty{margin-top:28rpx;padding:55rpx 25rpx;color:#8a978f;text-align:center;font-size:24rpx}
</style>
