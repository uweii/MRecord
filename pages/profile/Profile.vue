<template>
	<view class="container">
		<view class="qiun-title-dot-light-outcome">应用设置</view>
		<view style="margin-top: 10px;">
			<uni-list>
			    <uni-list-item title="每日推荐图片" :note="changeTag" @click="settindImg"  ></uni-list-item>
				<uni-list-item title="音效" note="记账时开启音效" :show-switch="true" :show-arrow="false" :switchChecked="checked" @switchChange="changeSwitch"></uni-list-item>
			</uni-list>
		</view>
			
		
		<view class="qiun-title-dot-light-outcome">开发者</view>
		<view style="margin-top: 11px;">
			<uni-list>
			    <uni-list-item title="项目开源" note="代码仓库,反馈bug,提建议" @click="aboutMe"  ></uni-list-item>
			    <uni-list-item title="项目开源" note="代码仓库,反馈bug,提建议" @click="aboutMe"  ></uni-list-item>
			    <uni-list-item title="项目开源" note="代码仓库,反馈bug,提建议" @click="aboutMe"  ></uni-list-item>
			</uni-list>
		</view>
		
		
		
	</view>
</template>

<script>
	import uniList from "@/components/uni-list/uni-list.vue"
	import uniListItem from "@/components/uni-list-item/uni-list-item.vue"
	import Global from '../../global.js'
	import uniCard from '@/components/uni-card/uni-card.vue'
	export default {
		mounted() {
			let imgType = Global.getImgType()
			let isOpen = Global.getAudioOpen()
			if(imgType == 0){
				this.changeTag = this.itemList[0]
			}else{
				this.changeTag = this.itemList[1]
			}
			if(isOpen==0){
				this.checked = false
			}else{
				this.checked = true
			}
		},
	    components: {uniList,uniListItem,uniCard},
		methods: {
			settindImg() {
				const that = this
				uni.showActionSheet({
					itemList: this.itemList,
					success:function(res){
						if(res.tapIndex == 0){
							if(that.changeTag != that.itemList[0]){
								that.changeTag = that.itemList[0]
								Global.update(0, that.checked?1:0)
							}
						}else{
							if(that.changeTag != that.itemList[1]){
								that.changeTag=that.itemList[1]
								Global.update(1,that.checked?1:0)
							}
						}
					}
				})
			},
			changeSwitch(e){
				if(e.value){ //开启了音效
					Global.update(this.changeTag==this.itemList[0]?0:1,1)
				}else{
					Global.update(this.changeTag==this.itemList[0]?0:1,0)
				}
			},
			aboutMe(){
				uni.navigateTo({
					url: '../about/About'
				})
			}
			
		},
		data() {
			return {
				changeTag: '小姐姐',
				itemList: ["小姐姐","动漫"],
				checked: false
			}
		},
	}
	
</script>

<style>
	.container{
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
