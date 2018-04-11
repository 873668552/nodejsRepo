const route = require('express').Router();
const encry = require('../otherModel/encrypted');
const mon = require('../otherModel/mongoConnect');
// 1 
route.get('/',  (req,res,next)=>{
    res.render('admin',{title:'admin',arr:[1,2,3,4,5]});
} )
route.post('/pagetion', (req ,res ,next )=>{
    // 1 操作对象
    var page = parseInt(req.body.page);
    page = page ? page : 0;
    // 2 连接数据库
    mon.connectDB('mongodb://localhost:27017','test','site',function(coll,db){
        // 查询
        mon.searchArr(db,coll,page * 5, 5 ,function(db,result){
            res.send( require('./routeTool').splitData(result) );
            db.close();
        })
    });
} )
// 途牛
// route.get('/tuniu', (req,res,next)=>{
//     res.render('tuNiuProject/HTML/model');
// } )
// 2 
module.exports = route;