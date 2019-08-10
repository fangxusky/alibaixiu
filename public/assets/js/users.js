//用户管理功能

//定义数组存放用户列表
var userArr = new Array();

//展示用户列表
$.ajax({
    type: "get",
    url: "/users",
    success: function (res) {
        userArr = res;
        //将userArr传递给arr
        render(userArr);

        /**---------- 测试 ----------*/
        // console.log(res);
    }
});

//调用模板引擎-----调用template方法
function render(arr) {
    //调用template方法
    var str = template('userTpl', {
        list: arr
    });//end str

    //在页面渲染用户列表
    $('tbody').html(str);

    /**---------- 测试 ----------*/
    // console.log(arr);
    // console.log(str);

}//end function

//添加用户
$('button').on('click', function () {
    /**---------- 测试 ----------*/
    // console.log($('#userForm').serialize()); //查看提交的数据

    $.ajax({
        url: '/users',
        type: 'post',
        data: $('#userForm').serialize(), //输出序列化
        //成功
        success: function (res) {
            //将res数据push到数组中
            userArr.push(res);
            //渲染数据
            render(userArr);

            /**---------- 测试 ----------*/
            // console.log(res); //打印用户添加成功后的返回值
        },
        //失败
        error: function () {
            alert('用户添加失败');
        }
    });

    /**---------- 测试 ----------*/
    // alert("ok") //测试提交功能

})