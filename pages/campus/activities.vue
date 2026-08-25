<template>
  <view class="page">
    <view class="head"><text class="eyebrow">校园碳中和管理系统</text><text class="title">全部低碳活动</text><text class="subtitle">当前学校发布及合作企业活动</text></view>
    <view class="tabs"><text v-for="tab in tabs" :key="tab.key" :class="{ selected: current === tab.key }" @tap="current = tab.key">{{ tab.label }}</text></view>
    <view v-if="filtered.length"><view v-for="item in filtered" :key="item._id" class="activity card" @tap="open(item)"><view class="row"><view><text class="activity-title">{{ item.title }}</text><text class="source">{{ sourceText(item.organizerType) }} · {{ dateRange(item) }}</text></view><text class="tag">{{ statusText(item) }}</text></view><text class="desc">{{ item.desc }}</text><text class="location">地点：{{ item.location || '待定' }}</text></view></view>
    <view v-else class="empty card">暂无符合条件的活动</view>
    <BottomNav role="campus" active="activity" />
  </view>
</template>
<script>
import BottomNav from '../../components/BottomNav.vue'
import { callCloud } from '../../common/cloud.js'
export default {
  components: { BottomNav },
  data() { return { list: [], current: 'all', tabs: [{ key: 'all', label: '全部' }, { key: 'ongoing', label: '进行中' }, { key: 'ended', label: '已结束' }] } },
  computed: { filtered() { return this.list.filter(item => this.current === 'all' || (this.current === 'ongoing' && this.isOngoing(item)) || (this.current === 'ended' && this.isEnded(item))) } },
  onShow() { const schoolId = uni.getStorageSync('user_school_id') || 'school_001'; callCloud('activity-list', { schoolId, viewerRole: 'campus' }).then(result => { this.list = result.data || [] }).catch(() => { this.list = [] }) },
  methods: {
    dateRange(item) { const start = item.startAt || item.date; const end = item.endAt || item.startAt || item.date; return start && end ? `${start} 至 ${end}` : '未设置日期' },
    dateValue(value) { if (!value) return null; const date = new Date(String(value).replace(/-/g, '/')); return Number.isNaN(date.getTime()) ? null : date },
    isOngoing(item) { const end = this.dateValue(item.endAt || item.startAt || item.date); return !end || end >= new Date() },
    isEnded(item) { const end = this.dateValue(item.endAt || item.startAt || item.date); return Boolean(end && end < new Date()) },
    statusText(item) { return this.isEnded(item) ? '已结束' : '进行中' },
    sourceText(type) { return type === 'enterprise' ? '企业合作' : '校园官方' },
    open(item) { uni.navigateTo({ url: `/pages/campus/activity-participants?id=${item._id}` }) }
  }
}
</script>
<style lang="scss">
@import '../../common/portal.scss';
.tabs { display: flex; gap: 16rpx; margin: 10rpx 0 26rpx; }
.tabs text { padding: 18rpx 26rpx; border-radius: 40rpx; background: #e6e9e8; color: #53615f; font-size: 24rpx; }
.tabs .selected { background: #55b56d; color: #fff; }
.activity { margin-bottom: 18rpx; }
.activity-title { display: block; color: #17231b; font-size: 29rpx; font-weight: 700; }
.source { display: block; margin-top: 12rpx; color: #6d7a6e; font-size: 22rpx; }
.tag { white-space: nowrap; }
.desc { display: block; margin-top: 18rpx; color: #53615f; font-size: 23rpx; line-height: 1.6; }
.location { display: block; margin-top: 16rpx; color: #6d7a6e; font-size: 22rpx; }
.empty { text-align: center; color: #89958e; }
</style>
