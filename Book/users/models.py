from django.db import models

# Create your models here.
class users(models.Model):
    '''创建用户模型类'''
    user_name = models.CharField(max_length=20) # 用户名字段
    user_pwd = models.CharField(max_length=20) # 密码字段
    user_email = models.CharField(max_length=20) # 邮箱字段
    name = models.CharField(max_length=16) # 姓名字段
    count = models.IntegerField(default=5) # 默认用户可借阅图书数
