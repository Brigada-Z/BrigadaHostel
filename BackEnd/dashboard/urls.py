from django.urls import path
from .views import (
    APIRootView,
    ReservaListCreateAPIView,
    ReservaDetailAPIView,
    ReservaEstadoAPIView,
    HabitacionListCreateAPIView,
    HabitacionDetailAPIView,
    UsuarioListCreateAPIView,
    UsuarioDetailAPIView,
    UsuarioLoginAPIView,
    ServicioListCreateAPIView,
    IntegranteListCreateAPIView,
    DashboardMetricasAPIView,
)

urlpatterns = [
    # Página Raíz y Explorador
    path('', APIRootView.as_view(), name='api-root'),

    # Endpoints de Reservas
    path('reservas/', ReservaListCreateAPIView.as_view(), name='reservas-list-create'),
    path('reservas', ReservaListCreateAPIView.as_view(), name='reservas-list-create-alt'),
    path('reservas/<int:pk>/', ReservaDetailAPIView.as_view(), name='reserva-detail'),
    path('reservas/<int:pk>', ReservaDetailAPIView.as_view(), name='reserva-detail-alt'),
    path('reservas/<int:pk>/estado/', ReservaEstadoAPIView.as_view(), name='reserva-estado'),
    path('reservas/<int:pk>/estado', ReservaEstadoAPIView.as_view(), name='reserva-estado-alt'),

    # Endpoints de Habitaciones
    path('habitaciones/', HabitacionListCreateAPIView.as_view(), name='habitaciones-list-create'),
    path('habitaciones', HabitacionListCreateAPIView.as_view(), name='habitaciones-list-create-alt'),
    path('habitaciones/<int:pk>/', HabitacionDetailAPIView.as_view(), name='habitacion-detail'),
    path('habitaciones/<int:pk>', HabitacionDetailAPIView.as_view(), name='habitacion-detail-alt'),

    # Endpoints de Usuarios y Auth
    path('usuarios/', UsuarioListCreateAPIView.as_view(), name='usuarios-list-create'),
    path('usuarios', UsuarioListCreateAPIView.as_view(), name='usuarios-list-create-alt'),
    path('usuarios/<int:pk>/', UsuarioDetailAPIView.as_view(), name='usuario-detail'),
    path('usuarios/<int:pk>', UsuarioDetailAPIView.as_view(), name='usuario-detail-alt'),
    path('auth/login/', UsuarioLoginAPIView.as_view(), name='auth-login'),
    path('auth/login', UsuarioLoginAPIView.as_view(), name='auth-login-alt'),

    # Endpoints de Servicios
    path('servicios/', ServicioListCreateAPIView.as_view(), name='servicios-list-create'),
    path('servicios', ServicioListCreateAPIView.as_view(), name='servicios-list-create-alt'),

    # Endpoints de Integrantes
    path('integrantes/', IntegranteListCreateAPIView.as_view(), name='integrantes-list-create'),
    path('integrantes', IntegranteListCreateAPIView.as_view(), name='integrantes-list-create-alt'),

    # Métricas y Resumen del Dashboard
    path('dashboard/metricas/', DashboardMetricasAPIView.as_view(), name='dashboard-metricas'),
    path('dashboard/metricas', DashboardMetricasAPIView.as_view(), name='dashboard-metricas-alt'),
]
