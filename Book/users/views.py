from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from users.models import users
from book_admins.models import book_admins
from books.models import books
from book_borrow.models import book_borrow
import time
import re
import json


# Create your views here.

# /index
def index(request):
    '''首页函数'''
    return render(request, 'users/index.html')


# /register
def register(request):
    '''注册函数'''
    return render(request, 'users/register.html')


# /ajax_inquiry/
def ajax_inquiry(request):
    '''查询图书数量信息的ajax请求'''

    # 需要接收的参数
    # 需要查询的图书类型
    # 查询的条件 图书类型相同 且库存>0

    book_type = request.GET.get('book_type')
    print(book_type)
    book_query = books.objects.filter(book_type=book_type)
    # data_list = list(book_query.values())
    # for i in range(0,book_query.count()):
    #     data = data_list[i]
    data = {'len': book_query.count()}

    return JsonResponse(data)


# /ajax_inquiry_data/
def ajax_inquiry_data(request):
    '''查询具体的图书信息'''
    # 需要接收的参数
    # 需要查询的图书类型
    # 查询的条件 图书类型相同 且库存>0
    book_type = request.GET.get('book_type')
    i = int(request.GET.get('i'))
    book_deatil_query = books.objects.filter(book_type=book_type)
    book_deatil_query = list(book_deatil_query.values())
    data_deatil = book_deatil_query[i]
    return JsonResponse(data_deatil)


# /ajax_borrow/
def ajax_borrow(request):
    '''向借书表中插入信息'''
    book_name = request.POST.get('book_name')
    user_name = request.POST.get('user_name')
    b_data = time.strftime('%Y.%m.%d', time.localtime(time.time()))
    book_bor = book_borrow()
    # //将借书数据插入到借书表中
    # //如果该用户的借书表中存在五条数据返回res:0 表示借书失败
    book_borrow_query = book_borrow.objects.filter(b_name=user_name)
    if book_borrow_query.count() >= 5:
        return JsonResponse({'res': 0, 'book_name': book_name})
    else:
        book_bor.b_name = user_name
        book_bor.book_name = book_name
        book_bor.b_date = b_data
        book_bor.save()
        # //从书库中减少图书的数量
        book_query = books.objects.get(book_name=book_name)
        if book_query.book_stock > 0:
            book_query.book_stock -= 1
            book_query.save()
            return JsonResponse({'res': 1})
        else:
            return JsonResponse({'res': 3})


# /ajax_handle/
def ajax_handle(request):
    '''登录的ajax请求处理'''
    user_name = request.POST.get('user_name')
    user_pwd = request.POST.get('user_pwd')
    flag = request.POST.get('flag')

    try:
        if int(flag) == 0:
            b = users.objects.get(user_name=user_name)
            print(b.user_pwd)
            if user_pwd == b.user_pwd:
                data = {'res': 1}
            else:
                data = {'res': 0}
        elif int(flag) == 1:
            a = book_admins.objects.get(admin_name=user_name)
            print(a.admin_pwd)
            if user_pwd == a.admin_pwd:
                data = {'res': -1}
            else:
                data = {'res': 0}

    except:
        print("查询不到结果")
        data = {'res': 2}
    finally:
        return JsonResponse(data)


# /ajax_check/
def ajax_check(request):
    '''注册的ajax处理'''
    user_name = request.POST.get('user_name')
    user_pwd = request.POST.get('user_pwd')
    user_email = request.POST.get('user_email')
    name = request.POST.get('name')
    flag = True
    # 获取到用户提交过来的数据对数据的格式进行校验
    if re.match('^[a-zA-Z0-9_-]{4,16}$',user_name):
        pass
    else:
        flag = False
    if re.match('^[a-zA-Z0-9]{6,8}$',user_pwd):
        pass
    else:
        flag = False
    if re.match('^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.com$',user_email):
        pass
    else:
        flag = False
    if flag:
        data = {'res': 1}
    else:
        data = {'res': 0}

    return JsonResponse(data)


# /ajax_inquire_borrow/
def ajax_inquire_borrow(request):
    '''查询用户的借书表数据数'''
    user_name = request.GET.get('user_name')
    # //根据用户名查询借书表中书的数量
    book_borrow_query = book_borrow.objects.filter(b_name=user_name)
    num = book_borrow_query.count()
    return JsonResponse({'res': num})


# /ajax_inquire_borrow_deatil/
def ajax_inquire_borrow_deatil(request):
    '''查询用户的借书表数据信息'''
    user_name = request.GET.get('user_name')
    i = int(request.GET.get('i'))
    book_deatil_query = book_borrow.objects.filter(b_name=user_name)
    book_deatil_query = list(book_deatil_query.values())
    data_deatil = book_deatil_query[i]
    return JsonResponse(data_deatil)


# /ajax_book_return/
def ajax_book_return(request):
    '''归还图书函数'''
    user_name = request.POST.get('user_name')
    book_name = request.POST.get('return_book_name')
    # 从借书表中移除该条数据
    book_borrow_query = book_borrow.objects.get(b_name=user_name,book_name=book_name)
    book_borrow_query.delete()
    # 在图书表中该书数目加一
    book_query = books.objects.get(book_name=book_name)
    book_query.book_stock+=1
    book_query.save()
    return JsonResponse({'res': 1})


# /ajax_insert_book/
def ajax_insert_book(request):
    '''获取图书数据向图书数据表中插入数据'''
    book_name = request.POST.get('book_name')
    autor_name = request.POST.get('autor_name')
    book_stock = request.POST.get('book_stock')
    book_ISBN = request.POST.get('book_ISBN')
    list_radio = request.POST.get('list_radio')

    print(book_name)
    print(autor_name)
    print(book_stock)
    print(book_ISBN)
    print(list_radio)
    # 数据获取成功 插入到数据表
    book_query = books.objects.create(book_name=book_name,book_autor=autor_name,book_stock=int(book_stock),book_ISBN=book_ISBN,book_type=list_radio)
    if(book_query):
        return JsonResponse({'res': 1})
    else:
        return JsonResponse({'res': 0})



