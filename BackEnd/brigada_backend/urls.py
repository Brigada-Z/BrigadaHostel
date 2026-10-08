from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),

    # Enrutamiento con prefijo '/api/'
    path('api/', include('dashboard.urls')),

    # Enrutamiento directo sin prefijo para compatibilidad directa con clientes existentes (json-server)
    path('', include('dashboard.urls')),
]
