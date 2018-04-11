var express = require('express');
var router = express.Router();
const encry = require('../otherModel/encrypted');
const mon = require('../otherModel/mongoConnect');
const multiparty = require('multiparty');
// 
const fs = require('fs');
/* GET home page. */
router.get('/', function(req, res, next) {
  // console.log();
  var token = '';
  if(req.cookies['token']){
    // 解码获取用户名
    token = JSON.parse( encry.decodeHex(req.cookies['token'].split('.')[1]) ).name;
  }
  // console.log(token);
  if(token){
    res.render('index',{title:'Index',token:token});
  }else{
    res.render('index', { title: '后台管理系统',token:''});
  }
});
// 普通登录
router.get('/untoken',function( req,res,next ){
  console.log(typeof req.url);

  res.render('index',{
    title:'Index',
    token:req.url.split('=')[1]
  })
})
router.get('/confirm', function(red,res,next){
  // red.cookies['token'] = null;
  res.send('ok');
})

// 超级用户登录
router.post('/manage', (req,res,next)=>{
  // 操作数据对象
  var username = req.body.username,
      password = encry.encryptPassword(req.body.password);
  // 数据库操作
  mon.connectDB('mongodb://localhost:27017','account','admin',function(coll,db)  {

    coll.find({admin:username}).toArray( (err,result)=>{
      if(result.length == 0 || result.length != 1){
        res.send('noAdmin');
        db.close();
      }else{
        if( password == result[0].password ){
          res.send('ok');
          db.close();
        }else{
          res.send('1');db.close();
        }
      }
    })
  })
} )

// system /////////////////////////////// password
router.get('/system', (req,res,next)=>{
  // 操作对象
  var admin = req.url.split('=')[1];
  mon.connectDB('mongodb://localhost:27017','account','admin',function(coll,db){
    // 查询
    coll.find({admin:admin}).toArray( (err,result)=>{
      if(result.length == 0 || result.length != 1){
        res.render('loginErr',{admin:admin});
      }else{
        res.render('system',{admin:result[0].admin,type:result[0].type,img: result[0].img } );
      }
      db.close();
    } )
  })
})
//http://localhost:3000/system/password
router.post('/system/password',(req,res,next)=>{
  // 操作对象
  var body = req.body,
  username = body.username,
  type = body.type;
  password = encry.encryptPassword(body.password),
  oldpass = body.oldPass;
  console.log(oldpass,body);
  if(oldpass == 'unold'){
    res.send('no')
  }
  else{// 数据库操作
    mon.connectDB('mongodb://localhost:27017','account','admin',function(coll,db) {

      coll.find({admin:username}).toArray( (err,result)=>{

        if(result.length == 0){
          res.send('noAdmin')
          db.close();
        }else if(result.length > 1){
          res.send('dberr');
          db.close();
        }else{
          console.log(oldpass);
          if(result[0].password == encry.encryptPassword(oldpass)){
            // 插入数据
            mon.upData(coll,{
              username:username,
              password:password
            },function(){
              db.close();
            })
            res.send('ok')
          }else{
            res.send('no');
          }
        }
      })
    })
  }
})
// 添加新用户
router.post('/system/add',(req,res,next)=>{
  // 操作对象
  var body = req.body,
  username = body.username,
  password = encry.encryptPassword( body.password ),
  type = body.type;
  console.log(username,password);
  // 数据库操作
  if(type != 0){
    res.send('noType');
  }else{
    mon.connectDB('mongodb://localhost:27017','account','admin',function(coll,db) {
      coll.find( {username:username} ).toArray( (err,result)=> {
        // console.log(result);
        if(result.length == 0){
          coll.insertOne({admin:username,password:password,type:'1'}, function(err, result) {
            if (err) throw err;
            console.log("文档插入成功");
            db.close();
            res.send('new');
          });
        }else{
          res.send('same');
          db.close();
        }
      })
    })
  }
})
router.post('/system/dele',(req,res,next)=> {
  // 操作对象
  var body = req.body,
  type = body.type,
  username = body.username;
  // 数据库操作
  // 权限不够不让操作
  if(type != '0'){
    res.send('noType')
  }else{
    mon.connectDB('mongodb://localhost:27017','account','admin',function(coll,db) {
      coll.find({admin:username}).toArray( (err,result)=>{
        if(result.length == 1,result[0].type == '1'){
          coll.deleteOne({admin:username},(err,tar)=>{
            res.send('ok');
            db.close();
          } )
        }else{  
          res.send('noUer');
          db.close();
        }
      })
    })
  }
})
// goods接口 
router.get('/goods', (req,res,next)=> {
  // 1 连接数据库
  mon.connectDB('mongodb://localhost:27017','Goods','shops',function(coll,db){
    // 查询
    // mon.searchArr(db,coll,0, 20 ,function(db,result){
    //     res.send(result );
    //     db.close();
    // })
      mon.getAll(coll,function(result){
        res.send(result);
        db.close();
      })
  });
})
// 删除/goods/dele
router.post('/goods/dele', (req,res,next)=> {
  // 1 操作对象
  console.log(req.body.ind);
  // 2 连接数据库
  mon.connectDB('mongodb://localhost:27017','Goods','shops',function(coll,db){
    // 删除
    mon.deleData(coll,{title:req.body.ind},function(){
      // 查询
      // mon.searchArr(db,coll,0, 20 ,function(db,result){
      //   res.send(result);
      //   db.close();
      //  })
        mon.getAll(coll,function(result){
          res.send(result);
          db.close();
        })
    })
  });
})
router.post('/goods/add', (req,res,next)=> {
  // 1 操作对象
  var body = req.body,falg = false,
  data = {
    title:body.title,
    image:body.image,
    price:body.price,
    type:body.type,
    year:body.year
  };
  // 2 连接数据库
  mon.connectDB('mongodb://localhost:27017','Goods','shops',function(coll,db) {
    // 查找有没有相同的
    mon.getAll(coll,function(result){
      // 
      for(var i = 0 ,len = result.length; i <len;i++ ){
        if(result[i].title == req.body.title){
          falg =true;
          break;
        }
      }
      if(falg){
        res.send('same');
        db.close();
      }else{
        mon.insert2(coll,data,function(){
          result.push(data);
          res.send(result);
          db.close();
        })
      }
    })
  })
})
//图片上传
router.post('/img',(req,res,next)=>{

  var form = new multiparty.Form({uploadDir:'public/images/user', autoFiles:true});
  var d = new Date();
  // sec 文件存放的地方
  form.parse(req , (err,first ,sec)=>{
    console.log(sec)
    console.log(first.username[0])
    // console.log(req.body.username);
    var curPath = getPath(sec.file[0].path)+ d.setDate(1) + sec.file[0].originalFilename;
    fs.rename(sec.file[0].path,curPath);//改变路径
    // 存路径到数据库
    mon.connectDB('mongodb://localhost:27017','account','admin',function(coll,db) {
      console.log(first.username[0],curPath)
      var data = [
        {admin:first.username[0]},
        {$set: {img:removeFirst(curPath) } }
      ]
      mon.upData2(coll,data);
      db.close();
      res.send(removeFirst(curPath) );
    })
  })
})
// 测试图片上传
// router.get('/test',(req,res,next)=>{
//   console.log(req)
//   // 1 设置下载文件路径
//   var form =new multiparty.Form( {uploadDir:'public/images/test/', autoFiles:true} );
//   // 2 解析请求数据
//   form.parse(req,  (err,param,file)=>{
//     var old = file[0].path,
//     newname = getPath(sec.file[0].path)+ d.setDate(1) + sec.file[0].originalFilename;
//     fs.rename(old,newname,(err)=>{
//       throw err;
//     });
//     res.render(newname);
//   })
// })
router.post('/test',(req,res,next)=>{
  // 1 设置下载文件路径
  var form = new multiparty.Form( {uploadDir:'public/images/test', autoFiles:true} ),
  d = new Date();
  // var form = new multiparty.Form( {uploadDir:'public/images/test', autoFiles:true} );
  // 2 解析请求数据
  form.parse(req,  (err,param,file)=>{
    console.log(param,file)
    // var old = file.file[0].path,
    // newname = getPath(file.file[0].path)+ d.setDate(1) + file.file[0].originalFilename;
    // fs.rename(old,newname,(err)=>{
    //   throw err;
    // });
    // res.send('newname');
    res.send(d)
  })
  
})
router.get('/testWeb',(req,res,next)=>{
  res.render('test',{title:'测试图片上传'});
})
function getPath(str){
  var arr = str.split('\\'),tar = '';
  for(var i = 0,len = arr.length -1; i < len; i ++){
    tar += arr[i] + '/';
  }
  return tar;
}
function removeFirst(str){
  var arr = str.split('/'),tar = '/';
  for(var i = 1,len = arr.length; i < len; i ++){
    if(i == len-1){
      tar += arr[i]
    }else{
      tar += arr[i] + '/';
    }
  }
  return tar;
}
module.exports = router; 
