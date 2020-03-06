<template>
	<div class="bar">
		<BarItem path="history" activeColor="#1296db">
			<img slot="icon" src="../../static/image/menu/history.png" class="icon"></img>
			<img slot="icon_active" src="../../static/image/menu/history_active.png" class="icon"></img>
			<div slot="text" class="text">足迹</div>
		</BarItem>
		<BarItem path="check" activeColor="#1296db">
			<img slot="icon" src="../../static/image/menu/check.png" class="icon"></img>
			<img slot="icon_active" src="../../static/image/menu/check_active.png" class="icon"></img>
			<div slot="text"  class="text">查看</div>
		</BarItem>
		<BarItem path="img" activeColor="#1296db">
			<img slot="icon" src="../../static/image/menu/img.png" class="icon"></img>
			<img slot="icon_active" src="../../static/image/menu/img_active.png" class="icon"></img>
			<div slot="text"  class="text">每日一图</div>
		</BarItem>
		<BarItem path="profile" activeColor="#1296db">
			<img slot="icon" src="../../static/image/menu/profile.png" class="icon"></img>
			<img slot="icon_active" src="../../static/image/menu/profile_active.png" class="icon"></img>
			<div slot="text"  class="text">我的</div>
		</BarItem>
	</div>
</template>
<script>
	import BarItem from './BarItem.vue';
	export default{
		name: 'Bar',
		components:{
			BarItem
		}
	}
</script>

<style>
	.bar{
		display: flex;
		text-align: center;
		bottom: 0;
		position: fixed;
		left: 0;
		right: 0;
		background: #f6f6f6;
		padding-top: 5px;
		
		
	}
	.icon{
		vertical-align: middle;
		height: 64rpx;
	
	}
	.text{
		font-size: 0.8em;
	}
	
</style>
