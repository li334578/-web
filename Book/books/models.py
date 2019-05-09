from django.db import models

# Create your models here.
class books(models.Model):
    '''图书模型类'''
    book_name = models.CharField(max_length=30) # 图书名
    book_autor = models.CharField(max_length=20) # 图书作者名
    book_stock = models.IntegerField() # 图书库存数
    book_ISBN = models.CharField(max_length=20) # 图书的唯一ISBN码
    book_type = models.CharField(max_length=20,default='人物传记') # 图书所属类型