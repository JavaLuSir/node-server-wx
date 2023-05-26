const {writeFile,readFile} = require('fs')
const axios = require('axios')
const config = require('../config')

class WX{
	getAccessToken(){

	  return new Promise((resolve,reject)=>{
	  	const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${config.appid}&secret=${config.secret}`;
		const headers = {
		  'hostname': 'api.weixin.qq.com',
		  'Content-Type': 'application/json'
		};
	  	  axios.get(url,{headers})
		  .then(response => {
		    response.data.expires_in=Date.now()+(response.data.expires_in-300)*1000;
		    console.log('请求微信服务器获取token:'+JSON.stringify(response.data))
		    resolve(response.data)
		  })
		  .catch((error) => {
		    console.error(`Error: ${error.message}`);
		    reject('getAccessToken方法请求失败');
		  });
	  })

	}
	saveAccessToken(accessToken){
		console.log('savedata',accessToken)
		console.log('进入savetoken'+JSON.stringify(accessToken))
		return new Promise((resolve,reject)=>{
			writeFile('./accessToken.txt',JSON.stringify(accessToken),err=>{
				if(!err){
					resolve(accessToken)
				}else{
					reject('保存token失败'+err);
				}
			});
		});
	}
	readAccessToken(){
		return new Promise((resolve,reject)=>{
			readFile('./accessToken.txt',(err,data)=>{
				if(!err){
					console.log('读取成功')
					if(data!=''){
						data = JSON.parse(data)	
					}
					resolve(data);
				}else{
					reject('读取token方法出了问题'+err);
				}
			})
			
		}).catch(error=>{
			console.error('文件格式错误');
		});
		
	}
	isValidAccessToken(tokenData){
		if(!tokenData&&!tokenData.access_token&&!tokenData.expires_in){
			return false;
		}
		return tokenData.expires_in>Date.now();
	}
	fetchToken(){
		if(this.access_token&&access_token.expires_in&&this.isValidAccessToken(this)){
			return Promise({
				access_token:this.access_token,
				expires_in:this.expires_in
			})
		}
		return this.readAccessToken()
			.then(async res=>{
				if(this.isValidAccessToken(res)){
					console.log('走的if')
					return Promise.resolve(res)
				}else{
					console.log('走的else')
					const ccc = await this.getAccessToken()
					this.saveAccessToken(ccc)
					return Promise.resolve(ccc)
					
				}
			})
			.catch(async err=>{
				console.log('走的catch')
				const ccc = await this.getAccessToken()
				this.saveAccessToken(ccc)
				return Promise.resolve(ccc)
			})
			.then(res=>{
				this.access_token=res.access_token;
				this.expires_in= res.expires_in;
				return Promise.resolve(res)
			})

	}
}
module.exports=WX
