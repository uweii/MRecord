<template>
	<view class="page">
		<div class="chooseCard">
			<uni-segmented-control :current="current" :values="items" @clickItem="onClickItem" style-type="text" class="tab" active-color="#8d967e"></uni-segmented-control>
		</div>
		
		<view class="content">
			<view v-show="current === 0">
				<chart></chart>
			</view>
			<view v-show="current === 1">
				<bill></bill>
			</view>
		</view>
	</view>
</template>

<script>
	import tabControl from '@/components/tabControl-tag/tabControl-tag.vue'
	import uniSegmentedControl from "@/components/uni-segmented-control/uni-segmented-control.vue"
	import chart from './charts.vue'
	import bill from './bill.vue'
	export default {
		components: {
			uniSegmentedControl,
			tabControl,
			chart,
			bill
		},
		data() {
			return {
				items: ['图像统计', '账单查询'],
				current: 0
			};
		},
		onLoad() {},
		methods: {
			stopmove(){
				return false
			},
			onClickItem(e) {
				if (this.current !== e.currentIndex) {
					this.current = e.currentIndex;
				}
			}
			
		}
	}
</script>

<style>

.page{
	margin-bottom: 20px;
}

.chooseCard {
		width: 100%;
		margin-top: 5px;
	}
	.tab{
		font-family: "Arial","Microsoft YaHei","黑体","宋体",sans-serif;
		font-size: small;
	}
</style>
