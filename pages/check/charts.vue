<template>
	<view style="overflow: scroll;">
		<view style="display: flex; padding-top: 5px;padding-left: 10px;">
			<button style="flex: 1;" size="mini" @tap="showdate" type="primary">选择过滤条件</button>
			<view style="flex: 2;" class="qiun-title-dot-light-outcome">{{condition}}</view>
		</view>
		<view style="height: 1px;background: #808080;margin-top: 5px;" />
		<view class="analysisyear" v-if="reload">
			<view class="incomeoutcome" style="width: 90%;margin: 0 auto; margin-top: 5px;">
				<t-table @change="change">
					<t-tr>
						<t-th>总收入</t-th>
						<t-th>总支出</t-th>
						<t-th>净收入</t-th>
					</t-tr>
					<t-tr>
						<t-td>{{ allincome}}</t-td>
						<t-td>{{ alloutcome }}</t-td>
						<t-td>{{ (allincome-alloutcome).toFixed(2)}} </t-td>
					</t-tr>
				</t-table>
				<view style="text-align: center;line-height: 20px;font-size: small;">{{condition}}期间收支表</view>
			</view>
			<view class="year" v-if="currentcondition==0">
				<histogram-chart height="400" :dataAs="histogramData2" canvasId="ht1" labelKey="label" valueKey="value" :yAxisAs="{
			            formatter: {
			                type: 'number' //type:number percent String,额外参数:fixed:NUmber,name:String
			            }
			        }" />
				<view style="text-align: center;line-height: 20px;font-size: small;">{{condition}}年收支柱状图</view>
			</view>

			<view v-if="reload">
				<radio-group class="qiun-title-dot-light-outcome" style="margin-top: 5px;" @change="radioChange">
					<label v-for="(item, index) in items" :key="item.value">
						<view>
							<radio :value="item.value" :checked="index === current" />{{item.name}}
						</view>
					</label>
				</radio-group>
					<RingChart key="0" v-if="current == 0 " :dataAs="circle1" height="450"></RingChart>
					<RingChart key="1" v-if="current == 1 " :dataAs="circle2" height="450"></RingChart>
			</view>
		</view>

		<w-picker mode="date" startYear="2019" endYear="2099" :defaultVal="defaultVal1" :current="true" @confirm="onConfirm"
		 ref="date" themeColor="#f00" :selectList="selectList1"></w-picker>
		 
		 <loading
		     ref="loading"
		     :custom="false"
		     :shadeClick="false"
		     :type="2"
			 height="80px"
			 width="110px"
		    >
		         <!-- <view class="test">自定义</view> -->
		 </loading>
	</view>
</template>

<script>
	import HistogramChart from '@/components/stan-ucharts/HistogramChart.vue';
	import RingChart from '../../components/stan-ucharts/RingChart.vue'
	import wPicker from "@/components/w-picker/w-picker.vue";
	import dbHelper from '../../db-helper.js'

	import tTable from '@/components/t-table/t-table.vue';
	import tTh from '@/components/t-table/t-th.vue';
	import tTr from '@/components/t-table/t-tr.vue';
	import tTd from '@/components/t-table/t-td.vue';

	import loading from '../../components/loading/loding.vue'
	export default {
		name: "Check",
		components: {
			HistogramChart,
			RingChart,
			wPicker,
			tTable,
			tTh,
			tTr,
			tTd,
			loading
		},
		data() {
			return {
				condition: '',
				reload: true,
				recordList: [], //所有记录
				income12: [], //12个月的收入
				outcome12: [], //12个月的支出
				depart12: [], //12个月的记录
				allincome: 0, //全年收入
				alloutcome: 0, //全年支出
				items: [{
					value: 0,
					name: '收入',
					checked: 'true'
				}, {
					value: 1,
					name: '支出',
				}],
				current: 0, //tab栏下标
				currentcondition: 0, //0:查询年份，1:查询某个月份， 2:查询某天
				histogramData2: {
					//柱状图Compent  //label应为series value 应为
					label: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
					value: [{
						name: '收入',
						data: []
					}, {
						name: '支出',
						data: []
					}]
				},
				circle1: {
					series: [],

				},
				circle2: {
					series: [],

				}
			}
		},
		methods: {
			reloads() {
				console.log("收到更新")
				this.reload = false
				this.$nextTick(() => {
					this.reload = true
				})
			},
			onConfirm(res) {
				this.circle1.series.length = 0
				this.circle2.series.length = 0
				this.allincome = 0
				this.alloutcome = 0
				const year = res.checkArr[0][0]
				const month = res.checkArr[0][1]
				const day = res.checkArr[0][2]
				if (month.indexOf('不设置') != -1) { //只选择了年份，按照年视图展示图表
					this.currentcondition = 0
					this.condition = year
					this.income12.length = 0 //清空
					this.outcome12.length = 0
					const offset = parseInt(year)
					const end = offset + 1
					dbHelper.analysis(offset, end, false).then((res) => {
						console.log(res.length)
						if (res.length == 0) {
							console.log("查询记录为0")
							uni.showModal({
								title: '提示',
								content: '你没有在' + year + '年记账呢,赶快记一笔吧',
								success: function(res) {
									if (res.confirm) {
										console.log('用户点击确定');
									} else if (res.cancel) {
										console.log('用户点击取消');
									}
								}
							});
						}
						this.recordList = res
						//进行分类
						for (let i = 1; i <= 12; i++) {
							let month = []
							if (i < 10) {
								month = res.filter(item => (item.time >= (year + '-0' + i) && item.time < (year + '-0' + (i + 1))))
							} else if (i < 12) {
								month = res.filter(item => (item.time >= (year + '-' + i) && item.time < (year + '-' + (i + 1))))
							} else {
								month = res.filter(item => (item.time >= (year + '-' + i)))
							}
							if (month.length > 0) {
								this.depart12.push(month)
								const income = month.filter(item => item.type == 0) //过滤收入
								const outcome = month.filter(item => item.type == 1) //过滤支出
								if (income.length > 0) {
									let sum = 0
									for (let i of income) {
										sum += parseFloat(i.money)
									}
									this.income12.push(sum)
								} else {
									this.income12.push(0)
								}
								if (outcome.length > 0) {
									let sum = 0
									for (let i of outcome) {
										sum += parseFloat(i.money)
									}
									this.outcome12.push(sum)
								} else {
									this.outcome12.push(0)
								}
							} else {
								this.income12.push(0)
								this.outcome12.push(0)
							}
						}
						this.histogramData2.value[0].data = this.income12
						this.histogramData2.value[1].data = this.outcome12

						for (let value of this.income12) {
							this.allincome += value
						}
						for (let value of this.outcome12) {
							this.alloutcome += value
						}
						console.log(this.income12)
						console.log(this.outcome12)
						console.log(this.allincome)
						console.log(this.alloutcome)

						this.updatePie(this.recordList)


					})

				} else if (day.indexOf('不设置') != -1) { //选择了年月，
					this.condition = year + '-' + month
					this.currentcondition = 1
					let int_month = parseInt(month)
					let offset = ''
					let end = ''
					if (int_month < 12) {
						if (int_month < 9) {
							offset = year + "-0" + int_month
							end = year + "-0" + (int_month + 1)
						} else if (int_month == 9) {
							offset = year + "-0" + int_month
							end = year + "-10"
						} else {
							offset = year + "-" + int_month
							end = year + "-" + (int_month + 1)
						}

					} else {
						offset = year + "-12"
						end = "" + (parseInt(year) + 1)
					}
					this.handleMonthAndDay(offset, end)

				} else { //选择了具体某天
					this.condition = year + '-' + month + '-' + day
					this.currentcondition = 2
					const offset = this.condition + " 00:00:00"
					const end = this.condition + " 23:59:59"
					dbHelper.analysis(offset, end, false).then((res) => {
						console.log(res.length)
						if (res.length == 0) {
							console.log("查询记录为0")
							uni.showModal({
								title: '哎呀',
								content: '你没有在' + this.condition + '记账呢,赶快记一笔吧',
								success: function(res) {
									if (res.confirm) {
										console.log('用户点击确定');
									} else if (res.cancel) {
										console.log('用户点击取消');
									}
								}
							});
						}
						this.handleMonthAndDay(offset, end)
					})
				}
			},
			handleMonthAndDay(offset, end) { //处理 查询固定月 和 固定日
				dbHelper.analysis(offset, end, false).then((res) => {
					console.log(res.length)
					if (res.length == 0) {
						console.log("查询记录为0")
						uni.showModal({
							title: '哎呀',
							content: '你没有在' + this.condition + '记账呢,赶快记一笔吧',
							success: function(res) {
								if (res.confirm) {
									console.log('用户点击确定');
								} else if (res.cancel) {
									console.log('用户点击取消');
								}
							}
						});
					}
					this.recordList = res
					const allincomearr = res.filter(item => item.type == 0)
					const alloutcomearr = res.filter(item => item.type == 1)

					for (let value of allincomearr) {
						console.log(value.money)
						this.allincome += parseFloat(value.money)
					}
					for (let value of alloutcomearr) {
						console.log(value.money)
						this.alloutcome += parseFloat(value.money)
					}
					this.updatePie(res)

				})
			},

			updatePie(list) { //更新饼状图
				setTimeout(() => {
					let incomeRecord = list.filter(item => item.type == 0)
					let outcomeRecord = list.filter(item => item.type == 1)

					let incomeMap = new Map()
					let outcomeMap = new Map()
					for (let i of incomeRecord) {
						if (incomeMap.has(i.tag)) {
							const cur = incomeMap.get(i.tag)
							incomeMap.set(i.tag, cur + parseFloat(i.money))
						} else {
							incomeMap.set(i.tag, parseFloat(i.money))
						}
					}
					for (let i of outcomeRecord) {
						if (outcomeMap.has(i.tag)) {
							const cur = outcomeMap.get(i.tag)
							outcomeMap.set(i.tag, cur + parseFloat(i.money))
						} else {
							outcomeMap.set(i.tag, parseFloat(i.money))
						}
					}
					const inner = this
					incomeMap.forEach(function(value, key) {
						if (value > 0) {

							inner.circle1.series.push({
								name: key,
								data: value
							})
						}
					})
					outcomeMap.forEach(function(value, key) {
						if (value > 0) {
							inner.circle2.series.push({
								name: key,
								data: value
							})
						}
					})
					console.log(this.circle1.series.length)
					console.log(this.circle2.series.length)
					
					this.$refs.loading.open()
					// uni.showToast({
					// 	icon: 'loading',
					// 	duration: 1000,
					// 	title: '请稍后'
					// })
					setTimeout(()=>{
						this.reloads()
						this.$refs.loading.close()
					},1000)
				}, 10)
			},
			showdate() {
				this.$refs.date.show()
			},
			radioChange: function(evt) {
				for (let i = 0; i < this.items.length; i++) {
					if (this.items[i].value === evt.target.value) {
						this.current = i;
						break;
					}
				}

			}
		},
	}
</script>

<style>
	.qiun-title-dot-light-income {
		border-left: 10upx solid #f21345;
		padding-left: 10upx;
		font-size: 32upx;
		color: #000000;
		margin-left: 10px;
	}

	.qiun-title-dot-light-outcome {
		border-left: 10upx solid #007947;
		padding-left: 10upx;
		font-size: 32upx;
		color: #000000;
		margin-left: 10px;
	}
</style>
