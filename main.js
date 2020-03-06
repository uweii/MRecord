import Vue from 'vue'
import App from './App'


Vue.config.productionTip = false




App.mpType = 'app'

const app = new Vue({
    ...App
})




	app.$mount(); //为了兼容小程序及app端必须这样写才有效果



