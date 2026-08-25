<template>
  <view class="page audit-page">
    <view class="campus-brand"><text>{{ labels.brand }}</text><text>{{ labels.switch }}</text></view>
    <view class="head"><text class="title">{{ labels.title }}</text><text class="subtitle">{{ labels.subtitle }}</text></view>
    <view class="tabs"><text :class="{ selected: status === 'pending' }" @tap="changeStatus('pending')">{{ labels.pending }}</text><text :class="{ selected: status === 'processed' }" @tap="changeStatus('processed')">{{ labels.processed }}</text></view>
    <view v-for="item in list" :key="item._id" class="card evidence">
      <view class="row"><view><text class="name">{{ item.name }}</text><text class="muted">{{ item.username || labels.unbound }} · {{ item.activityTitle }}</text></view><text class="tag">{{ item.status === 'pending' ? labels.pending : item.status === 'approved' ? labels.approved : labels.rejected }}</text></view>
      <view class="evidence-box"><image v-if="item.image" :src="item.image" mode="aspectFill"/><text v-else>{{ labels.noImage }}</text></view>
      <text class="desc">{{ item.remark || labels.noRemark }}</text>
      <view v-if="item.status === 'pending'" class="row actions"><view class="primary-btn" @tap="audit(item, 'approved')">{{ labels.approve }}</view><view class="outline-btn reject" @tap="reject(item)">{{ labels.reject }}</view></view>
    </view>
    <view v-if="!list.length" class="empty card">{{ labels.empty }}</view>
    <BottomNav role="campus" active="home" />
  </view>
</template>
<script>
import { callCloud } from '../../common/cloud.js'
import { toast } from '../../common/mock.js'
import BottomNav from '../../components/BottomNav.vue'
const labels = { brand: '\u6821\u56ed\u78b3\u4e2d\u548c\u7ba1\u7406\u7cfb\u7edf', switch: '\u5207\u6362\u8d26\u53f7', title: '\u51ed\u8bc1\u79ef\u5206\u5ba1\u6838', subtitle: '\u7edf\u4e00\u5ba1\u6838\u6240\u6709\u6d3b\u52a8\u51ed\u8bc1', pending: '\u5f85\u5ba1\u6838', processed: '\u5df2\u5904\u7406', approved: '\u5df2\u901a\u8fc7', rejected: '\u5df2\u9a73\u56de', approve: '\u5ba1\u6838\u901a\u8fc7', reject: '\u9a73\u56de', noImage: '\u6682\u65e0\u51ed\u8bc1\u56fe\u7247', noRemark: '\u672a\u586b\u5199\u8bf4\u660e', unbound: '\u672a\u7ed1\u5b9a\u5b66\u53f7', empty: '\u6682\u65e0\u5f85\u5904\u7406\u51ed\u8bc1' }
export default {
  components: { BottomNav }, data() { return { labels, list: [], status: 'pending' } }, onShow() { this.load() },
  methods: {
    changeStatus(status) { this.status = status; this.load() },
    async load() { try { const result = await callCloud('activity-submission-list', { schoolId: uni.getStorageSync('user_school_id') || 'school_001', status: this.status === 'pending' ? 'pending' : undefined }); this.list = result.data || [] } catch (error) { this.list = []; toast(error.message || 'load failed') } },
    async audit(item, result, reason = '') { try { await callCloud('activity-submission-audit', { submissionId: item._id, auditorId: uni.getStorageSync('user_session')?.id || 'campus_demo', result, reason }); toast(result === 'approved' ? this.labels.approved : this.labels.rejected); this.load() } catch (error) { toast(error.message || 'audit failed') } },
    reject(item) { uni.showModal({ title: this.labels.reject, editable: true, placeholderText: this.labels.noRemark, success: result => { if (result.confirm && result.content) this.audit(item, 'rejected', result.content) } }) }
  }
}
</script>
<style lang="scss">
@import '../../common/portal.scss';
.campus-brand{display:flex;justify-content:space-between;padding:18rpx 0 28rpx;color:#277a43;font-size:25rpx;font-weight:700}.head{padding:28rpx 4rpx}.head .title{font-size:48rpx}.tabs{display:flex;gap:18rpx;margin-bottom:24rpx}.tabs text{padding:16rpx 28rpx;border-radius:28rpx;background:#e6e9e8;color:#53615f}.tabs .selected{background:#53b36e;color:#fff}.evidence{margin-bottom:20rpx}.name{display:block;font-size:29rpx;font-weight:700}.evidence-box{margin-top:18rpx;padding:16rpx;background:#f1f5f2;border-radius:16rpx;text-align:center;color:#89958e}.evidence-box image{display:block;width:100%;height:300rpx;border-radius:12rpx}.desc{display:block;margin:18rpx 0;color:#53615f}.actions{gap:16rpx}.actions view{flex:1;text-align:center}.reject{border-color:#c94b43;color:#c94b43}.empty{text-align:center;color:#89958e}
</style>
