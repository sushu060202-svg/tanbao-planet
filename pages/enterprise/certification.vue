<template>
  <view class="page">
    <view class="head"><text class="eyebrow">企业中心</text><text class="title">企业认证材料</text><text class="subtitle">上传材料后由后台审核确认</text></view>
    <view v-for="item in materials" :key="item.key" class="material card">
      <view class="row"><view><text class="material-title">{{ item.title }}</text><text class="muted">{{ item.desc }}</text></view><text :class="['status', item.file ? 'uploaded' : '']">{{ item.file ? '已上传' : '待上传' }}</text></view>
      <view v-if="item.file" class="file-row"><text>▣ {{ item.file }}</text><text class="remove" @tap="remove(item)">删除</text></view>
      <view class="outline-btn upload" @tap="upload(item)">{{ item.file ? '重新上传' : '上传材料' }}</view>
    </view>
    <view v-if="certification" class="review card"><text>审核状态：{{ statusText }}</text><text v-if="certification.status === 'rejected' && certification.reason" class="reason">驳回原因：{{ certification.reason }}</text></view>
    <view class="primary-btn save" @tap="save">提交认证审核</view>
  </view>
</template>
<script>
import { callCloud } from '../../common/cloud.js'
import { toast } from '../../common/mock.js'
export default {
  data() { return { materials: [{ key: 'license', title: '营业执照', desc: '支持 JPG、PNG 或 PDF', file: '', url: '' }, { key: 'green', title: '绿色产品认证', desc: '可选，证明产品绿色属性', file: '', url: '' }, { key: 'agreement', title: '校园合作协议', desc: '可选，证明合作关系', file: '', url: '' }], certification: null } },
  computed: { statusText() { return this.certification?.status === 'approved' ? '审核通过' : this.certification?.status === 'rejected' ? '已驳回' : '待后台审核' } },
  async onShow() { const id = uni.getStorageSync('user_session')?.id; if (!id) return; try { const result = await callCloud('certification-status', { enterpriseId: id }); this.certification = result.data } catch (error) { this.certification = null } },
  methods: {
    upload(item) { uni.chooseMessageFile({ count: 1, type: 'file', success: async res => { const file = res.tempFiles[0]; try { const uploaded = await uniCloud.uploadFile({ filePath: file.path, cloudPath: `certifications/${Date.now()}-${file.name}` }); item.file = file.name; item.url = uploaded.fileID } catch (error) { toast('文件上传失败') } } }) },
    remove(item) { item.file = ''; item.url = '' },
    async save() { const materials = this.materials.filter(item => item.url).map(item => ({ key: item.key, title: item.title, name: item.file, url: item.url })); if (!materials.length) return toast('请至少上传一份材料'); try { await callCloud('certification-submit', { enterpriseId: uni.getStorageSync('user_session')?.id, materials }); toast('材料已提交，等待后台审核'); this.certification = { status: 'pending' } } catch (error) { toast(error.message || '提交失败') } }
  }
}
</script>
<style lang="scss">
@import '../../common/portal.scss';
.material{margin-bottom:20rpx}.material-title{display:block;color:#181c1c;font-size:28rpx;font-weight:700}.status{padding:8rpx 16rpx;border-radius:24rpx;background:#fff0d8;color:#a96b16;font-size:21rpx}.status.uploaded{background:#d6e6e3;color:#006d37}.file-row{display:flex;justify-content:space-between;margin-top:22rpx;padding:18rpx;border-radius:14rpx;background:#f1f4f3;color:#53615f;font-size:22rpx}.remove{color:#ba1a1a}.upload{min-height:62rpx;margin-top:20rpx;font-size:23rpx}.review{margin-top:24rpx;color:#006d37}.reason{display:block;margin-top:12rpx;color:#ba1a1a}.save{margin-top:28rpx}
</style>
