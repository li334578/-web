"""Book URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from users import views
urlpatterns = [
    path('admin/', admin.site.urls),
    path('ajax_handle/', views.ajax_handle),
    path('index/',views.index),
    path('register/',views.register),
    path('ajax_inquiry/',views.ajax_inquiry),
    path('ajax_inquiry_data/',views.ajax_inquiry_data),
    path('ajax_borrow/',views.ajax_borrow),
    path('ajax_check/',views.ajax_check),
    path('ajax_inquire_borrow/',views.ajax_inquire_borrow),
    path('ajax_inquire_borrow_deatil/',views.ajax_inquire_borrow_deatil),
    path('ajax_book_return/',views.ajax_book_return),
    path('ajax_insert_book/',views.ajax_insert_book),
]
