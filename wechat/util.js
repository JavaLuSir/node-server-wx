const {parseString} =require('xml2js') 
module.exports={
    getAsnycUserData(req){
        return new Promise((resolve,reject)=>{
            let xmlData = "";
            req.on('data',data=>{
                xmlData+=data.toString();
            }).on('end',()=>{
                resolve(xmlData);
            })
        })
    },
    parseAsnycXML(xmlData){
        return new Promise((resolve,reject)=>{
            parseString(xmlData,{trim:true},(err,data)=>{
                if(!err){
                    resolve(data)
                }else{
                    reject('parseXML错误'+err)
                }
            })
        })
    },
    formatData(jsObj){
        let message = {};
        jsObj = jsObj.xml;
        if( typeof jsObj === 'object'){
            for(let key in jsObj){
                let value = jsObj[key]
                if(Array.isArray(value)&&value.length>0){
                    message[key]=value[0]
                }
            }
        }
        return message;
    }
}