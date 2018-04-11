const monClient = require('mongodb').MongoClient;
// "mongodb://localhost:27017/runoob";
function connectMongo(url,dbname,coll,res){
    // 1 连接
    return new Promise(function(succ,fail){
        monClient.connect(url,(err,db)=>{
            // 传值
            succ( {
                db:db,
                coll:db.db(dbname).collection(coll),
                res:res
            }  );
        })
    })
}
function connectDB(url,dbname,coll,fn){
    monClient.connect(url, (err,db)=> {
        if(fn){
            fn(db.db(dbname).collection(coll),db);
        }
    })
}
// 根据条件查询
function connectTarget(url,dbname,coll,query,fn){

    monClient.connect(url, (err,db)=>{
        db.db(dbname).collection(coll).find(query).toArray( (err,result)=>{
            // console.log(res);
            fn(result,db);
        } )
    } )
}
// 查找特定的数组
function searchArr(db,coll, start,count,fn){
    coll
    .find({})
    .skip(start)
    .limit(count)
    .toArray((err,result)=>{
        // 对外传值
        fn(db,result)
    })
}
function getTar(coll,start,count){
    // promise对象
    return new Promise( (succ,falil)=>{
        var arr =[];
        coll
        .find({})
        .skip(start)
        .limit(count)
        .toArray((err,result)=>{
            // 对外传值
            succ(result)
        })
    } )
}

function conFirm(coll,user,res){
    return new Promise( (succ,falid)=>{
        coll.find({"user":user}).toArray( (err,result)=>{
            
            succ({
                result:result,
                res:res
            });
        } )
    } )
}
// 查找全部
function getAll(coll,fn){
    coll.find({}).toArray( (err,result)=>{
        if(fn){
            fn(result)
        }
    } )
}
// 插入数据
function insert(coll,data){
    console.log(data);
    coll.insertOne(data, function(err, res) {
        if (err) throw err;
        console.log("文档插入成功");
    });
}
function insert2(coll,data,fn){
    console.log(data);
    coll.insertOne(data, function(err, res) {
        if (err) throw err;
        console.log("文档插入成功");
        if(fn){
            fn();
        }
    });
}
// 更新数据
function upData(coll,data,fn){
    console.log(data);
    coll.updateOne({admin:data.username},{$set: {password:data.password} } , (err,res)=>{
            if (err) throw err;
            console.log('更新成功');
            if(fn){
                fn();
            }
    } )
}
function upData2(coll,data,fn){
    console.log(data);
    coll.updateOne(data[0],data[1] , (err,res)=>{
        console.log(data[0],data[1])
            if (err) throw err;
            console.log('更新成功');
            if(fn){
                fn();
            }
    } )
}
// 删除
function deleData(coll,data,fn){
    console.log(data);
    coll.deleteOne(data , (err,res)=>{
        if (err) throw err;
        console.log('删除成功');
        if(fn){
            fn();
        }
    } )
}
// 抛出接口
module.exports = {
    connectMongo:connectMongo,
    getTar:getTar,
    conFirm:conFirm,
    connectTarget:connectTarget,
    insert:insert,
    connectDB:connectDB,
    searchArr:searchArr,
    getAll:getAll,
    upData:upData,
    deleData:deleData,
    insert2:insert2,
    upData2:upData2
}


// 'mongodb://localhost:27017','test','site'
// 创建数据库和集合
// myCon.connectMongo('mongodb://localhost:27017','test','site')
// .then(
// );