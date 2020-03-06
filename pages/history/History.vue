<template>
	<view style="width: 100%;height: 100%;background-color: #eeeeee;">
		<!-- <MyLine></MyLine> -->
		<s-pull-scroll ref="pullScroll" :pullDown="pullDown" :pullUp="loadData"  emptyText="没有更多啦">
			<my-line ref="myline"></my-line>
		</s-pull-scroll>
		<loading 
		    ref="loading"
		    :custom="false"
		    :shadeClick="false"
		    :type="2"
			height="80px"
			width="110px"
		    @callback="callback()">
		        <!-- <view class="test">自定义</view> -->
		</loading>
	</view>
</template>
<script>
	import myLine from '../../components/history/Line.vue'
	import sPullScroll from '../../components/s-pull-scroll/scrool.vue';
	import Utils from '../../utis.js'
	import loading from '../../components/loading/loding.vue'
	export default {
		name: "History",
		components: {
			myLine,
			sPullScroll,
			loading
		},
		mounted() {
			Utils.$on('noMoreData', () => {
				this.noMoreData()
			})
		},
		data() {
			return {
				loadMoreText: "加载更多"
			}
		},
		methods: {
			pullDown(pullScroll) {
				console.log(pullScroll.page)
				this.$refs.loading.open()
				// uni.showToast({
				// 	icon: 'loading',
				// 	duration: 1000,
				// 	title: '请稍后'
				// })
				setTimeout(() => {
					this.$refs.pullScroll.success()
					this.$refs.myline.refresh()
					this.$refs.loading.close()
				}, 1000);
			},
			loadData(pullScroll) {
				console.log(pullScroll.page)
				setTimeout(() => {
					this.$refs.pullScroll.success()
					this.$refs.myline.add(pullScroll.page + 1)
				}, 800);
			},
			noMoreData() {
				console.log("empty")
				this.$refs.pullScroll.empty(); // 表示全部加载完毕,参数是否显示finishText,默认显示
			}
		},
	}
</script>

<style>

</style>
