
const route = require('express').Router();
const encry = require('../otherModel/encrypted');
const mon = require('../otherModel/mongoConnect');

// 

// 自定义路由
route.get('/', (req, res , next)=>{
    res.render('login',{
        title:'登录'
    })
} )
route.post('/confirm', (req,res,next)=>{
    //  操作对象
    var accjson = req.body,
    username = accjson.username,
    password = encry.encryptPassword(accjson.password),
    isToken = accjson.token;
    
    // 连接数据库 查询
    mon.connectTarget('mongodb://localhost:27017',"account","user",{"name":username},function(result,db){
        
        if(result.length == 0){
            res.json({
                name:username,
                password:password,
                state:'noData'
            });
        }else{
            if(result[0].password == password){
                // 成功时候
                if(isToken == 'true'){
                    // 插入token
                    let objToken = encry.createToken(username);
                    mon.insert(db.db('tokens').collection('tokens'),{
                        name:username,
                        token:objToken
                    })
                    // 后端 cookie 操作
                    // maxAge?: number;
                    // signed?: boolean;
                    // expires?: Date | boolean;
                    // httpOnly?: boolean;
                    // path?: string;
                    // domain?: string;
                    // secure?: boolean | 'auto';
                    // encode?: (val: string) => void;
                    // sameSite?: boolean | string;
                    var d = new Date();
                    d.setDate( d.getDate() + 15 );
                    res.cookie('token',objToken,{
                        expires:d
                    });
                    res.json({
                        name:username,
                        password:password,
                        state:'ok'
                    })
                }else{
                    res.json({
                        name:username,
                        password:password,
                        state:'ok1'
                    })
                }
                db.close();
            }else{
                res.send({
                    name:username,
                    password:password,
                    state:'no'
                });
                console.log('no');
                // 关闭数据库
                db.close();
            }
        }
       
    } )
} )
// 
module.exports = route;