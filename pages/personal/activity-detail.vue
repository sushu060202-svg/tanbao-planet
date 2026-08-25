<template>
  <view class="page activity-proof">
    <view class="back" @tap="back">‹</view><view class="head-title">活动凭证</view>
    <view class="card intro"><text class="title">提交活动参与凭证</text><text class="muted">上传现场照片，提交后由对应校园端统一审核。</text></view>
    <text class="label">活动凭证 <text class="required">*</text></text>
    <view class="upload-box" @tap="chooseProof"><image v-if="proof" :src="proof" mode="aspectFill"/><view v-else><text class="upload-icon">＋</text><text class="upload-title">上传活动照片</text><text class="muted">支持 JPG、PNG 格式</text></view></view>
    <text class="label">参与说明</text><textarea class="input note" placeholder="填写本次活动说明..." v-model="remark"/>
    <view class="primary-btn submit" @tap="submit">提交活动凭证</view>
  </view>
</template>
<script>
import { callCloud } from '../../common/cloud.js'
import { toast } from '../../common/mock.js'
export default {
  data() { return { proof: '', proofUrl: '', remark: '', activityId: '', submitting: false } },
  onLoad(options) { this.activityId = options.id || '' },
  methods: {
    back() { uni.navigateBack() },
    chooseProof() { uni.chooseImage({ count: 1, sizeType: ['compressed'], sourceType: ['album', 'camera'], success: result => { this.proof = result.tempFilePaths[0] } }) },
    async submit() {
      if (this.submitting) return
      if (!this.proof || !this.activityId) return toast('请上传活动凭证')
      const user = uni.getStorageSync('user_session') || {}
      if (!user.id) return toast('请先登录')
      this.submitting = true
      try {
        const upload = await uniCloud.uploadFile({ filePath: this.proof, cloudPath: `activity-proofs/${user.id}/${Date.now()}.jpg` })
        this.proofUrl = upload.fileID
        await callCloud('activity-submission-create', { activityId: this.activityId, userId: user.id, schoolId: uni.getStorageSync('user_school_id') || 'school_001', image: this.proofUrl, remark: this.remark })
        toast('凭证已提交，等待校园端审核')
        setTimeout(() => uni.navigateBack(), 500)
      } catch (error) { toast(error.message || '提交失败') } finally { this.submitting = false }
    }
  }
}
</script>
<style lang="scss">
@import '../../common/portal.scss';
.back{font-size:58rpx}.head-title{text-align:center;margin-top:-60rpx;color:#006d37;font-size:38rpx;font-weight:700}.intro{margin-top:64rpx}.label{display:block;margin:36rpx 8rpx 14rpx;color:#53615f;font-size:25rpx}.required{color:#ba1a1a}.upload-box{display:flex;align-items:center;justify-content:center;height:360rpx;border:4rpx dashed #b8dfc5;border-radius:22rpx;background:#fff;text-align:center}.upload-box image{width:100%;height:100%;border-radius:18rpx}.upload-icon,.upload-title,.upload-box .muted{display:block}.upload-icon{color:#56b36c;font-size:56rpx}.upload-title{margin-top:10rpx;color:#56b36c;font-size:28rpx}.note{height:210rpx}.submit{margin-top:80rpx;height:100rpx;border-radius:52rpx}
</style>
