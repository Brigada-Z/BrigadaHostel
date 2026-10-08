from .settings import *

# Configuración exclusiva para ejecución de pruebas unitarias automatizadas (test runner) en memoria
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': ':memory:',
    }
}
