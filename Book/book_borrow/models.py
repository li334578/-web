from django.db import models

# Create your models here.
class book_borrow(models.Model):
    '''借阅图书表'''
    b_name = models.CharField(max_length=20) # 借阅人的姓名 没有使用外键
    b_date = models.CharField(max_length=20) # 存储借阅时间 使用字符串字段存储
    book_name = models.CharField(max_length=20)# 借阅书的名字
