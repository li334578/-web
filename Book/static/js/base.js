$(function () {
    //点击首页时提示退出登录
    $('.nav ul li a').eq(0).click(function () {
        $u_name = $('.top-box .container-box .info em').html();
        if ($u_name == '') {
            //没有登录不用处理
        } else {
            alert("退出登录");
        }
    });
    //点击馆藏介绍显示隐藏域
    $('.nav ul li a').eq(1).click(function () {
        $('.introduction').slideToggle().siblings().hide();
    });

    //设置菜单栏 点击图书分类会将显示的隐藏域显示出来
    var $li_3 = $('.nav ul li').eq(2);
    var $div_hide1 = $('.div_hide1 ul');
    $li_3.click(function () {
        $('.div_hide1').show().siblings().hide();
        $div_hide1.slideToggle();
    });
    //点击图书分类显示相应的信息
    var $books_li = $('.div_books ul li');
    $books_li.click(function () {
        $('.div_books').show().siblings().hide();
        req($(this).index());

    });

    //点击我的书单显示相应信息
    var $li_4 = $('.nav ul li').eq(3);
    var $div_hide2 = $('.div_hide2');
    var $sub = $('.div_hide2 .sub');

    $li_4.click(function () {
        $('.div_hide2').siblings().hide();
        $u_name = $('.top-box .container-box .info em').html();
        if ($u_name == '') {
            alert("请登录后重试");
        } else {
            var span = $('.div_hide2 span');
            if (span.length > 0) {
                $sub.css('display', 'block');
            }
            $div_hide2.slideToggle();
        }
    });

    //点击关于我们
    var $about = $('.nav ul li').eq(5);
    $about.click(function () {
        $('.about').siblings().hide();
        $('.about').slideToggle();

    });

    $books_li.unbind();
    $books_li.click(function () {
        $('.context ul li a').empty();
        req($(this).index());

    });
    //on 绑定动态生成的元素的事件
    var $count = $('.div_hide2 span').length;
    $('.context ul').on('click', '.add', function () {
        var $val = $(this).parent().prev().children().html();
        var $sub = $('.div_hide2 .sub');
        if ($val > 0) {
            var $book_name = $(this).parent().prevAll().eq(3).children().html();
            //判断书单中是否存在五本书
            $count = $('.div_hide2 span').length;
            if ($count < 5) {
                $(this).parent().prev().children().html($val - 1);
                var $new_span = $('<span>' + $book_name + '<a href="javascript:;" class="del">删除</a></span>');
                // <span>书名<a class="del">删除</a></span>
                $sub.before($new_span);
            } else {
                alert("一个人只能借五本书");
            }

        } else {
            alert("这本书的库存已经没有了！")
        }

    });
    //绑定我的书单中点击删除的事件
    $('.div_hide2').on('click', '.del', function () {
        //从我的书单列表中移除该元素
        var $book_name = $(this).parent().html().split('<')[0];
        //把删除后的书名获取到 调用函数原本书目数量加一
        add_num($book_name);
        $(this).parent().remove();
    });

    //提交书单函数
    $('.div_hide2 .sub').click(function () {
        var flag = 1;
        var $count = $('.div_hide2 span').length;
        var $user_name = $('.top-box .container-box .info em').html();
        var csrf = $('input[name="csrfmiddlewaretoken"]').val();
        if ($user_name == '') {
            alert("请登录");
        } else {
            if ($count > 0 && $count <= 5) {
                //数量在(0-5]之间允许提交借书单

                for (var i = 0; i < $count; i++) {
                    var $book_name = $('.div_hide2 span').eq(i).html().split('>')[0].split('<')[0];
                    $.ajax({
                        'url': '/ajax_borrow/',
                        'type': 'post',
                        'data': {'book_name': $book_name, 'user_name': $user_name,'csrfmiddlewaretoken': csrf,},
                        'dataType': 'json',

                    }).done(function (data) {
                        if (data.res == 0) {
                            alert("你已经借够五本书了" + data.book_name + "没有权限借了");
                        }
                    })
                }
                //借书成功 将借书单隐藏并清空
                alert('访问成功');
                $('.div_hide2').hide();
                $('.div_hide2 span').remove();
            } else {
                alert("数量不合法");
            }
        }

    });


    var $login = $('.top-link .container .fl a');
    var $flag = -1;
    //点击登录按钮
    $login.click(function () {
        $flag = $(this).index();
        $('.from').slideToggle();

    });

    $(function () {
        var login_btn = $('.from #login_btn');
        var user_name = $('.from #name');
        var user_pwd = $('.from #pwd');
        var csrf = $('input[name="csrfmiddlewaretoken"]').val();
        var err_msg = $('.from #err_msg');
        login_btn.click(function () {
            $.ajax({
                'url': '/ajax_handle/',
                'type': 'post',
                'data': {
                    'user_name': user_name.val(),
                    'user_pwd': user_pwd.val(),
                    'flag': $flag,
                    'csrfmiddlewaretoken': csrf,
                },
                'dataType': 'json'
            }).success(function (data) {
                if (data.res == 1) {
                    // err_msg.html('成功');
                    $('.top-box .container-box .info em').html(user_name.val());
                    $('.from').hide();
                    $('.top-link').hide();
                    $('.top-box .container-box .info').fadeIn();

                } else if (data.res == 0) {
                    err_msg.html('密码错误');
                    err_msg.show();
                } else if (data.res == -1) {
                    $('.from').hide();
                    $('.top-link').hide();
                    $('.div_books').hide();
                    $('.borrow').show();
                    alert('管理员登录成功');
                } else {
                    err_msg.html('用户不存在');
                    err_msg.show();
                }
            })
        });
        //账号和用户名获得焦点时 隐藏信息提示框
        user_name.focus(function () {
            err_msg.hide();
        });
        user_pwd.focus(function () {
            err_msg.hide();
        });
    });
    //点击退出按钮
    $('.top-box .container-box .info .quit').click(function () {
        //把用户名框置空
        $('.top-box .container-box .info em').html('');
        //隐藏 欢迎你模块
        $('.top-box .container-box .info').fadeOut();
        $('.div_hide3').hide();
        //显示登录注册按钮
        $('.from').show();
        $('.top-link').show();

        alert("退出");
    });
    //注册界面的js
    //获取各个输入框
    var $user_name = $('#user_name');
    var $user_pwd = $('#user_pwd');
    var $user_pwd1 = $('#user_pwd1');
    var $user_email = $('#user_email');
    var $name = $('#sub_name');
    var $errmsg = $('.errmsg');

    $user_name.click(function () {
        //点击用户名输入框的时候隐藏提示信息
        $errmsg.hide();
    });
    $user_pwd1.click(function () {
        $errmsg.hide();
    });

    $user_name.blur(function () {
        //校验用户名的格式
        // var val = $(this).val();
        var val = $(this).val();
        var re = /^[a-zA-Z0-9_-]{4,16}$/;

        if (val == "") {
            $errmsg.html("用户名为空");
            $errmsg.show();
            // alert("用户名为空");
            return;
        } else {
            if (re.test(val)) {
                $errmsg.hide();
            } else {
                $errmsg.html("用户名格式不正确");
                $errmsg.show();
            }
        }

    });

    //校验密码格式
    $user_pwd.blur(function () {
        password()
    });
    $user_pwd1.blur(function () {
        password()
    });

    function password() {
        //验证密码 两次密码一致 还有密码格式问题
        var pwd = $user_pwd.val();
        var pwd1 = $user_pwd1.val();
        var re = /^[a-zA-Z0-9]{6,8}$/;
        if (pwd == pwd1) {
            if (re.test(pwd)) {
                $errmsg.hide();
            } else {
                $errmsg.html("密码格式不正确");
                $errmsg.show();
            }
        } else {
            $errmsg.html("两次密码不一致");
            $errmsg.show();
        }
    }


    //验证邮箱格式 keyup验证
    $user_email.keyup(function () {
        var email = $user_email.val();
        var re = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.com$/;
        if (email == "") {
            $errmsg.hide();
        } else {
            if (re.test(email)) {
                $errmsg.hide();
            } else {
                $errmsg.html("邮箱格式不正确");
                $errmsg.show();
            }
        }
    });

    //点击注册的提交按钮触发ajax请求
    var $btn_sub = $('#btn_sub');
    $btn_sub.click(function () {
        var csrf = $('input[name="csrfmiddlewaretoken"]').val();
        if ($user_name.val() == '' & $user_pwd.val() == '' & $user_pwd1.val() == '') {
            alert("账号密码为空值,不允许提交");
            return;
        } else {
            $.ajax({
                'url': '/ajax_check/',
                'type': 'post',
                'data': {
                    'user_name': $user_name.val(),
                    'user_pwd': $user_pwd1.val(),
                    'user_email': $user_email.val(),
                    'name': $name.val(),
                    'csrfmiddlewaretoken': csrf,
                },
                'dataType': 'json',
            }).done(function (data) {
                //提交注册成功
                if (data.res == 0) {
                    alert('注册失败');
                } else {
                    alert("注册成功");
                    location.href = '/index/';
                }

            })
        }
    });
    //注册界面的js在这结束

    //归还图书模块的js从这开始
    //获取归还图书按钮 查询该用户借的书
    var $return_book = $('.nav ul li').eq(4);
    var $div_hide3 = $('.div_hide3');
    var $return_book_a = $('.div_hide3 .return_book_menu').eq(1);
    $return_book.click(function () {
        //获取当前用户的登录信息
        $div_hide3.siblings().hide();
        $u_name = $('.top-box .container-box .info em').html();

        if ($u_name == '') {
            alert("请登录后重试");
        } else {
            //用户已登录 查询用户的借书表
            $.ajax({
                'url': '/ajax_inquire_borrow/',
                'type': 'get',
                'data': {'user_name': $u_name},
                'dataType': 'json',
            }).done(function (book_num) {
                if (book_num.res > 0) {
                    //说明借书表中存在数据 发送ajax请求获取数据
                    for (var i = 0; i < book_num.res; i++) {
                        $.ajax({
                            'url': '/ajax_inquire_borrow_deatil/',
                            'type': 'get',
                            'data': {'user_name': $u_name, 'i': i},
                            'dataType': 'json',
                        }).done(function (book_detail) {
                            $return_book_a.after('<div><span>' + book_detail.book_name + '</span><span>' + book_detail.b_date + '</span><a href="javascript:;" class="return_book">归还</a></div>');
                        }).fail(function () {
                            alert("服务器错误");
                        });
                    }
                } else {
                    //借书表中没有数据
                    $return_book_a.after('<span>当前借书表为空</span>')
                }
            });
            $div_hide3.slideToggle();
            // alert($u_name);
        }
    });
    // 点击归还图书按钮触发事件 //动态生成的标签需用on
    // $('.div_hide2').on('click', '.del', function ()
    $('.div_hide3').on('click', '.return_book', function () {
        $u_name = $('.top-box .container-box .info em').html();
        var $return_book_name = $(this).prevAll().eq(1).html();
        var csrf = $('input[name="csrfmiddlewaretoken"]').val();
        alert("正在归还图书");
        $(this).parent().remove();
        if ($('.div_hide3 div div').length == 0) {
            $('.div_hide3').hide();
        }
        $.ajax({
            'url': '/ajax_book_return/',
            'type': 'post',
            'data': {'return_book_name': $return_book_name, 'user_name': $u_name,'csrfmiddlewaretoken': csrf,},
            'dataType': 'json',

        }).done(function () {
            alert($return_book_name + "还书success");
        }).fail(function () {
            alert('服务器错误');
        });
    });
    //归还图书模块的js到这结束


    //管理员向图书表中插入数据从这开始
    var $btn = $('.borrow .list .update_btn');
    var $book_name = $('.borrow .list #book_name');
    var $autor_name = $('.borrow .list #autor_name');
    var $book_stock = $('.borrow .list #book_stock');
    var $book_ISBN = $('.borrow .list #book_ISBN');
    $btn.click(function () {
        var $list_radio = $('.borrow .list .list_radio:checked');
        var csrf = $('input[name="csrfmiddlewaretoken"]').val();

        // alert('点击了提交按钮');
        // alert($book_name.val());
        // alert($autor_name.val());
        // alert($book_stock.val());
        // alert($list_radio.val());

        //获取到所有需要使用的数据 发送ajax请求
        $.ajax({
            'url': '/ajax_insert_book/',
            'type': 'post',
            'data': {
                'book_name': $book_name.val(),
                'autor_name': $autor_name.val(),
                'book_stock': $book_stock.val(),
                'book_ISBN': $book_ISBN.val(),
                'list_radio': $list_radio.val(),
                'csrfmiddlewaretoken': csrf
            },
            'dataType': 'json'
        }).done(function (data) {
            if (data.res == 1) {
                alert("请求成功");
            } else {
                alert("请求失败");
            }
        })

    });
    //管理员向图书表中插入数据到这结束
});
// ready在这结束

//删除后书目加一的函数
function add_num($book_name) {
    var con_num = ($('.context ul li').length - 5) / 5;
    for (var i = 0; i < con_num; i++) {
        var bkname = $('.context ul li .name').eq(i).html();
        if ($book_name == bkname) {
            var $stock = $('.context ul li .stock').eq(i).html();
            $('.context ul li .stock').eq(i).html(parseInt($stock) + 1);
        }
    }
}


//获取当前书目分类下的所有数据
function req(num) {
    var $book_a = $('.div_books ul li a');
    var $books = $('.context');
    var $books_td = $('.context ul');
    $.ajax({
        'url': '/ajax_inquiry/',
        'type': 'get',
        'data': {'book_type': $book_a.eq(num).html()},
        'dataType': 'json',
    }).done(function (data) {
        //处理查询返回的结果集
        // $('.context ul li a').empty();
        var $new_li = "";

        for (var i = 0; i < data.len; i++) {
            $.ajax({
                'url': '/ajax_inquiry_data/',
                'type': 'get',
                'data': {'book_type': $book_a.eq(num).html(), 'i': i},
                'dataType': 'json',
            }).done(function (data_deatil) {
                $new_li = $('<li><a href="javascript:;" class="name">' + data_deatil.book_name + '</a></li><li><a href="javascript:;">' + data_deatil.book_autor + '</a></li><li><a href="javascript:;">' + data_deatil.book_ISBN + '</a></li><li><a href="javascript:; " class="stock">' + data_deatil.book_stock + '</a></li><li><a href="javascript:;" class="add">添加到书单</a></li>');
                $books_td.append($new_li);
                $books.show();
            }).fail(function () {
                alert('服务器错误');
            });
        }

    }).fail(function () {
        alert("服务器错误");
    });

}