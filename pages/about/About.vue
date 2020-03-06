<template>
	<view class="container">
		<!-- 标题卡片模式 -->
		<uni-card @click="clickCard" title="uweii" mode="title" :is-shadow="true" thumbnail="../../static/image/common/ivator.jpg"
		 extra="Rome was not built in a day" note="2020-03-05">
			在人生的道路上，即使一切都失去了，只要一息尚存，你就没有丝毫理由绝望。因为失去的一切，又可能在新的层次上复得。
		</uni-card>
		<view style="margin-top: 10px;">
			<uni-list>
				<uni-list-item title="应用源代码地址" note="已开源" @click="github"></uni-list-item>
				<uni-list-item title="联系作者" note="反馈bug,提建议" @click="contactMe"></uni-list-item>
			</uni-list>
		</view>
		<luPopupWrapper ref="luPopupWrapper" type="bottom" transition="slider" backgroundColor="#FFF" :active="false" height="28%"
		 width="100%" popupId="1" :maskShow="true" :maskClick="true">
			<view style="padding-top: 10px;padding-bottom: 20px; text-align: center;  display: flex;flex-direction: column;justify-content: center;align-items: center;height: 100%;width: 100%;">
				<view style="flex: 1;display: flex;justify-content: center;align-items: center;  font-weight: bold;font-size: 1em;">联系我</view>
				<text style="display: flex;justify-content: center;align-items: center;flex: 2;font-size: 0.8em;">由于没有服务器的原因，所以不能在线反馈QAQ....\n
					WX:15872358038 \n QQ: 893702494</text>
				<view style="display: flex;align-items: center;flex: 1;display: flex;width: 100%; justify-content: space-between;">
					<button style="height: 40px;line-height: 40px; background-color: #007947;"  @click="openWX" type="primary" size="mini">复制微信</button>
					<button style="height: 40px;line-height: 40px;" type="primary" @click="openQQ" size="mini">打开QQ</button>
				</view>
			</view>

		</luPopupWrapper>
	</view>
</template>

<script>
	import uniList from "@/components/uni-list/uni-list.vue"
	import uniListItem from "@/components/uni-list-item/uni-list-item.vue"
	import uniCard from '@/components/uni-card/uni-card.vue'
	import luPopupWrapper from "@/components/lu-popup-wrapper/lu-popup-wrapper.vue";
	export default {
		components: {
			uniList,
			uniListItem,
			uniCard,
			luPopupWrapper
		},
		onBackPress(options) {
			console.log('from:' + options.from)
			if (this.$refs.luPopupWrapper.isOpen()) { //如果当前弹窗打开，则拦截返回键
				this.$refs.luPopupWrapper.close()
				return true
			}
			
		},
		methods: {
			contactMe() {
				this.$refs.luPopupWrapper.show();
			},
			github() {
				plus.runtime.openURL('https://github.com/uweii/MRecord', function(res) {

				});
			},
			openQQ(){
				plus.runtime.openURL('mqqwpa://im/chat?chat_type=wpa&uin=893702494',
					function(res) {
						plus.nativeUI.alert("本机没有安装QQ，无法启动"); 
					});
			},
			openWX(){
				uni.setClipboardData({
				    data: '15872358038',
				    success: function () {
				        console.log('success');
				    }
				});
			}
		},
	}
</script>

<style>
	.container {
		background-color: #DCE2F1;
		height: 100%;
		width: 100%;
		overflow: hidden;
	}


	.qiun-title-dot-light-outcome {
		border-left: 10upx solid #007947;
		padding-left: 10upx;
		font-size: 32upx;
		color: #000000;
		margin-left: 10px;
		margin-top: 10px;
		font-size: large;
		font-weight: bold;
	}
</style>
