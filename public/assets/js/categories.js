

var userArr = new Array();
// 添加分类 -----给添加分类按钮注册点击事件
$('#addCategory').on('click', function () {
    var formData = $('#addCategoryData').serialize();
    console.log(formData);

    //向ajax发送请求
    $.ajax({
        type: 'post',
        url: '/categories',
        data: formData,
        success: function (res) {
            console.log(res)
            userArr = res;
            render(userArr);
        }
    })
});

function render(arr) {
    var str = template('categoriesTpl', {
        list: arr
    })
    console.log(str);
    $('tbody').html(str);
}


// 显示分类
// 1.像服务端发ajax　
// 2.将返回的数据赋值给userArr数组 
// 3.调用render()方法就可以

$.ajax({
    type: 'get',
    url: '/categories',
    success: function (userArr) {
        console.log(userArr);
        render(userArr);
    }
});