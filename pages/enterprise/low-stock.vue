<template>
  <view class="page"><view class="head"><text class="title">低库存商品</text><text class="subtitle">当前企业库存少于 50 件的商品</text></view><view v-for="item in list" :key="item.id" class="card product"><image v-if="item.image" :src="item.image" mode="aspectFill"/><view class="product-info"><text class="name">{{ item.name }}</text><text class="stock">库存：{{ item.stock }} 件</text><text class="muted">所需积分：{{ item.points }} · 预计减碳：{{ item.carbonReduction || 0 }} kg CO2</text></view></view><view v-if="!list.length" class="empty card">暂无低库存商品</view></view>
</template>
<script>
import { callCloud } from '../../common/cloud.js'
export default { data() { return { list: [] } }, onShow() { const enterpriseId = uni.getStorageSync('user_session')?.id || 'enterprise_demo'; callCloud('enterprise-overview', { enterpriseId }).then(result => { this.list = (result.pending && result.pending.lowStockProducts) || [] }).catch(() => { this.list = [] }) } }
</script>
<style lang="scss">@import '../../common/portal.scss';.product{display:flex;gap:20rpx;margin-bottom:18rpx}.product image{width:150rpx;height:150rpx;border-radius:18rpx}.product-info{flex:1}.name{display:block;font-size:29rpx;font-weight:700}.stock{display:block;margin-top:18rpx;color:#c44b42;font-size:25rpx}.muted{display:block;margin-top:12rpx;font-size:21rpx}.empty{text-align:center}</style>
