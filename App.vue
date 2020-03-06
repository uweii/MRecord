<script>
	import dbHelper from './db-helper.js'
	import Global from './global.js'
	
	
	export default {
		mounted() {
			console.log("mounted")
			uni.getStorage({
				key: 'setting',
				success: function(res) {
					console.log(res)
					let imgType = res.data.imgType   //0妹子 1 动漫
					let isOpen = res.data.isOpen   //0关闭 1 开启
					Global.setImgType(imgType)
					Global.setAudioOpen(isOpen)
				},
				fail: function() {
					console.log("默认设置不存在！")
					Global.update(0,0)
				}
			})
			
		},
		onLaunch: function() {
			console.log('App Launch')
			uni.onTabBarMidButtonTap(function(){
				console.log("onTabBarMidButtonTap");
				uni.navigateTo({
					url: '../add/Add'
				})
			})
		},
		onShow: function() {
			console.log('App Show')
			dbHelper.initDB()
			const record = {money: 50, time : "2020-02-20 18:00:00", type: "0", tag: "工资", moon: 5, remarks: "哈哈哈哈"}
			// dbHelper.save(record)
			
		},
		onHide: function() {
			console.log('App Hide')
		},
	
	}
</script>

<style>
	/*每个页面公共css */
	html,body{
		height: 100%;
	}
</style>
