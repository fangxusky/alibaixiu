/**----------文章列表管理功能 ----------*/
//定义数组存放用户列表
var categoryArr = new Array();

// 显示分类
// 1.像服务端发ajax　
// 2.将返回的数据赋值给categoryArr数组 
// 3.调用render()方法就可以

$.ajax({
    type: 'get',
    url: '/categories',
    success: function (res) {
        // console.log(userArr);
        categoryArr = res
        render(categoryArr);
    }
});

function render(arr) {
    var str = template('categoriesTpl', {
        list: arr
    })
    // console.log(str);
    $('tbody').html(str);
}

// 添加分类 -----给添加分类按钮注册点击事件
$('#addCategory').on('click', function () {
    var formData = $('#categoryForm').serialize();
    // console.log(formData);

    //向ajax发送请求
    $.ajax({
        type: 'post',
        url: '/categories',
        data: formData,
        success: function (res) {
            // console.log(res)
            categoryArr.push(res);
            // categoryArr = res;
            render(categoryArr);
        }
    })
});

//定义全局变量,存储当前编辑文章的id
var CategoryId;

//编辑文章分类目录
$('tbody').on('click', '.edit', function () {
    // alert('ok');

    //保存当前文章修改的id
    CategoryId = $(this).parent().attr('data-id');
    // console.log(CategoryId);

    //获取添加分类标题-----将标题改为修改分类
    $('#categoryForm > h2').text('修改分类');

    //获取点击元素的祖元素
    var trObj = $(this).parents('tr');
    // console.log(trObj);

    //将用户信息写入到表单中
    $('#title').val(trObj.children().eq(1).text()); //获取名称
    $('#className').val(trObj.children().eq(2).text()); //获取图标类型

    //显示修改按钮,隐藏添加按钮
    $('#addCategory').hide();
    $('#editCategory').show();
});

//完成修改功能-----给修改按钮添加点击事件
$('#editCategory').on('click', function () {
    // alert('ok');
    //向服务器发送请求
    $.ajax({
        type: 'put',
        url: '/categories/' + CategoryId,
        data: $('#categoryForm').serialize(),
        success: function (res) {
            console.log(res);
            //修改数组中的数据
            var index = categoryArr.findIndex(item => item._id == CategoryId);
            //根据索引找到对应元素,更新数据
            categoryArr[index] = res;
            //重新渲染页面
            render(categoryArr);

            //修改完成后还原表单数据表
            $('#categoryForm > h2').text('添加分类');
            $('#title').val(""); //获取名称
            $('#className').val(""); //获取图标类型
            $('#addCategory').show();
            $('#editCategory').hide();

        }
    });
});

//删除文章分类
$('tbody').on('click', '.del', function () {
    // alert('ok');
    //用户交互---确认删除
    if (window.confirm('确认删除')) {
        //定义变量存储id
        // var id = $(this).parent().attr('data-id');
        CategoryId = $(this).parent().attr('data-id');

        $.ajax({
            type: 'delete',
            // url: '/categories/' + id,
            url: '/categories/' + CategoryId,
            success: function (res) {
                // console.log(res);
                // 删除数组中的数据-----获取需要删除元素的索引号
                var index = categoryArr.findIndex(item => item._id == res._id);
                /**----------测试找到的索引号是否与数组中的索引号一致---------- */
                // console.log(categoryArr);
                // console.log(index);

                // 调用splice()方法删除数组中对应的元素
                categoryArr.splice(index, 1);

                //重新渲染页面
                render(categoryArr);
            }
        });
    }
});