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
$('#userAdd').on('click', function () {
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

//定义全局变量,存储当前编辑用户的id
var userId;

//编辑用户信息
$('tbody').on('click', '.edit', function () {
    //保存当前用户修改的id
    userId = $(this).parent().attr('data-id');

    //获取用户名
    $('#userForm > h2').text('修改用户');

    //获取当前点击元素的祖元素---<tr>标签
    var trObj = $(this).parents('tr');

    //获取图片地址
    var imgSrc = trObj.children(1).children('img').attr('src');

    //更改头像图片-----将图片地址写入到隐藏域中
    $('#hiddenAvatar').val(imgSrc); //获取图片地址

    //判断用户是否上传了头像
    if (imgSrc) {
        $('#preview').attr('src', imgSrc); //设置图片的属性和地址
    } else {
        $('#preview').attr('src', '../assets/img/default.png'); //设置图片的属性和地址
    }

    /**---------- 将用户列表中的信息写入到各表单编辑框中 ----------*/
    //修改邮箱
    $('#email').val(trObj.children().eq(2).text());
    //修改昵称
    $('#nickName').val(trObj.children().eq(3).text());

    //更改状态
    var status = trObj.children().eq(4).text();
    //判断当前状态
    if (status == '激活') {
        $('#active').prop('checked', true)
    } else {
        $('#inactive').prop('checked', true)
    }

    //更改角色
    var role = trObj.children().eq(5).text();
    //判断当前角色
    if (role == '超级管理员') {
        $('#admin').prop('checked', true)
    } else {
        $('#normal').prop('checked', true)
    }

    /**---------- 不添加id获取元素 ----------*/
    // //获取邮箱地址
    // var emailValue = trObj.children().eq(2).text();

    // //编辑框获取邮箱
    // $('input[name="email"]').val(emailValue);
    // //编辑框获取昵称
    // $('input[name="nickName"]').val(trObj.children().eq(3).text());

    /**---------- 测试 ----------*/
    // alert('ok'); //查看点击事件是否注册成功
    // console.log(emailValue); //打印是否成功获取邮箱地址
    // console.log(imgSrc); //打印查看图片地址

    //显示修改按钮,隐藏添加按钮
    $('#userAdd').hide();
    $('#userEdit').show();

});


//完成修改功能-----提交修改信息---给修改按钮注册点击事件
$('#userEdit').on('click', function () {
    // 发送ajax----- 拿到当前编辑用户的id
    $.ajax({
        type: 'put',
        url: '/users/' + userId,
        data: $('#userForm').serialize(),
        success: function (res) {
            //修改数组中的数据
            var index = userArr.findIndex(item => item._id == userId);
            //根据下标找到数组中的元素,更新修改后的数据
            userArr[index] = res;
            //重新渲染页面
            render(userArr);

            //修改完成后还原表单数据
            $('#userForm > h2').text('添加新用户');
            $('#hiddenAvatar').val("");
            $('#preview').attr('src', "../assets/img/default.png");
            $('#userAdd').show();
            $('#userEdit').hide();
            $('#email').val("");
            $('#nickName').val("");
            $('#admin').prop('checked', false);
            $('#normal').prop('checked', false);
            $('#jh').prop('checked', false);
            $('#wjh').prop('checked', false);

            // location.reload();
            /**---------- 测试 ----------*/
            // console.log(res); //打印修改够的数据---提交给数据库
            // console.log(userArr); //打印数组中的数据---本地数据
            // console.log(index); //打印数组下标 
        }
    });

    /**---------- 测试 ----------*/
    // console.log($('#userForm').serialize()); //是否能拿到修改信息
});

//删除用户功能
//删除单个用户-----注册点击事件
$('tbody').on('click', '.del', function () {
    //弹出确认框
    if (window.confirm('真的要删除吗?')) {
        var id = $(this).parent().attr('data-id');
        //发送ajax请求
        $.ajax({
            type: 'delete',
            url: '/users/' + id,
            success: function (res) {
                // 删除数组中的数据
                var index = userArr.findIndex(item => item._id == res._id);
                // 调用splice()
                userArr.splice(index, 1);
                //重新渲染页面
                render(userArr);

                /**---------- 测试 ----------*/
                // console.log(res);
            }
        });
    }
});

//实现全选功能
//给头部复选框(<th>)注册点击事件
$('thead input').on('click', function () {
    //获取当前元素的选中状态-----头部<th>的状态决定下面复选框<td>的状态
    let flag = $(this).prop('checked'); //prop('参数')=>获取某个元素的指定属性的值
    //设置下面复选框的选中状态
    $('tbody input').prop('checked', flag); //prop('key', value)=>向某个元素设置属性

    //判断全选状态,显示批量删除按钮
    if (flag) {
        $('.btn-sm').show();
    } else {
        $('.btn-sm').hide();
    }
});

//给下面的复选框(<td>)注册点击事件
$('tbody').on('click', 'input', function () {
    //判断下面复选框的个数是否等于已选中的复选框的个数
    if ($('tbody input').length == $('tbody input:checked').length) {
        //勾选头部复选框
        $('thead input').prop('checked', true);
    } else {
        //取消头部复选框的选中状态
        $('thead input').prop('checked', false);
    }

    //判断下面复选框选中个数,显示批量删除按钮
    if ($('tbody input:checked').length > 1) {
        $('.btn-sm').show();
    } else {
        $('.btn-sm').hide();
    }
});

//实现批量删除功能
$('.btn-sm').on('click', function () {
    //定义空数组存储选中id
    var ids = [];

    //获取选中的元素
    var checkUser = $('tbody input:checked')

    //对checkUser对象进行遍历
    checkUser.each(function (k, v) {
        //获取被选中元素的id-----通过找到祖元素<tr>来拿到<tr>下面的子元素<td>的属性值
        var id = v.parentNode.parentNode.children[6].getAttribute('data-id');
        //将获取的id存储到数组中
        ids.push(id);

        /**---------- 测试 ----------*/
        // console.log(k, v); //打印选中元素
        // console.log(id); //打印选中元素的id
    });

    // 发送ajax
    $.ajax({
        type: 'delete',
        url: '/users/' + ids.join('-'),
        success: function (res) {
            res.forEach(e => {
                /**---------- 测试 ----------*/
                // console.log(e);// 打印的是数组中被删除的元素对象

                var index = userArr.findIndex(item => item._id == e._id);
                //调用splice()方法删除元素
                userArr.splice(index, 1);
                render(userArr);
            });
            /**---------- 测试 ----------*/
            // console.log(res); // 打印是否成功拿到数据-----拿到的是数组
        }
    });

    /**---------- 测试 ----------*/
    // console.log(checkUser);
});