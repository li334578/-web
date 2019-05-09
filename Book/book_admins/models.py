from django.db import models

# Create your models here.
class book_admins(models.Model):
    '''图书管理员模型类'''
    admin_name = models.CharField(max_length=20) # 管理员姓名
    admin_pwd = models.CharField(max_length=20) # 管理员密码