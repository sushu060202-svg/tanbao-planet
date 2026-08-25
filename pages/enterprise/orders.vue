<template>
  <view class="page"><view class="head"><text class="title">企业订单</text><text class="subtitle">查看本企业商品兑换订单和收货信息</text></view><view v-for="item in list" :key="item._id" class="card order"><view class="row"><text class="name">{{ item.productName }}</text><text class="tag">{{ item.status }}</text></view><text class="muted">兑换用户：{{ item.receiverName || item.userId }}</text><text class="muted">电话：{{ item.phone }}</text><text class="muted">地址：{{ item.address }}</text><text class="muted">积分：{{ item.points }}</text></view><view v-if="!list.length" class="empty card">暂无订单</view></view>
</template>
<script>
import { callCloud } from '../../common/cloud.js'
export default { data() { return { list: [] } }, onShow() { const enterpriseId = uni.getStorageSync('user_session')?.id || 'enterprise_demo'; callCloud('order-list', { enterpriseId }).then(result => { this.list = result.data || [] }).catch(() => { this.list = [] }) } }
</script>
<style lang="scss">@import '../../common/portal.scss';.order{margin-bottom:18rpx}.name{font-size:28rpx;font-weight:700}.muted{display:block;margin-top:10rpx}.tag{color:#26763f}</style>
