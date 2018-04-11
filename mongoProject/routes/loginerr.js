var express = require('express');
var router = express.Router();
const mon = require('../otherModel/mongoConnect');

//
router.post('/', (req,res,next)=>{
    // 操作对象
    var admin = req.body.admin;
    console.log(admin);
    // 连接数据库
    mon.connectDB('mongodb://localhost:27017','account','admin',function(coll,db){
      // 查询
      coll.find({admin:admin}).toArray( (err,result)=>{
          
        if(result.length == 0 || result.length != 1){
            res.render('loginErr',{admin:admin});
        }else{
            console.log(result)
            res.render('system',{admin:result[0].admin,type:result[0].type});
        }
        db.close();
      } )
    })
})
module.exports = router; 