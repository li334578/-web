# Generated by Django 2.0 on 2019-05-07 07:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('books', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='books',
            name='book_type',
            field=models.CharField(default='人物传记', max_length=20),
        ),
    ]
