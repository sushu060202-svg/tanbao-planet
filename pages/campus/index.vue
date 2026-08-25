<template>
  <view class="page campus">
    <view class="brand"><view class="leaf">✦</view><view><text class="brand-title">校园碳中和管理系统</text><text class="school">{{ schoolName }}</text></view></view>
    <view class="stats grid-2">
      <view class="metric carbon-card"><text class="metric-label">累计碳减排总量</text><text class="metric-value">{{ summary.total }} <text class="unit">kg CO2</text></text><view class="progress"><view :style="{ width: summary.progress + '%' }"></view></view><text class="muted right">年度目标完成 {{ summary.progress }}%</text></view>
      <view class="metric"><text class="metric-label">师生参与人数</text><text class="metric-value">{{ participantCount }}</text></view>
    </view>
    <view class="section-title">核心管理</view>
    <view class="management">
      <view class="manage-card featured" @tap="open('/pages/campus/activity-create')"><view class="manage-icon">↗</view><view><text class="manage-title">创建官方活动</text><text class="manage-desc">发布全校性环保倡议或挑战</text></view><text class="arrow">›</text></view>
      <view class="manage-card" @tap="open('/pages/campus/audit')"><view class="manage-icon">☑</view><view><text class="manage-title">凭证积分审核</text><text class="manage-desc">统一审核学生打卡与活动积分凭证</text></view><text class="arrow">›</text></view>
      <view class="manage-card ai-manage" @tap="open('/pages/personal/ai')"><view class="manage-icon">✦</view><view><text class="manage-title">碳宝AI</text><text class="manage-desc">咨询校园碳排放和环保管理问题</text></view><text class="arrow">›</text></view>
    </view>
    <BottomNav role="campus" active="home" />
  </view>
</template>
<script>
import BottomNav from '../../components/BottomNav.vue'
import { callCloud } from '../../common/cloud.js'
export default { components: { BottomNav }, data() { return { schoolName: '', participantCount: 0, summary: { total: 0, progress: 0 } } }, onShow() { const user = uni.getStorageSync('user_session') || {}; this.schoolName = user.schoolName || '当前管理学校'; callCloud('campus-carbon-summary', { schoolId: user.schoolId || 'school_001' }).then(result => { this.summary = result; this.participantCount = Number(result.participantCount || 0) }).catch(() => {}) }, methods: { open(url) { uni.navigateTo({ url }) } } }
</script>
<style lang="scss">@import '../../common/portal.scss';.campus{padding-left:24rpx;padding-right:24rpx}.brand{display:flex;align-items:center;padding:18rpx 0 28rpx;border-bottom:1rpx solid #e8efeb}.leaf{color:#277a43;font-size:45rpx;margin-right:14rpx}.brand-title{display:block;color:#277a43;font-size:34rpx;font-weight:700}.school{display:block;margin-top:6rpx;color:#7d8a82;font-size:21rpx}.stats{margin-top:26rpx}.metric{min-height:150rpx}.carbon-card{grid-column:1 / -1}.metric-value{display:block;margin-top:12rpx;font-size:37rpx;font-weight:700;color:#006d37}.unit{font-size:22rpx;font-weight:400}.progress{height:14rpx;margin-top:18rpx;border-radius:20rpx;background:#e5ebe8;overflow:hidden}.progress view{height:100%;background:#34814b}.right{display:block;margin-top:10rpx;text-align:right}.section-title{margin:34rpx 4rpx 16rpx;font-size:34rpx;font-weight:700}.management{display:flex;flex-direction:column;gap:16rpx}.manage-card{display:flex;align-items:center;min-height:148rpx;padding:0 26rpx;border:2rpx solid #e5ece8;border-radius:30rpx;background:#fff}.manage-card.featured{color:#fff;background:#28743d}.manage-icon{display:flex;align-items:center;justify-content:center;width:78rpx;height:78rpx;margin-right:24rpx;border-radius:22rpx;background:#e8f5ef;color:#277a43;font-size:38rpx}.featured .manage-icon{background:rgba(255,255,255,.2);color:#fff}.manage-title{display:block;font-size:31rpx;font-weight:700}.manage-desc{display:block;margin-top:8rpx;color:#7b8881;font-size:21rpx}.featured .manage-desc{color:#e4f3e9}.arrow{margin-left:auto;font-size:48rpx}</style>
