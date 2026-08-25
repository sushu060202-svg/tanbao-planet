<template><view class="nav"><view v-for="item in items" :key="item.key" :class="['nav-item',active===item.key?'active':'']" @tap="navigate(item)"><text class="nav-icon">{{item.icon}}</text><text>{{item.label}}</text></view></view></template>
<script>
export default {
  props: { active: { type: String, default: 'home' }, role: { type: String, default: 'personal' } },
  computed: {
    items() {
      if (this.role === 'enterprise') return [{key:'home',label:'首页',icon:'⌂',url:'/pages/enterprise/index'},{key:'products',label:'商品',icon:'▣',url:'/pages/enterprise/products'},{key:'activity',label:'活动',icon:'◫',url:'/pages/enterprise/activities'},{key:'reports',label:'数据',icon:'▥',url:'/pages/enterprise/reports'},{key:'profile',label:'我的',icon:'♙',url:'/pages/enterprise/profile'}]
      if (this.role === 'campus') return [{key:'home',label:'首页',icon:'⌂',url:'/pages/campus/index'},{key:'activity',label:'活动',icon:'◫',url:'/pages/campus/activities'},{key:'rank',label:'数据',icon:'▥',url:'/pages/campus/emissions'},{key:'profile',label:'我的',icon:'♙',url:'/pages/campus/profile'}]
      return [{key:'home',label:'首页',icon:'⌂',url:'/pages/index/index'},{key:'challenge',label:'低碳挑战',icon:'♧',url:'/pages/personal/challenges'},{key:'activity',label:'活动广场',icon:'◫',url:'/pages/personal/activities'},{key:'mall',label:'商城',icon:'▣',url:'/pages/personal/mall'},{key:'profile',label:'个人中心',icon:'♙',url:'/pages/personal/profile'}]
    }
  },
  methods: { navigate(item) { uni.reLaunch({ url: item.url }) } }
}
</script>
<style>.nav{position:fixed;left:0;right:0;bottom:0;z-index:20;display:flex;justify-content:space-around;padding:12rpx 8rpx calc(12rpx + env(safe-area-inset-bottom));background:rgba(247,250,249,.96);box-shadow:0 -8rpx 24rpx rgba(0,0,0,.05);border-radius:28rpx 28rpx 0 0}.nav-item{display:flex;flex-direction:column;align-items:center;justify-content:center;min-width:82rpx;min-height:76rpx;padding:4rpx 8rpx;border-radius:22rpx;color:#53615f;font-size:18rpx}.nav-item.active{color:#00391a;background:#d6e6e3;font-weight:700}.nav-icon{margin-bottom:6rpx;font-size:30rpx;line-height:1}</style>
