<template>
	<view class="history-container">
		<Item v-if="reload" :key="i" v-for="(item, i) in mylist" :isLeft="i % 2 == 0" v-bind:money="item.money" :time="item.time" v-bind:type="item.type" v-bind:remark="item.remarks" :tag="item.tag"></Item>
	</view>
</template>

<script>
	import Item from './Item.vue'
	import dbHelper from '../../db-helper.js'
	import Utils from '../../utis.js'
	export default {
		mounted() {
			this.update(1)
			this.monitoring() //注册监听时间
		},
		methods: {
			torefreshView(){
				this.reload = false;
				this.$nextTick(function(){
					this.reload = true
				})
			},
			monitoring(){
				Utils.$on('onload', ()=>{
					console.log("监听到")
					this.mylist = []
					console.log(this.mylist.length)
					this.update(1,false)
				})
			}
			
			,update(page,notRfresh){
				const inner = this
				dbHelper.selectAll(page).then((res) => {
					if(res.length == 0){
						console.log("nomoredatah")
						Utils.$emit('noMoreData')
						return
					}
					for(var i in res){
						console.log(res[i])
						this.mylist.push(res[i])
					}
					if(notRfresh){
						return
					}
					inner.torefreshView()
				})
			},
			add(page){
				this.update(page,true)
			},
			refresh(){
				this.mylist = []
				this.update(1,false)
			}
		},
		onLoad: () => {
			console.log("===========onload")
		},
		data() {
			return {
				mylist: [],
				reload: true
			}
		},
		components: {
			Item
		},
	}
</script>

<style>
	.history-container{
		width: 100%;
		margin-top: 10px;
	}
		
</style>
