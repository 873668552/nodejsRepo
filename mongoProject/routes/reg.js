
const route = require('express').Router();
const mon = require('../otherModel/mongoConnect');
// 加密模块
const encryModel = require('../otherModel/encrypted');

//、、、、、、、、 自定义路由
route.get( '/',(red,res,next)=>{
    res.render('reg',{
        title:'注册'
    })
})

// 注册事件
route.post('/confirm',(req,res,next)=>{
    // 1 操作数据
    var username = req.body.uer;
    var password = req.body.password;

    // 2 数据库操作
    mon.connectTarget('mongodb://localhost:27017',"account","user",{"name":username},function(result,db){
        
        if(req.body.uer == ''){
            res.send('123');//用户名为空
        }else{
            // 构建插入数据库的对象
            let reqJson = req.body;
            reqJson.token = '';
            // 3 发送前端转台
            sendStateNum(res,result,db.db('account').collection('user'),{
                "name" : username,
                "password" : encryModel.encryptPassword(password),
                "taken" : "112"
            });
            // 关闭数据库
            db.close();
        }
    })
})

// 辅助方法
/// 发送状态
function sendStateNum(res,result,coll,data){
    if(result.length == 1){
        res.send('1')//用户存在
    }
    // 插入新数据
    else if(result.length == 0){
        mon.insert(coll,data);
        res.send('888');
    }
    else{
        res.send('0'); //数据库错误
    }
}

// 抛出自定义路由方法
module.exports = route;