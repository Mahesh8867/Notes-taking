from django.urls import path
from .views import *
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


urlpatterns = [
                path('notes/', NotesView.as_view(),name='notes-view'),
                path('notes/<uuid:pk>/', NotesView.as_view(), name='notes-detail-view'),
                path('api/login/', CustomLoginView.as_view(), name='custom_login'),
                path('api/register/',RegisterView.as_view(), name='register'),
                path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
                path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]