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

//添加用户---获得数据---写入数据库
$('button').on('click', function () {
    /**---------- 测试 ----------*/
    // console.log($('#userForm').serialize()); //查看提交的数据
    // return;

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

//上传头像---将文件上传到指定目录
$('#avatar').on('change', function () {
    //将用户上次的图片追加到对象中
    var formData = new FormData();
    formData.append('avatar', this.files[0]);
    /**---------- 测试 ----------*/
    // console.log(this.files[0]) //打印上传文件信息

    $.ajax({
        type: 'post',
        url: '/upload',
        data: formData,
        //不请求参数
        processData: false,
        //不请求参数类型
        contentType: false,
        //上传成功
        success: function (res) {
            //头像预览
            $('#preview').attr('src', res[0].avatar);
            //将图片地址添加到表单隐藏域---存储图片路径
            $('#hiddenAvatar').val(res[0].avatar);
            
            /**---------- 测试 ----------*/
            // console.log(res) //打印上传的图片---数组---查看图片路径
        }
    })
})