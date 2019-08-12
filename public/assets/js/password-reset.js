//注册修改密码点击事件,阻止默认提交行为
$('#modifyForm').on('submit', function () {
    /**---------- 测试 ----------*/
    // alert('ok'); //测试点击事件是否注册成功

    //获取用户在表单中输入的内容
    var formData = $(this).serialize();
    // console.log(formData);

    //调用接口实现密码修改功能
    $.ajax({
        url: '/users/password',
        type: 'put',
        data: formData,
        success: function () {
            //修改成功.跳转登录页面
            location.href = "/admin/login.html"
        }
    });

    //阻止默认提交行为
    return false;
});