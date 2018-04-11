
/*
 * 功能：设置cookie
 * 参数：
 * 		_name	：表示cookie名称
 * 		_value	：表示cookie内容
 * 		_date	：表示过期时间（单位天）
 * 		_path	：表示cookie的有权使用的范围
 * 返回值：
 * 		无
 * 示例：
 * 		setCookie("a", "123"); 表示设置了一个名字叫做a的cookie，其内容为123，过期时间为会话
 * 		setCookie("a", "123", 1); 表示设置了一个名字叫做a的cookie，其内容为123，过期时间为明天
 * 		setCookie("a", "123", 1, "/javascript");
 * 		setCookie("a", "123", "/javascript");
 * 		setCookie("a", "123", new Date(), "/javascript");
 * 		setCookie("a","1", -2)；表示删除名字为a的cookie
 */
function setCookie(_name, _value, _date, _path){
	/*
	if(_date){
		var myDate = new Date();
		myDate.setDate( myDate.getDate()+_date );
		//myDate.setSeconds( myDate.getSeconds()+_date );
		document.cookie = _name+"="+_value+"; expires="+myDate.toGMTString();
	}else{
		document.cookie = _name+"="+_value;
	}
	*/
	
	// 支持所有类型的数据
	var obj = {
		"value" : _value	// 把cookie内容放到obj对象中
	}
	// 对象转字符串
	var objstr = JSON.stringify(obj);
	//console.log( objstr );
	
	
	var str = _name+"="+objstr;
	//var str = _name+"="+encodeURIComponent(_value);// 对内容进行编码
	// 判断第三个参数是否存在
	//console.log( Boolean(_date) );
	if( _date ){	// 如果参数_date有设置的话，隐式转换为布尔值时，为真；如果参数_date没有设置，转换为布尔值时为假。
		//判断第三个参数是过期时间还是有权范围
		switch( typeof(_date) ){	// 这个参数的数据类型是什么
			case "number":// 为过期时间
				var d = new Date();
				d.setDate( d.getDate()+_date );	// 过期时间为：当前的日期加几天
				str += ";expires="+d.toGMTString();
				break;
			case "object":// 为过期时间
				str += ";expires="+_date.toGMTString();
				break;
			case "string":// 为path
				str += ";path="+_date;
				break;
		}
	}
	// 如果第四个参数存在，并且第三个参数不是字符串的话，根据第四个参数来设置path属性
	// 原因：第三个参数如果是字符串的话，就以第三个参数设置path属性了
	if( _path && typeof(_date)!="string" ){//setCookie("a", "123", "x", "abc")
		str += ";path="+_path;
	}
	//console.log( str );
	// 真正的设置cookie
	document.cookie = str;
}

/*
 * 功能：删除cookie
 * 参数：
 * 		_name	：表示cookie名称
 * 		_path	：表示该cookie所在的位置
 * 返回值：
 * 		无
 * 示例：
 * 		removeCookie("a")	表示在当前目录下删除名字为a的cookie
 * 		removeCookie("a", "/")	表示在根目录下删除名字为a的cookie
 */
function removeCookie(_name, _path){
	if(_path){
		setCookie(_name, "", -1, _path);
	}else{
		setCookie(_name, "", -1);
	}
}


/*
 * 功能：获取cookie
 * 参数：
 * 		_name	：表示cookie名称
 * 返回值：
 * 		该cookie名所对应的cookie值
 */
function getCookie(_name){
	// 当前文件所能求得的所有的cookie找到
	// 多个cookie之间，是用分号空格分隔的
	var str = document.cookie;	// "a=1; b=2"	
	// 根据分号空格，将str拆分成数组
	var arr = str.split("; ");	// ["a={value:['hello']}", "b=2"]
	// 对数组进行循环
	for( var i=0,len=arr.length; i<len; i++ ){
		var txt = arr[i];// 当i=0时，"a=1"；当i=1时，"b=2"
		// 对"a=1"这种数据，进行拆分，等号左边为cookie名称，等号右边为cookie内容
		var col = txt.split("=");	// col = ["a", "{value:['hello']}"]
		if( col[0] == _name ){	// 在所有的cookie中，找到了我们想要的cookie了
			//return col[1];
			var objstr = col[1];
			var obj =JSON.parse(objstr);// 把json字符串转为json对象
			return obj.value;
		}
	}
	
	//console.log( arr );
}


/*
 * 功能：获取一组cookie
 * 参数：
 * 		reg	：指用来描述cookie名的变量
 * 		fn	：回调函数，对求出的cookie数组进行循环操作
 * 返回值：
 * 		根据reg，得到的一组cookie
 * 示例：
 * 		getCookieAll(/^a/)	表示获取所有cookie中，cookie名称开头为a的cookie
 */
function getCookieAll(reg, fn){
	var result = [];
	// 当前文件所能求得的所有的cookie找到
	// 多个cookie之间，是用分号空格分隔的
	var str = document.cookie;	// "a=1; b=2"	
	// 根据分号空格，将str拆分成数组
	var arr = str.split("; ");	// ["a={value:['hello']}", "b=2"]
	// 对数组进行循环
	for( var i=0,len=arr.length; i<len; i++ ){
		var txt = arr[i];// 当i=0时，"a=1"；当i=1时，"b=2"
		// 对"a=1"这种数据，进行拆分，等号左边为cookie名称，等号右边为cookie内容
		var col = txt.split("=");	// col = ["a", "{value:['hello']}"]
		if( reg.test(col[0]) ){	// 在所有的cookie中，找到了我们想要的cookie了
			//return col[1];
			var objstr = col[1];
			var obj =JSON.parse(objstr);// 把json字符串转为json对象
			//return obj.value;
			result.push({
				"cookieName" : col[0],
				"cookieValue" : obj.value
			});
			// 执行回调函数
			if( fn ){
				fn( col[0], obj.value );
			}
		}
	}	
	return result;
}



