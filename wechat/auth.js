const config = require('../config');
const sha1 = require('sha1');
const {getAsnycUserData,parseAsnycXML,formatData} = require('../wechat/util')
const {chat} = require('../openai/openai')


module.exports =()=>{
	return async(req,res,next)=>{
	const {signature,echostr,timestamp,nonce} = req.query
	const {token} = config
	const arry = [timestamp,token,nonce]
	const arry_sort = arry.sort()
	const str =arry_sort.join('')
	const sha1_str = sha1(str)

	if(req.method ==='GET'){
		console.log('GET^')
		console.log(req.query)
		if(sha1_str === signature){
			res.send(echostr)
		}else{
			res.send('signature error')
		}
	}else if(req.method==='POST'){
		console.log('POST^')
		if(sha1_str !== signature){
			console.log('签名失败了')
			console.log(req.query)
			res.send('')
		}

	}
	//获取用户发送的消息
	/** 
	 <xml>
	 <ToUserName><![CDATA[gh_6b7408992cce]]></ToUserName>
		<FromUserName><![CDATA[ohlG96SvDeu0h24vp0a0u0uT7vaw]]></FromUserName>
		<CreateTime>1685082347</CreateTime>
		<MsgType><![CDATA[text]]></MsgType>
		<Content><![CDATA[北边]]></Content>
		<MsgId>24124578722625340</MsgId>
	 </xml>
	 **/
	const xmlData = await getAsnycUserData(req);
	/**
	 * {
		xml: {
			ToUserName: [ 'gh_6b7408992cce' ],
			FromUserName: [ 'ohlG96SvDeu0h24vp0a0u0uT7vaw' ],
			CreateTime: [ '1685082984' ],
			MsgType: [ 'text' ],
			Content: [ '基金' ],
			MsgId: [ '24124587581337919' ]
		}
		}
	 */
	const jsObj = await parseAsnycXML(xmlData);
	const beautyObj = formatData(jsObj);
	/**
	 * {
		ToUserName: 'gh_6b7408992cce',
		FromUserName: 'ohlG96SvDeu0h24vp0a0u0uT7vaw',
		CreateTime: '1685084254',
		MsgType: 'text',
		Content: 'xxxxxx',
		MsgId: '24124606605941162'
		}
	 */
	const prompt = beautyObj.Content;
	let replyMsg ='';
	if(beautyObj.MsgType==='text'){
		replyMsg = await chat(prompt)
	}else{
		res.send('sorry,暂时只能处理文字消息')
	}
	const replayXML = `<xml><ToUserName><![CDATA[${beautyObj.FromUserName}]]></ToUserName>
	<FromUserName><![CDATA[${beautyObj.ToUserName}]]></FromUserName>
	<CreateTime>${Date.now()}</CreateTime>
	<MsgType><![CDATA[text]]></MsgType>
	<Content><![CDATA[${replyMsg}]]></Content>
	</xml>`
	console.log(replayXML)
	res.send(replayXML)
  }
}