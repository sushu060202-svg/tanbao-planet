<template>
  <view class="page audit-page">
    <view class="campus-brand"><text>校园碳中和管理系统</text><text>切换账号</text></view>
    <view class="head"><text class="title">凭证积分审核</text><text class="subtitle">统一审核校园官方和企业合作活动凭证</text></view>
    <view class="tabs"><text :class="{ selected: status === 'pending' }" @tap="status = 'pending'; load()">待审核</text><text :class="{ selected: status === 'processed' }" @tap="status = 'processed'; load()">已处理</text></view>
    <view v-for="item in list" :key="item._id" class="evidence card">
      <view class="row"><view><text class="name">{{ item.name }}</text><text class="muted">学号：{{ item.username || '未绑定' }} · {{ item.activityTitle }}</text></view><text class="tag">{{ item.status === 'pending' ? '待审核' : item.status === 'approved' ? '已通过' : '已驳回' }}</text></view>
      <view class="evidence-box"><text class="evidence-title">活动凭证</text><image v-if="item.image" :src="item.image" mode="aspectFill" /><view v-else class="image-placeholder">暂无凭证图片</view></view>
      <text class="desc">{{ item.remark || '学生未填写说明' }}</text>
      <view v-if="item.status === 'pending'" class="row actions"><view class="primary-btn" @tap="audit(item, 'approved')">审核通过</view><view class="outline-btn reject" @tap="reject(item)">驳回</view></view>
    </view>
    <view v-if="!list.length" class="empty card">暂无{{ status === 'pending' ? '待审核' : '已处理' }}凭证</view>
    <BottomNav role="campus" active="home" />
  </view>
</template>
<script>
import { callCloud } from '../../common/cloud.js'
import { toast } from '../../common/mock.js'
import BottomNav from '../../components/BottomNav.vue'
export default {
  components: { BottomNav }, data() { return { list: [], status: 'pending' } },
  onShow() { this.load() },
  methods: {
    async load() { try { const result = await callCloud('activity-submission-list', { schoolId: uni.getStorageSync('user_school_id') || 'school_001', status: this.status === 'pending' ? 'pending' : undefined }); this.list = result.data || [] } catch (error) { this.list = []; toast(error.message || '加载审核记录失败') } },
    async audit(item, result, reason = '') { try { await callCloud('activity-submission-audit', { submissionId: item._id, auditorId: uni.getStorageSync('user_session')?.id || 'campus_demo', result, reason }); toast(result === 'approved' ? '审核通过，积分已发放' : '已驳回'); this.load() } catch (error) { toast(error.message || '审核失败') } },
    reject(item) { uni.showModal({ title: '驳回凭证', editable: true, placeholderText: '请输入驳回原因', success: result => { if (result.confirm && result.content) this.audit(item, 'rejected', result.content) } }) }
  }
}
</script>
<style lang="scss">
@import '../../common/portal.scss';
.tabs { display: flex; gap: 50rpx; margin: 24rpx 0; border-bottom: 1rpx solid #dce5df; }.tabs text { padding: 20rpx 28rpx; color: #6d7a6e; }.tabs .selected { color: #26763f; border-bottom: 5rpx solid #26763f; }.evidence { margin-bottom: 20rpx; }.name { display: block; font-size: 28rpx; font-weight: 700; }.evidence-box { margin-top: 20rpx; padding: 18rpx; background: #f1f5f2; border-radius: 16rpx; }.evidence-box image { display: block; width: 100%; height: 300rpx; margin-top: 12rpx; border-radius: 12rpx; }.image-placeholder { display: block; padding: 100rpx 0; color: #8b9790; text-align: center; }.desc { display: block; margin: 16rpx 0; color: #53615f; }.actions { gap: 18rpx; }.actions > view { flex: 1; text-align: center; }.reject { color: #b83a32; border-color: #b83a32; }
</style>
