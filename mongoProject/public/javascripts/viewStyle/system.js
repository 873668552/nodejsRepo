// info_admin admin_ol   info_option option_ol
// 结构体

const TYPE={
TYPE_ADMIN:1,
TYPE_MANA:2
}

// info_admin 开关事件
var adFlag = true;
$('.info_admin').on('click',function(){
    if(adFlag){
        $(this).css('background','url(/images/jian.jpg) no-repeat left 22px');
        adFlag = false;
    }else{
        $(this).css('background','url(/images/jia.jpg)no-repeat left 22px')
        adFlag = true;
    }
    $('.admin_ol').stop().fadeToggle(1000)
})
// admin的操作事件
$('.admin_ol').on('click', function(e){
    e = e || window.event;
    var tar = e.target || e.srcElement,
    ind = $(tar).index();

    // ajax发送数据
    switchType(ind,TYPE.TYPE_ADMIN);

    // 阻止事件冒泡
    return false;
})

// info_option 开关事件
var opFlag = true;
$('.info_option').on('click',function(){
    if(opFlag){
        $(this).css('background','url(/images/jian.jpg) no-repeat left 22px');
        opFlag = false;
    }else{
        $(this).css('background','url(/images/jia.jpg)no-repeat left 22px')
        opFlag = true;
    }
    $('.option_ol').stop().fadeToggle(1000)
})
// info_option的操作事件
$('.option_ol').on('click', function(e){
    e = e || window.event;
    var tar = e.target || e.srcElement,
    ind = $(tar).index();

    // ajax发送数据
    switchType(ind,TYPE.TYPE_MANA);

    // 阻止事件冒泡
    return false;
})
////////////////////////////////////
// 请求功能
function switchType(ind,type){
    if(type == 1){
        switchTypeOne(ind);
    }else{
        switchTypeTwo(ind);
    }
}
// admin事件
function switchTypeOne(ind){
    switch(ind){
        // 修改密码
        case 0 : adminPage(0) ;break;
        // 添加
        case 1 : adminPage(1) ;break;
        // 删除
        case 2 : adminPage(2) ;break;
    }
}
// mange事件
function switchTypeTwo(ind){
    switch(ind){
        // 查看
        case 0 : manaPage(ind);break;
        // 增加
        case 1 : manaPage(ind);break;
        // 删除
        case 2 : manaPage(ind);break;
    }
}
// 页面重绘
var dom = document.querySelector('.midRight');
var id_count = 0;
function manaPage(ind){
    if(ind == 0){
        lookAll();
    }
    if(ind == 1){
        addGood();
    }
    if(ind == 2){
        lookAll();
    }
}
function adminPage(ind){
    // midRight
    var midRight = document.querySelector('.midRight'),
    p = document.createElement('p');
    midRight.innerHTML = '';
    p.style.height = '30px';
    p.style.padding = '10px 100px';
    p.style.lineHeight = '30px';
    p.style.textAlign = 'left';
    p.style.fontSize = '12px';
    midRight.style.border = '1px solid #999';
    midRight.style.background = '#fff';
    if(ind == 0){// 修改密码
        // 旧密码
        var old = p.cloneNode(true),
        oldinp =document.createElement('input');
        old.innerHTML = '旧密码';
        oldinp.id = 'oldinp';
        old.appendChild(oldinp);
        // 新密码
        var newp = p.cloneNode(true),
        newinp = document.createElement('input');
        newp.innerHTML = '新密码';
        newinp.id = 'newinp';
        newp.appendChild(newinp);
        // 旧密码
        var confirm = p.cloneNode(true),
        sureinp = document.createElement('input');
        confirm.innerHTML = '请确认';
        sureinp.id = 'sureinp';
        confirm.appendChild(sureinp);
        // btn 
        var btn = document.createElement('button');
        btn.style.marginLeft = '150px'
        btn.innerHTML = '确认';
        btn.onclick = ()=>{
            if( sureinp.value == '' || newinp.value == ''){
                alert('请输入新密码')
            }
            else if(sureinp.value == newinp.value){
                getData(sureinp.value,oldinp.value);
            }else{
                alert('两次密码不相同');
            }
            return false;
        }
        // 添加
        var tardom = document.createDocumentFragment();
        tardom.appendChild(old);
        tardom.appendChild(newp);
        tardom.appendChild(confirm);
        tardom.appendChild(btn);
        midRight.appendChild(tardom);
    }
    if(ind == 1){
        addP(p,midRight,ind);
    }
    if(ind == 2){
        addP(p,midRight,ind);
    }
}
function addP(p,domCon,type){
    var p1 = p.cloneNode(true),
    p2 = p.cloneNode(true);
    // domCon.innerHTML = '';
    if(type == 1){

        p1.innerHTML = '账户';
        var admininp = document.createElement('input');
        p1.appendChild(admininp);
        p2.innerHTML = '密码';
        var passwordInp = document.createElement('input');
        p2.appendChild(passwordInp);
        
        var btn = document.createElement('button');
        btn.style.marginLeft = '150px'
        btn.innerHTML = '确认';
        btn.onclick = ()=>{
            if(admininp.value == 0 || passwordInp.value == 0){
                alert('账户和密码不能为空')
            }else{
                addAdmin(admininp.value,passwordInp.value);
            }
            return false;
        }
        var dom = document.createDocumentFragment();
        dom.appendChild(p1);
        dom.appendChild(p2);
        dom.appendChild(btn);
        domCon.appendChild(dom);
    }
    if(type == 2){
        var adminName = document.createElement('input');
        p1.innerHTML = '用户';
        p1.appendChild(adminName);
        var btn = document.createElement('button');
        btn.style.marginLeft = '150px'
        btn.innerHTML = '确定';
        // 箭头函数定义可以减少this指向问题
        btn.onclick = ()=>{
            deleAdmin(adminName.value);
        }
        domCon.appendChild(p1);
        domCon.appendChild(btn);
    }
}
// ajax封装
function getData(password,oldpassword){
    console.log(oldpassword,password);
    $.ajax({
        url:'/system/password',
        type:'POST',
        data:{
            username:localStorage.getItem('admin'),
            password:password,
            type:localStorage.getItem('adminType'),
            oldPass:oldpassword ? oldpassword : 'unold'
        },
    }).then(succ,faild)
}
function addAdmin(admin,password){
    $.ajax({
        url:'/system/add',
        type:'POST',
        data:{
            username:admin,
            password:password,
            type:localStorage.getItem('adminType')
        },
    }).then(succ,faild)
}
function deleAdmin(admin){
    $.ajax({
        url:'/system/dele',
        type:'POST',
        data:{
            username:admin,
            type:localStorage.getItem('adminType')
        },
    }).then(succ,faild)
}
// 查看
function lookAll(){
    $.ajax({
        url:'/goods'
    }).then(refresh,faild)
}
lookAll();
// 添加商品
function addGood(){
    dom.innerHTML = '';
    dom.innerHTML = `
        <p>名称 <input id="add_title" type="text"></p>
        <p>图片 <input id="add_img" type="text"></p>
        <p>价格 <input id="add_price"  type="text"></p>
        <p>类型 <input id="add_type"  type="text"></p>
        <p>年份 <input id="add_year"  type="text"></p>
        <button id="add_btn">确定</button>`
    // 记录id
    var title = document.getElementById('add_title'),
    add_img = document.getElementById('add_img'),
    add_price = document.getElementById('add_price'),
    add_type = document.getElementById('add_type'),
    year = document.getElementById('add_year');
    document.getElementById('add_btn').onclick = ()=>{
        $.ajax({
            url:'/goods/add',
            data:{
                title:title.value,
                image:add_img.value,
                price:add_price.value,
                type:add_type.value,
                year:year.value
            },
            type:'post'
        }).then( (res)=>{
            switch(res){
                case 'same':alert('有相同的商品');break;
                default:refresh(res);break;
            }
        } ,faild)
    }    
}
// 用后端发送的数据刷新页面
function refresh(arr){
    // 刷新页面
    console.log(arr);
    id_count = arr.length;
    var reresh = new RefreshObj(dom,arr);
    reresh.init();
    // 释放空间
    reresh = null;
}
// ajax 成功
function succ(res){
    console.log(res);
    switch(res){
        case 'ok':alert('成功修改密码');break;
        case 'no':alert('旧密码输入错误');break;
        case 'noType':alert('没有权限');break;
        case "noAdmin":alert('数据库没有这个用户');break;
        case 'dberr':alert('服务器维护中');break;
        case "same":alert('有相同的用户');break;
        case 'new': alert('添加成功');break;
        case 'noDele': alert('boss用户不能删除');break;
        case 'noUer':alert('没有可以删除的用户或者访问不到');break;
    }
}

// ajax 失败
function faild(res){
    alert(res);
}

// 刷新页面的操作对象
class RefreshObj{
    constructor(dom,data){
        this.dom = dom;
        this.data = data;
        this.dataLen = data.length;
    }
    init(){
        // 1 构造结构
        //
        dom.innerHTML = `
            <div id = "Re_div">
            </div>
            <div id = "btn_spans">
            </div>
        `;
        var tar = document.createDocumentFragment(),
        divshow = document.getElementById('Re_div'),
        divbtn = document.getElementById('btn_spans'),
        arr = this.data;
        // 添加删除事件
        this.adddele(divshow);
        // console.log(arr,divshow,divbtn);
        this.addshow(divshow,arr,0);
        for(var i = 1 ,count =Math.ceil(this.dataLen/5); i <= count;i ++ ){
            divbtn.innerHTML += `<span ind = "${i}">${i}</span>`
        }
        // 绑定翻页事件
        Array.from(divbtn.children).forEach((val,spanind)=>{
            // 避免this指向问题
            val.onclick = ()=>{
                let ind = parseInt(val.getAttribute('ind'));
                this.addshow(divshow,this.data,5*spanind)
            }
        })
    }
    // 添加商品
    addshow(divshow,arr,ind){
        console.log(ind);
        divshow.innerHTML = '';
        for(var i = arr.length -ind-1, len = i - 5; i > len; i--){
            divshow.innerHTML += `
                <ul ind = "${arr[i].title}">
                    <li><img src="${ arr[i].image }" alt=""></li>
                    <li>${ arr[i].title }</li>
                    <li>${ arr[i].type }</li>
                    <li>${ arr[i].year }</li>
                    <li id="dele_span">删除</li>
                </ul>
            `
            console.log(i);
        }
    }
    // 添加删除事件
    adddele(divshow){
        divshow.onclick = (e)=>{
            var e = e || window.event,
            tar = e.target || e.srcElement;
            if(tar.innerHTML == '删除'){
                console.log(tar.parentElement.getAttribute('ind'));
                $.ajax({
                    url:'/goods/dele',
                    type:'post',
                    data:{
                        ind:tar.parentElement.getAttribute('ind')
                    }
                }).then(refresh,faild)
            }
        }
    }
}
//////// 图片上传 topDiv uplode_ul
$('#uplode_ul').on('click',()=>{
    var div = document.createElement('div')
    div.id = 'iconDiv'
    div.style.background = '#5b483a';
    div.style.position = 'fixed';
    div.style.height = div.style.width = '100%';
    div.style.top = 0;
    div.innerHTML = `
    <form id="upload" enctype="multipart/form-data" method="post"> 
        <input type="file" name="file" id="pic"/> 
        <input id="btn" type="button" value="提交"/> 
        <span class="showUrl"></span> 
        <img src="" class="showPic" alt=""> 
    </form> `
    // 
    document.getElementById('topDiv').appendChild(div);
    alert(123)
    // 创建上传对象
    var btn = document.getElementById('btn');
    btn.onclick = ()=>{
        var form = document.getElementById('upload'), 
            formData = new FormData(form); 
            formData.append("username", localStorage.getItem('admin'));
            $.ajax({ 
            url:'/img',
            type:"post", 
            data:formData, 
            processData:false, 
            contentType:false, 
        }).then(change,faild)
    }
})
function change(res){
    document.getElementById('icon_img').src = res;
    // document.getElementById('iconDiv').parentElement.remove(document.getElementById('iconDiv'));
    document.getElementById('topDiv').removeChild(document.getElementById('iconDiv'))
}
// 注销事件
document.getElementById('loginout_div').onclick = ()=>{
    localStorage.setItem('adminType','');
    localStorage.setItem('admin','');
    location.href = '/';
}