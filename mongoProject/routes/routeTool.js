// 定义
function splitData(res){
    var arr = [];
    res.forEach(function(res){
        arr.push({
            title:res.title,
            image:res.images.small
            // type:res.genres[0]+res.genres[1],
            // year:res.year,
            // price:price()
        })
    })
    return arr;
}
function price(){
    return 20 + parseInt(Math.random()*100);
}
////////////////////////////////////
// 请求功能
function switchType(ind,type){
    if(type == 1){
        switchTypeOne(ind);
    }else{
        switchTypeTwo(ind);
    }
}
// admin模式
function switchTypeOne(ind){
    switch(ind){
        case 0 : $.ajax({
            url:'/system/password',
            type:'POST',
            data:{
                username:1,
                password:1,
                type:0
            },
        }).then(succ,faild);
    }
}
// mange模式
function switchTypeTwo(ind){
    switch(ind){
        case 0 : $.ajax({
            url:'/system/password',
            type:'POST',
            data:{
                username:1,
                password:1,
                type:0
            },
        }).then(succ,faild);
    }
}
// ajax 成功
function succ(res){
    console.log(res);
    switch(res){
        case 'ok':alert('成功修改密码');break;
        case 'no':alert('两次密码相同');break;
    }
}
// ajax 失败
function faild(res){
    alert(res);
}
// 抛出
module.exports = {
    splitData:splitData,
    switchType:switchType
}