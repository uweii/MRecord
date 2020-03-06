<template>
	<div class="container" v-on:click="itemClick">
		<div v-if="!isActive"><slot name="icon"></slot></div>
		<div v-else><slot name="icon_active"></slot></div>
		<div v-bind:style="activeStyle"><slot name="text"></slot></div>
	</div>
</template>

<script>
	export default{
		props: {
			path: {
				type: String,
			},
			activeColor:{
				type: String,
				default : "#1296db"
			}
		},
		methods: {
			itemClick() {
				console.log("click")
				this.$router.replace(this.path)
			}
		},
		computed: {
			isActive() {
				return this.$route.path.indexOf(this.path) !== -1 
			},
			activeStyle(){
				return this.isActive ? {color: this.activeColor} : {}
			}
		}
	}
</script>

<style>
	.container{
		flex: 1;
	}
</style>
