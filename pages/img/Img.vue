<template>
	<view style="width: 100%;height: 100%;background-color: #eeeeee;">
		<view class="container" @touchstart="touchstart" @touchend="touchend">
			<view class="img">
				<image mode="scaleToFill"  :fade-show="true" style="height: 100%;width: 100%;" :src="imgurl"></image>
			</view>
			<view class="text">
				<view class="content">{{essay.content}}</view>
				<view class="author">作者|{{essay.author}}</view>
				<view class="catname">
					{{essay.from}}
				</view>
				<image class="logo" src="../../static/image/history/sun.png"></image>
			</view>
		</view>
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
	const girlUrl = 'http://api.btstu.cn/sjbz/?lx=m_meizi'
	const cartoon = 'http://api.btstu.cn/sjbz/?lx=m_dongman'
	const sentence = 'https://api.ooopn.com/yan/api.php?type=json'
	import loading from '../../components/loading/loding.vue'
	import Global from '../../global.js'
	export default {
		components: {
			loading
		},
		name: "Img",
		onShow() {
			console.log("img on show")
			if(Global.getImgType()==0){
				this.originUrl = girlUrl
			}else{
				this.originUrl = cartoon
			}
			console.log(this.originUrl)
		}
		,
		mounted() {
			this.changeurl()
		},
		data() {
			return {
				imgurl: '',
				pos: { 
					x: 0,
					y: 0
				},
				secondurl: '',
				essay: {
					author: '',
					content: '',
					from: ''
				},
				originUrl: '' //从最初的网址获取图片url
			}
		},
		methods: {
			request(myurl) {
				return uni.request({
					url: myurl
				})
			},
			touchstart: function(e) {
				this.pos.x = e.changedTouches[0].clientX
				this.pos.y = e.changedTouches[0].clientY
			},
			touchend: function(e) {
				const subX = e.changedTouches[0].clientX - this.pos.x;
				const subY = e.changedTouches[0].clientY - this.pos.y;
				if (subX > 50 || subX < -50) {
					console.log("右滑动")
					this.changeurl()
					
				}
			},
			changeurl() {
				console.log(this.secondurl)
				if (this.secondurl != '') {
					console.log("2222222")
					this.imgurl = this.secondurl
					console.log(this.imgurl)
					this.backup()
				} else {
					console.log("1111111")
					this.$refs.loading.open()
					setTimeout(()=>{
						this.$refs.loading.close()
					},1000)
					this.request(this.originUrl).then(data => {
						var [error, res] = data
						if (error != null) {
							uni.showToast({
								title: '读取失败',
								duration: 500,
								icon: "none"
							})
							return
						}
						this.backup()
						console.log(res)
						this.imgurl = res.header.Location
						
					});
				}
				this.request(sentence).then(data => {
					var [error, res] = data
					if (error != null) {
						uni.showToast({
							title: '读取失败',
							duration: 500,
							icon: "none"
						})
						return
					}
					this.essay.author = res.data.author
					this.essay.content = res.data.hitokoto
					this.essay.from = res.data.catname
					console.log(this.essay)
				})
			},
			backup() {
				console.log("3333333")
				this.request(this.originUrl).then(data => {
					var [error, res] = data
					if (error != null) {
						uni.showToast({
							title: '读取失败',
							duration: 500,
							icon: "none"
						})
						return
					}
					let url = res.header.Location
					console.log(url)
					new Promise((resolve,reject)=>{
						uni.getImageInfo({
							src: url,
							success:(res)=>{
								console.log(res.path)
								resolve(res.path)
							}
							})
						}).then((res)=>{this.secondurl=res})
					
				});
				
			},
		}
	}
</script>

<style scoped>
	.container {
		height: 90%;
		width: 90%;
		margin: 0 auto;
		border-radius: 10px;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		position: relative;
		top: 50%;
		transform: translateY(-52%);
	}

	.img {
		flex: 2;
	}

	.text {
		flex: 1;
		background-color: #FFFFFF;
	}

	.content {
		color: #64646b;
		margin-top: 30px;
		font-size: 1em;
		padding-left: 5px;
	}

	.author {
		color: #b6b6b6;
		font-size: small;
		margin-top: 10px;
		padding-left: 5px;
	}

	.catname {
		margin-top: 10px;
		font-size: 0.8em;
		padding-left: 5px;
	}

	.logo {
		position: absolute;
		right: 10%;
		bottom: 5%;
		height: 100px;
		width: 100px;
	}
</style>
