<template>
	<view>
		<div class="chooseCard">
			<uni-segmented-control :current="current" :values="items" @clickItem="onClickItem" style-type="button" active-color="#1296db"></uni-segmented-control>
		</div>

		<view class="content">
			<view v-show="current === 0">
				<Income @hook:mounted="childMounted" ref="income"></Income>
			</view>
			<view v-show="current === 1">
				<Outcome @hook:mounted="childMounted" ref="outcome"></Outcome>
			</view>
		</view>
	</view>
</template>

<script>
	import uniSegmentedControl from "@/components/uni-segmented-control/uni-segmented-control.vue"
	import Income from '../../components/add/Income.vue'
	import Outcome from '../../components/add/Outcome.vue'
	import Utils from '../../utis.js'

	export default {
		onLoad(option) {
			console.log(option)
			console.log("开始发射")
			console.log(option)
			if (JSON.stringify(option) != '{}') {
				this.option = option
				this.wantEdit = true
				if (option.type == 0) { //收入界面
					this.current = 0
				} else { //支出界面
					this.current = 1
				}
				console.log("in")

			} else {

				console.log("out")
			}
		},
		name: "Add",
		components: {
			uniSegmentedControl,
			Income,
			Outcome
		},
		onBackPress(options) {
			console.log('from:' + options.from)
			if (this.$refs.income.isPopOpen) { //如果当前弹窗打开，则拦截返回键
				this.$refs.income.close()
				return true
			}
			if (this.$refs.outcome.isPopOpen) {
				this.$refs.outcome.close()
				return true
			}
			if(this.$refs.income.isTimeOpen()){
				this.$refs.income.closeTime()
				return true
			}
			if(this.$refs.outcome.isTimeOpen()){
				this.$refs.outcome.closeTime()
				return true
			}
		},
		data() {
			return {
				items: ['记收入', '记支出'],
				current: 0,
				option: {}, //记录从账单编辑的内容
				wantEdit: false //标志是否需要 传递 option给income组件，进行编辑
			}
		},
		methods: {
			onClickItem(e) {
				if (this.current !== e.currentIndex) {
					this.current = e.currentIndex;
				}
			},
			childMounted() {
				if (this.wantEdit) {
					if (this.current == 0) {
						Utils.$emit('updateincome', this.option)
					} else {
						Utils.$emit('updateoutcome', this.option)
					}

				}
			}
		}
	}
</script>

<style>
	.chooseCard {
		margin-top: 5px;
		width: 80%;
		margin-left: auto;
		margin-right: auto;
	}
</style>
