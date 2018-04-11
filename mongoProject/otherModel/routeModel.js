// 引用模块中的变量
const route = require('express').Router();

function router(path,view,data){
    route.get(path,function(req,res,next){
        console.log(req.body,'view  '+ view);
        res.render(view,data)
    })
    // 
    return route;
}
//
module.exports = router;
