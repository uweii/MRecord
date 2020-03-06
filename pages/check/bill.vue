<template>
	<view>
		<view style="display: flex; padding-top: 5px;padding-left: 10px;">
			<button style="flex: 1;" size="mini" @tap="showdate" type="primary">选择过滤条件</button>
			<view style="flex: 2; " class="qiun-title-dot-light-outcome">{{condition}}</view>
		</view>
		<view style="height: 1px;background: #808080;margin-top: 5px;" />
		<view style="text-align: center;line-height: 20px;font-size: small;">{{condition}}期间收支表</view>
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
		</view>
		<view style="margin: 10px;">
			<t-table @change="change">
				<t-tr>
					<t-th>序号</t-th>
					<t-th>金额</t-th>
					<t-th>类型</t-th>
					<t-th>时间</t-th>
					<t-th>备注</t-th>
					<t-th>操作</t-th>
				</t-tr>
				<t-tr fontSize="10" :key="i" v-for="(item,i) in currentList" :class="{incomeStyle:item.type==0,outcomestyle:item.type==1}">
					<t-td>{{ item.order}}</t-td>
					<t-td>{{ item.money }}</t-td>
					<t-td>{{ item.type==0?'收入':'支出'}} </t-td>
					<t-td>{{ item.time}} </t-td>
					<t-td>{{ item.remarks}} </t-td>
					<t-td style="text-align: center;">
						<image style="width: 20px;height: 20px;" src="../../static/image/common/setting.png" @click="edit(item)"></image>
					</t-td>
				</t-tr>
			</t-table>
		</view>
		<uni-pagination @change="changePage" style="width: 90%;margin: 0 auto;" :total="recordList.length" pageSize="6"
		 :current="currentPage"></uni-pagination>
		<w-picker mode="range" startYear="2019" endYear="2099" :defaultVal="defaultVal1" :current="true" @confirm="onConfirm"
		 ref="date" themeColor="#f00" :selectList="selectList1"></w-picker>
	</view>
	</view>

</template>

<script>
	import wPicker from "@/components/w-picker/w-picker.vue";
	import dbHelper from '../../db-helper.js'
	import tTable from '@/components/t-table/t-table.vue';
	import tTh from '@/components/t-table/t-th.vue';
	import tTr from '@/components/t-table/t-tr.vue';
	import tTd from '@/components/t-table/t-td.vue';
	import uniPagination from '@/components/uni-pagination/uni-pagination.vue'
	import Utils from '../../utis.js'
	export default {
		name: 'bill',
		components: {
			wPicker,
			tTable,
			tTh,
			tTr,
			tTd,
			uniPagination
		},
		mounted() {
			Utils.$on('refreshTable', () => {
				console.log("刷线列表")
				if (JSON.stringify(this.result) != '{}') {

					this.onConfirm(this.result)
				}
			})
		},
		data() {
			return {
				condition: '',
				recordList: [],
				allincome: 0,
				alloutcome: 0,
				currentPage: 1,
				currentList: [],
				result: {} //保存上次条件
			}
		},
		methods: {
			showdate() {
				this.$refs.date.show()
			},
			onConfirm(res) {
				this.result = res
				console.log(res.from)
				console.log(res.to)
				console.log(res.result)
				this.condition = res.result
				const offset = res.from
				const end = res.to + " 23:59:59"
				this.allincome = 0
				this.alloutcome = 0
				dbHelper.analysis(offset, end, true).then((res) => {
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
					res.forEach(function(item, i) {
						item.order = i + 1
					})
					this.recordList = res
					const allincomearr = res.filter(item => item.type == 0)
					const alloutcomearr = res.filter(item => item.type == 1)

					for (let value of allincomearr) {
						this.allincome += parseFloat(value.money)
					}
					for (let value of alloutcomearr) {
						this.alloutcome += parseFloat(value.money)
					}
					if (res.length >= 6) {
						this.currentList = res.slice(0, 6)
					} else {
						this.currentList = res
					}
				})
			},
			changePage(e) {
				console.log(e.current)
				this.currentList.length = 0
				const current = e.current

				this.currentList = this.recordList.slice((current - 1) * 6, current * 6)
			},
			edit(item) {
				console.log(item)
				uni.showActionSheet({
					itemList: ['编辑', '删除', '取消'],
					success: function(res) {
						console.log('选中了第' + (res.tapIndex + 1) + '个按钮');
						if (res.tapIndex == 0) { //编辑
							uni.navigateTo({
								url: '../add/Add?id=' + item.id + '&money=' + item.money + '&time=' + item.time + '&tag=' + item.tag +
									'&moon=' + item.moon + '&remarks=' + item.remarks + '&type=' + item.type
							})
						} else if (res.tapIndex == 1) { //删除
							uni.showModal({
								title: '注意',
								content: '是否要删除？',
								cancelText: '确定',
								confirmText: '算了吧',
								success(res) {
									if (!res.confirm) { //点击删除
										dbHelper.delete(item.id).then((res) => {
											uni.showToast({
												duration: 1000,
												title: '删除成功',
												icon: 'success'
											})
											Utils.$emit('refreshTable')
										})
									} else {

									}
								}
							})
						} else { //取消

						}
					},
					fail: function(res) {
						console.log(res.errMsg);
					}
				});
			}
		},
	}
</script>

<style>
	.qiun-title-dot-light-outcome {
		border-left: 10upx solid #007947;
		padding-left: 10upx;
		font-size: 32upx;
		color: #000000;
		margin-left: 10px;
	}

	.incomeStyle {
		background-color: rgba(255, 114, 86, 0.3)
	}

	.outcomestyle {
		background-color: rgba(0, 121, 71, 0.3)
	}

	.editStyle {
		background-color: #007aff;
		border-radius: 5px;
	}

	.deleteStyle {
		background-color: #dd524d;
		border-radius: 5px;
	}
</style>
