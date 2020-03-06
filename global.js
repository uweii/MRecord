const Global = {}
Global.imgType = 0 //0 :妹子  1: 动漫
Global.audioOpen = 0 //默认关闭

Global.getImgType = function() {
	return Global.imgType
}

Global.setImgType = function(type) {
	Global.imgType = type
}


Global.setAudioOpen = function(value) {
	Global.audioOpen = value
}

Global.getAudioOpen = function() {
	return Global.audioOpen
}

Global.update = function(imgType, audioOpen) {
	Global.setImgType(imgType)
	Global.setAudioOpen(audioOpen)
	uni.setStorage({
		key: 'setting',
		data: {
			"imgType": imgType,
			"isOpen": audioOpen
		},
		success: () => {
			console.log("设置更新成功")
		},
		fail: () => {
			console.log("设置更新失败")
		}
	})
}
Global.playIncomeAudio = function() {
	const innerAudioContext = uni.createInnerAudioContext();
	innerAudioContext.autoplay = true;
	innerAudioContext.src = '/static/audio/bg.wav';
	innerAudioContext.play()
}


export default Global
