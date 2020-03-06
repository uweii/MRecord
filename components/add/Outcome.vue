<template>
	<view>
		<div class="container">
			<input id="money" type="number" v-model="money" :class="{focus:isfocus}" placeholder-class="myPlaceHolder"
			 placeholder="0.00" @blur="moneyBoxBlur" @focus="moneyBoxFocus" class="commonInput moneyBox">
			</input>
		</div>
		<div class="container">
			<div class="commonInput dateStyle" @tap="toggleTab">
				<text class="fixedPreFont">时间</text>
				<span style="margin-left: 15px;float: left;" class="fontSize">{{date}}</span>
			</div>
		</div>
		<view style="height: 1px;background: #808080;margin-left: 10%;" />
		<yu-datetime-picker @confirm="onConfirm" startYear="2015" ref="dateTime" :isAll="true" :current="true"></yu-datetime-picker>
		<div class="container">
			<span type="number" @click="open" class="commonInput fromStyle">
				<text class="fixedPreFont">分类</text>
				<text style="margin-left: 15px;float: left;" class="fontSize">{{choosedTag}}</text>
			</span>
			<uni-popup ref="popup" type="center" :maskClick=false>
				<div class="pop">
					<div class="head">
						<h4>选择支出类型</h4>
					</div>
					<hr />
					<scroll-view scroll-y="true" style="height: 350px;" :show-scrollbar="true" enable-back-to-top="true">
						<div class="choice">
							<div class="gridBox">
								<div class="gridItem" :class="{activeStyle: item.id == temp}" v-for="(item,i) in froms" :key="item.id" @click="itemClick(item.id)">{{item.name}}
								</div>
							</div>
						</div>
					</scroll-view>
					<!-- <div class="choice">
						<div class="gridBox">
							<div class="gridItem" :class="{activeStyle: item.id == temp}" v-for="(item,i) in froms" :key="item.id" @click="itemClick(item.id)">{{item.name}}
							</div>
						</div>
					</div> -->
					<view style="height: 1px;background: #808080;" />
					<div class="foot">
						<div style="flex:1;display: -webkit-box;-webkit-box-align: center;-webkit-box-pack: center;">
							<div>
								<input class="inputBox" style="float: left; text-align: left; width: 60%;margin-left: 5px;margin-right: 5px; border: #65c294 solid 1px;"
								 placeholder="输入一个新标签" v-model="newTag" type="text" />
								<button @click="create" value="创建" style="height: 30px;vertical-align: middle;line-height: 30px;margin-right: 5px;">创建</button>
							</div>
						</div>
						<div style="width: 50%;margin: 0 auto;clear: both; flex: 1;">
							<button style="float: left;" @click="close">取消</button>
							<button class="confirmBtnStyle" @click="confirm" style="float: right;">确定</button>
						</div>
					</div>
				</div>
			</uni-popup>
		</div>
		<view style="height: 1px;background: #808080;margin-left: 10%;" />
		<div class="container">
			<div class="commonInput moonStyle">
				<span class="fixedPreFont">心情</span>
				<div style="float: left; margin-left: 13px;display: flex; margin-top: auto;margin-bottom: auto;">
					<image v-for="i in 5" :src="judge(i)" @click="star(i)" :key="i" style="width: 30px;height: 30px;"></image>
				</div>
				<image style="float: right;margin-top: auto;margin-bottom: auto;width: 30px;height: 30px; margin-left: 10px; " :src="moonImg"></image>
			</div>
		</div>
		<view style="height: 1px;background: #808080;margin-left: 10%;" />
		<div class="container">
			<div class="commonInput remarksStyle">
				<text class="fixedPreFont">备注</text>
				<input id="" class="fontSize" v-model="remark" style="margin-left: 15px;margin-top: auto;margin-bottom:auto ;" type="text" />
			</div>
		</div>
		<view style="height: 1px;background: #808080;margin-left: 10%;" />
		<div style="margin-top: 20px;width: 80%;display: flex;margin-left: auto;margin-right: auto;">
			<button class="normalBtn" @click="fexit">退出</button>
			<button @click="fclear" class="normalBtn clear" :disabled="disableStyle" :class="{disableStyle: btnClearDisable}">清空</button>
			<button @click="fsave" class="normalBtn saveBtn" :disabled="btnSaveDisable" :class="{disableStyle: btnSaveDisable}">保存</button>
		</div>
	</view>
</template>

<script>
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	import outcome from '../../static/data/outcome.json'
	import dbHelper from '../../db-helper.js'
	import yuDatetimePicker from "@/components/yu-datetime-picker/yu-datetime-picker.vue"
	import Utils from '../../utis.js'
	import Global from '../../global.js'
	let tags = []
	let count = 0
	uni.getStorage({
		key: 'outcome',
		success: function(res) {
			tags = res.data.tags
			count = res.data.number
			console.log(tags)
			console.log(count)
		},
		fail: function() {
			console.log("收入标签数据在本地不存在！")
			tags = outcome.tags
			count = outcome.number
			update(outcome)
		}
	})


	export default {
		mounted() {
			console.log('===============mounted')
			Utils.$on('updateoutcome', (option) => {
				console.log("init=========")
				this.money = option.money
				this.date = option.time
				this.choosedTag = option.tag
				this.starIndex = option.moon
				this.remark = option.remarks
				this.isUpdate = true
				this.recordid = option.id
			})
		},
		data() {
			return {
				date: '',
				newTag: '',
				froms: tags,
				choosed: -1,
				temp: -1,
				choosedTag: '',
				isfocus: false,
				starIndex: 0, //星星的下标,
				remark: '',
				money: '',
				isPopOpen: false,
				isUpdate: false, //标志是否是更新记录,
				recordid: 0 //标志数据索引
			}
		},
		computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			},
			judge() { //判断星星是否需要显示为 【选中】 状态
				return (i) => {
					return i <= this.starIndex ? '../../static/image/income/star-active.png' : '../../static/image/income/star.png'
				}
			},
			moonImg() {
				return '../../static/image/moon/moon' + this.starIndex + ".png"
			},
			btnClearDisable() {
				if (this.money == '' && this.date == '' && this.choosedTag == '' && this.remark == '' && this.starIndex == 0) {
					return true
				}
				return false
			},
			btnSaveDisable() {
				if (this.money && this.date && this.choosedTag && this.starIndex != 0) {
					return false
				}
				return true
			}

		},
		methods: {
			isTimeOpen(){
				return this.$refs.dateTime.showPicker
			},
			closeTime(){
				this.$refs.dateTime.hide()
			},
			toggleTab(item, index) {
				this.$refs.dateTime.show();
			},
			onConfirm(val) {
				console.log(val);
				this.date = val.selectRes;
			},

			moneyBoxBlur() {
				this.isfocus = false
			},
			moneyBoxFocus() {
				console.log("focus")
				this.isfocus = true
			},

			open() {
				this.isPopOpen = true
				this.$refs.popup.open()
				if (this.choosed != -1) {
					this.temp = this.choosed
				}
			},
			close() {
				this.isPopOpen = false
				this.$refs.popup.close()
				this.temp = -1
				this.newTag = ''
			},
			confirm() {
				if (this.temp == -1) {
					uni.showToast({
						title: "请先选择标签",
						icon: "none",
						duration: 500
					})
					return
				}
				for (let s of tags) {
					if (s.id == this.temp) {
						this.choosedTag = s.name
						this.choosed = this.temp
					}
				}
				this.close()
			},
			itemClick(id) {
				console.log(id)
				this.temp = id
			},
			star(i) {
				// console.log(i)
				if (this.starIndex == i) { //如果当前是选中状态，再点一次则取消当前选中
					this.starIndex--;
					return
				}
				this.starIndex = i;
			},
			create() {
				if (this.newTag != '') {
					let newTag = this.newTag.trim()
					if (tags.length > 0) {
						for (let tag of tags) {
							if (tag.name == newTag) {
								console.log("已存在！！！")
								return
							}
						}
						count++
						console.log(newTag + "标签不存在")
						this.froms.push({
							'id': count,
							'name': newTag
						})
						this.newTag = ''
						const updateData = {
							'tags': this.froms,
							'number': count
						}
						update(updateData)
					}
				} else {
					uni.showToast({
						title: "请先输入标签",
						icon: "none",
						duration: 500
					})
					console.log("请先输入标签")
				}
			},
			watchMoney(e) {
				this.money = e.target.value
			},
			fexit() {
				uni.navigateBack({
					animationType: "slide-out-right",
					animationDuration: 500
				})
			},
			fclear() {
				this.money = ''
				this.date = ''
				this.choosedTag = ''
				this.starIndex = 0
				this.remark = ''
			},
			fsave() {
				const inner = this
				const record = {
					money: this.money,
					time: this.date,
					type: 1,
					tag: this.choosedTag,
					moon: this.starIndex,
					remarks: this.remark
				}
				if (this.isUpdate) {
					dbHelper.delete(this.recordid).then((res) => {
						dbHelper.save(record).then((res) => {
							uni.showToast({
								title: '更新成功',
								duration: 1000,
								icon: "success"
							});
							inner.isUpdate = false
							Utils.$emit('onload')
							setTimeout(() => {
								Utils.$emit('refreshTable')
							}, 200)
						})
					})
				} else {
					dbHelper.save(record).then((res)=>{
						uni.showToast({
							title: '记账成功',
							duration: 1000,
							icon: "success"
						});
						if (Global.audioOpen == 1) {
							Global.playIncomeAudio()
						}
						Utils.$emit('onload')
						Utils.$emit('refreshTable')
					})
				}
				this.fclear()
			}
		},
		components: {
			uniPopup,
			yuDatetimePicker
		}
	}

	function update(outcome) {
		console.log(outcome)
		uni.setStorage({
			key: 'outcome',
			data: outcome,
			success: () => {
				console.log("将标签缓存成功")
			},
			fail: () => {
				console.log("标签缓存失败")
			}
		})
	}
</script>

<style scoped>
	.commonInput {
		border-top: 0px;
		border-left: 0px;
		border-right: 0px;
	}




	.inputBox {
		border-radius: 5px;
		border: #65c294 solid 1px;
		height: 30px;
		padding-left: 2px;
	}

	.fontSize {
		font-size: large;
	}

	.fixedPreFont {
		font-size: small;
		float: left;
		padding-left: 32px;
		color: #77787b;
	}


	.moneyBox {
		border-bottom: 2px solid #007947;
		width: 100%;
		height: 60px;
		line-height: 60px;
		font-size: xxx-large;
		font-weight: bold;
		color: #007d65;
		background-image: url(../../static/image/income/money.png);
		background-repeat: no-repeat;
		background-position: 75% 50%;
		background-size: 30px 36px;
	}




	.focus {
		border-bottom: 4px solid #007d65;
	}

	.myPlaceHolder {
		color: #007d65;
	}


	.remarksStyle {
		border-bottom: #8872777b solid 0.5px;
		display: flex;
		margin: 0 auto;
		width: 100%;
		height: 50px;
		line-height: 50px;
		background-image: url(../../static/image/income/remarks.png);
		background-repeat: no-repeat;
		background-size: 30px 20px;
		background-position: 0 center;
	}




	.dateStyle {
		border-bottom: #8872777b solid 0.5px;
		display: flex;
		margin: 0 auto;
		width: 100%;
		height: 50px;
		line-height: 50px;
		background-image: url(../../static/image/income/date.png);
		background-repeat: no-repeat;
		background-size: 30px 20px;
		background-position: 0 center;

	}

	.fromStyle {
		border-bottom: #8872777b solid 0.5px;
		display: flex;
		margin: 0 auto;
		width: 100%;
		height: 50px;
		line-height: 50px;
		background-image: url(../../static/image/income/type.png);
		background-repeat: no-repeat;
		background-size: 30px 20px;
		background-position: 0 center;

	}

	.moonStyle {
		border-bottom: #8872777b solid 0.5px;
		display: flex;
		margin: 0 auto;
		width: 100%;
		height: 50px;
		line-height: 50px;
		background-image: url(../../static/image/income/moon.png);
		background-repeat: no-repeat;
		background-size: 30px 20px;
		background-position: 0 center;
	}


	.container {
		margin-top: 10px;
		margin-left: 10%;
		width: 100%;
		/* float: left; */
	}

	.pop {
		text-align: center;
		background-color: #FFFFFF;
		top: 50%;
		left: 50%;
		width: 80%;
		height: 70%;
		position: fixed;
		border-radius: 10px;
		overflow: auto;
		transform: translateX(-50%) translateY(-50%);
		flex-direction: column;
		display: flex;
	}

	.gridBox {
		display: grid;
		grid-template-columns: 33.33% 33.33% 33.33%;
		overflow: scroll;
		/* grid-template-rows: 33.33% 33.33% 33.33%; */
	}

	.choice {
		width: 100%;
		overflow-y: scroll;
		flex: 7;
	}

	.gridItem {
		height: 50px;
		line-height: 50px;
		text-align: center;
		margin: 5px;
		border-radius: 5px;
		border: #555555 solid 1px;
		font-size: small;
	}

	.activeStyle {
		background-color: #65c294;
	}

	.foot {
		margin-top: 5px;
		flex: 3;
		width: 100%;
		overflow-y: hidden;
		display: flex;
		flex-direction: column;
	}

	.head {
		flex: 1;
		display: -webkit-box;
		align-items: center;
		/* 垂直居中 */
		justify-content: center;
		/* 水平居中 */
		background-color: #65c294;
	}

	.confirmBtnStyle {
		background-color: #65c294;
	}

	.normalBtn {
		flex: 1;
		font-size: small;
		margin: 10px;
		background-color: #d5584a;
		color: #fcedef;
		background-image: url(../../static/image/income/exit.png);
		background-repeat: no-repeat;
		background-size: 20px 20px;
		background-position: 5px center;
		padding-left: 25px;
	}

	.normalBtn.clear.disableStyle {
		background-color: #a1a3a6;
	}

	.normalBtn.saveBtn.disableStyle {
		background-color: #a1a3a6;
	}

	.normalBtn.clear {
		background-color: #e48039;
		color: #f9fcfa;
		background-image: url(../../static/image/income/clear.png);
		background-repeat: no-repeat;
		background-size: 20px 20px;
		background-position: 5px center;
	}

	.normalBtn.saveBtn {
		background-color: #f2be43;
		color: #353120;
		background-image: url(../../static/image/income/save.png);
		background-repeat: no-repeat;
		background-size: 20px 20px;
		background-position: 5px center;

	}
</style>
