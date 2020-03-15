<template>
	<view class="container">
		<view class="left" :class="{shouldShow: isLeft}">
			<uni-card class="itemclass" :style="itemStyle" mode="title" :thumbnail="getThumnail" :isFull="true" v-bind:title="type==0?'收入':'支出'" v-bind:extra="money"
			 v-bind:note="time">
				<view>
					<span :style="tagStyle" class="tagclass">{{tag}}</span>{{remark}}
				</view>
			</uni-card>
		</view>
		<view class="line-container">
			<view class="line"></view>
			<view class="circle" :style="circleStyle"></view>
			<view class="line"></view>
		</view>
		<view class="right" :class="{shouldShow: !isLeft}">
			<uni-card class="itemclass" :style="itemStyle" mode="title" :thumbnail="getThumnail" :isFull="true" v-bind:title="type==0?'收入':'支出'" v-bind:extra="money"
			 v-bind:note="time">
				<view>
					<span :style="tagStyle" class="tagclass">{{tag}}</span>{{remark}}
				</view>
			</uni-card>
		</view>
	</view>
</template>

<script>
	import uniCard from '@/components/uni-card/uni-card.vue'
	

	
	export default {
		name: 'Item',
		components: {
			uniCard
		},
		data() {
			return {
				colors: ["#ef5b9c", "#f47920", "#2a5caa", "#f58220","#7fb80e", "#6950a1","#1d953f","#ed1941","#fcaf17","#009ad6"]
			}
		},
		props: {
			isLeft: {
				type: Boolean,
				default: true
			},
			type: {
				type: Number //类型  收入/支出
			},
			money: {
				type: String //金额
			},
			remark: {
				type: String //备注
			},
			tag: {
				type: String //标签
			},
			time: {
				type: String  //时间
			},
			
		},
		computed: {
			showStyle() {
				return this.isLeft ? "{display: none}" : "{}"
			},
			itemStyle(){
				return {borderBottom: "2px solid " + this.colors[this.getRandom(this.colors.length)]}
			},
			tagStyle(){
				return {backgroundColor: this.colors[this.getRandom(this.colors.length)], opacity: 0.7, }
			},
			circleStyle(){
				return {border: "4px solid" + this.colors[this.getRandom(this.colors.length)]}
			},
			getThumnail(){
				return '../../static/image/random/' + (this.getRandom(18)+1) + '.jpg'
			}
			
		},
		methods: {
			getRandom(length){
				let i = Math.floor(Math.random()*length); 
				return i
			},
		},
		
	}
</script>

<style scoped lang="scss">
	.container {
		width: 100%;
		height: 150px;
		display: flex;
		text-align: center;
		word-wrap: break-word;
		word-break: normal;
		font-size: small;
		

		.left {
			flex: 1;
			padding-left: 5px;
			border-radius: 5px;
			width: 0; //flex布局，防止内容过多，div被撑开
		}

		.right {
			flex: 1;
			padding-right: 5px;
			border-radius: 5px;
			// width: 0; //flex布局，防止内容过多，div被撑开
		}
		
		
	}

	.shouldShow {
		visibility: hidden;
	}

	.line-container {
		width: 20px;
		margin-left: 5px;
		margin-right: 5px;
		display: flex;
		flex-direction: column;
		align-items: center;

		.line {
			background-color: #1296db;
			width: 4px;
			flex: 1;
			opacity: 0.7;
		}

		.circle {
			width: 16px;
			height: 16px;
			border-radius: 50%;
		}

	}
	
	.tagclass{
		//卡片内 tag的样式
		border-radius: 5px;
		padding: 1px;
		// background-color: #007947;
	}
	
	.itemclass{
		border-radius: 5px;
	}
</style>
