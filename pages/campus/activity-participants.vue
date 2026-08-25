<template>
  <view class="page">
    <view class="head"><text class="eyebrow">{{ labels.eyebrow }}</text><text class="title">{{ activity.title || labels.loading }}</text><text class="subtitle">{{ activity.startAt || labels.noDate }} {{ labels.to }} {{ activity.endAt || activity.startAt || labels.noDate }}</text></view>
    <view class="stats card"><text>{{ labels.registered }} {{ list.length }}</text><text>{{ labels.submitted }} {{ submittedCount }}</text><text>{{ labels.approved }} {{ approvedCount }}</text></view>
    <view v-for="item in list" :key="item._id" class="participant card"><view><text class="name">{{ item.name }}</text><text class="muted">{{ labels.studentId }}{{ item.username || labels.unbound }}</text></view><text class="tag">{{ statusText(item.status) }}</text></view>
    <view v-if="!list.length" class="empty card">{{ labels.empty }}</view>
  </view>
</template>
<script>
import { callCloud } from '../../common/cloud.js'
const labels = { eyebrow: '\u6d3b\u52a8\u53c2\u4e0e\u60c5\u51b5', loading: '\u52a0\u8f7d\u4e2d', noDate: '\u672a\u8bbe\u7f6e\u65e5\u671f', to: '\u81f3', registered: '\u62a5\u540d\u4eba\u6570', submitted: '\u5df2\u63d0\u4ea4', approved: '\u5df2\u901a\u8fc7', studentId: '\u5b66\u53f7\uff1a', unbound: '\u672a\u7ed1\u5b9a', empty: '\u6682\u65e0\u5b66\u751f\u53c2\u4e0e' }
export default {
  data() { return { activity: {}, list: [], activityId: '', labels } },
  onLoad(options) { this.activityId = options.id || '' },
  onShow() { if (!this.activityId) return; callCloud('activity-participants', { activityId: this.activityId }).then(result => { this.activity = result.activity || {}; this.list = result.data || [] }).catch(() => { this.list = [] }) },
  computed: { submittedCount() { return this.list.filter(item => ['submitted', 'approved', 'rejected'].includes(item.status)).length }, approvedCount() { return this.list.filter(item => item.status === 'approved').length } },
  methods: { statusText(status) { return status === 'approved' ? '\u5df2\u901a\u8fc7' : status === 'rejected' ? '\u5df2\u9a73\u56de' : status === 'submitted' ? '\u5f85\u5ba1\u6838' : '\u5df2\u62a5\u540d' } }
}
</script>
<style lang="scss">
@import '../../common/portal.scss';
.stats{display:flex;justify-content:space-between;margin:20rpx 0}.participant{display:flex;justify-content:space-between;margin-bottom:16rpx}.name{display:block;font-size:28rpx;font-weight:700}.tag{color:#26763f}
</style>
