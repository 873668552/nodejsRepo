const crypto = require('crypto');
const fs = require('fs');
/// 密码加密
function encryptPassword(str){
    const cipher = crypto.createCipher('aes192', "a passworld");
    //流;
    //载入一个密码，并规定输入和输出值;
    let encrypted = cipher.update(str, 'utf8', 'hex');
    //最后输出数据 ， 及后缀。
    encrypted += cipher.final('hex');
    return encrypted;
}

// 创建token
function createToken(username){
    // 1 头部
    var header = objToHex({
        "typ":"JWT",
        "alg":"sha1"
      }),
    // 2 中间部分
      middle = objToHex({
        "iss":"public.com",
        "exp":new Date().getTime() + 100000,
        "name":username
      });
      // 返回文件加密结果
      return fileToHex(header,middle);
}
// 二进制流编码初步加密
function objToHex(obj){
    return Buffer.from( JSON.stringify(obj) ).toString('hex');
} 
// 文件加密
function fileToHex(first,middle){
    var key = fs.readFileSync(__dirname + '/../server.pem').toString('ascii');
    const hash = crypto.createHmac('sha1',key)
    .update(first + ' ' + middle)
    .digest('hex');
    return first + '.' + middle + '.' + hash;
}
// 解码
function decodeHex(str){
    return Buffer.from(str,'hex').toString('utf8');
}
// 抛出模块
module.exports = {
    encryptPassword:encryptPassword,
    createToken:createToken,
    decodeHex:decodeHex
}