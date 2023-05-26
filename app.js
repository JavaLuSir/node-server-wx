const express = require('express');
const auth = require('./wechat/auth');
const axios = require('axios');
const WX = require('./wechat/accessToken')
const app = express();

app.get('/wx/test/',(req,res,next)=>{
	const wx = new WX();
	let mmb = {}
	wx.fetchToken().then(async data=>{
		mmb=await wx.getAccessToken();
		console.log(mmb)
		res.send(mmb)
	})
})

app.use('/wx',auth())

app.listen(8080,()=>{
	console.log('server listening 8080')
})
