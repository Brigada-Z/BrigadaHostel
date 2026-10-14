# 🏨 BrigadaHostel — Backend REST API (Django & Django REST Framework) con MariaDB

Backend profesional desarrollado para el sistema de administración y portal de autogestión de **BrigadaHostel**.

Implementado íntegramente con **Django 5** y **Django REST Framework (DRF)** bajo una arquitectura limpia (**Clean Architecture**) y principios de diseño **SOLID**, utilizando como motor principal de base de datos relacional **MariaDB / MySQL** (con soporte de driver de alto rendimiento `PyMySQL`), asegurando concurrencia real, integridad referencial estricta y escalabilidad para entornos de producción.

---

## 🗄️ Migración de Base de Datos: De SQLite a MariaDB

Originalmente, el prototipo utilizaba SQLite (`brigada_hostel.sqlite3`). En esta entrega, la persistencia se migró y adaptó completamente a **MariaDB** (`brigada_hostel_db`).

### ¿Por qué se migró a MariaDB?

| Criterio | SQLite (Anterior) | MariaDB / MySQL (Actual) | Beneficio para BrigadaHostel |
| :--- | :--- | :--- | :--- |
| **Concurrencia** | Bloqueo a nivel de archivo completo en escrituras. | Bloqueo granular por fila con motor **InnoDB**. | Permite que múltiples recepcionistas y clientes reserven en simultáneo sin bloqueos de base de datos. |
| **Arquitectura** | Base de datos embebida en un archivo local. | Servidor cliente-servidor dedicado sobre TCP/IP (puerto `3306`). | Permite desacoplar el servidor de base de datos del servidor web, habilitando escalabilidad horizontal y entornos en contenedores. |
| **Tipos de Datos e Integridad** | Tipado dinámico débil (type affinity). | Tipado estricto (`DECIMAL(10,2)`, `DATETIME`, `TINYINT(1)`, `JSON`, `VARCHAR`). | Integridad financiera en montos de reservas, validación de fechas y restricciones estrictas de claves foráneas (`FOREIGN KEY ... ON DELETE CASCADE/SET NULL`). |
| **Codificación y Soporte Multilingüe** | Estándar simple. | **`utf8mb4`** con `utf8mb4_unicode_ci`. | Soporte total para caracteres especiales, acentos y emojis en nombres, descripciones y notas. |
| **Seguridad y Permisos** | El usuario del sistema operativo tiene acceso directo al archivo. | Gestión de usuarios, contraseñas y privilegios granulares (`GRANT ...`). | Control estricto de accesos y credenciales protegidas mediante variables de entorno. |

---

## 🏛️ Arquitectura Limpia y Principios SOLID en Django & DRF

El backend se estructura siguiendo las mejores prácticas de ingeniería de software:

```
BackEnd/
├── brigada_backend/           # Configuración central del proyecto Django
│   ├── __init__.py           # Inicialización de PyMySQL como driver MySQLdb
│   ├── asgi.py & wsgi.py     # Puntos de entrada ASGI/WSGI
│   ├── settings.py           # Configuración unificada (MariaDB, CORS, DRF, Apps)
│   ├── test_settings.py      # Configuración rápida en memoria para tests automatizados
│   └── urls.py               # Enrutamiento raíz (/api/)
├── dashboard/                 # Aplicación de dominio (Clean Architecture)
│   ├── models.py             # Capa de Dominio / Entidades ORM (MariaDB)
│   ├── serializers.py        # Capa de Serialización / DTOs (Transformación y validación)
│   ├── selectors.py          # Capa de Consultas (Principio S: consultas desacopladas)
│   ├── services.py           # Capa de Casos de Uso / Negocio (Principio S/O/D)
│   ├── views.py              # Capa de Controladores HTTP REST (APIView)
│   ├── urls.py               # Rutas REST de la aplicación dashboard
│   ├── tests.py              # Suite de pruebas unitarias de estados HTTP
│   └── management/commands/  # Comandos personalizados de Django
│       └── seed_db.py        # Poblador inicial de datos en MariaDB
├── database/
│   ├── init_db.sql           # Script DDL/DML autónomo para MariaDB
│   └── brigada_hostel.sqlite3# Copia histórica / fallback local
├── .env.example              # Plantilla de variables de entorno (MariaDB)
├── .env                      # Variables de entorno activas
├── requirements.txt          # Dependencias de Python (Django, DRF, PyMySQL, etc.)
└── verify_api.py             # Script de validación integral de 14 endpoints HTTP
```

### Responsabilidad de cada capa

| Capa | Archivo | Principio SOLID / Responsabilidad |
| :--- | :--- | :--- |
| **Modelos (Dominio)** | `models.py` | Entidades de datos mapeadas a tablas físicas MariaDB (`usuarios`, `habitaciones`, `servicios`, `reservas`, `reserva_servicios`, `logs_auditoria`, `notificaciones`, `integrantes`). |
| **Serializadores (DTOs)** | `serializers.py` | Validación de esquemas, conversión camelCase (Angular) ↔ snake_case (Django) y control de tipos. |
| **Selectores (Lectura)** | `selectors.py` | **S (Single Responsibility)**: Centraliza lecturas del ORM (`select_related`, filtros por rango de fechas, estados). |
| **Servicios (Negocio)** | `services.py` | **S / O / D**: Encapsula la lógica de negocio (cálculo de métricas, transiciones de estado de reservas, registro en log de auditoría). |
| **Vistas (Controladores)** | `views.py` | **S / D**: Controladores HTTP que reciben el request, validan con serializers, delegan a servicios y retornan códigos HTTP explícitos (`200 OK`, `201 CREATED`, `204 NO CONTENT`, `400 BAD REQUEST`, `401 UNAUTHORIZED`, `404 NOT FOUND`). |
| **Comando de Poblado** | `management/commands/seed_db.py` | Inserta o actualiza datos iniciales idénticos al catálogo de habitaciones, usuarios, servicios y reservas. |

---

## ⚙️ Configuración de la Conexión Django ↔ MariaDB

La conexión se realiza en `brigada_backend/settings.py` leyendo los parámetros del archivo `.env`:

```python
# brigada_backend/settings.py
DB_ENGINE = os.getenv('DB_ENGINE', 'mariadb').lower()

if DB_ENGINE in ('mariadb', 'mysql'):
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.mysql',
            'NAME': os.getenv('DB_NAME', 'brigada_hostel_db'),
            'USER': os.getenv('DB_USER', 'root'),
            'PASSWORD': os.getenv('DB_PASSWORD', ''),
            'HOST': os.getenv('DB_HOST', '127.0.0.1'),
            'PORT': os.getenv('DB_PORT', '3306'),
            'OPTIONS': {
                'charset': 'utf8mb4',
                'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
            },
        }
    }
else:
    # Fallback portable SQLite en caso de no disponer de servidor MariaDB local
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'database' / 'brigada_hostel.sqlite3',
        }
    }
```

Y en `brigada_backend/__init__.py`:
```python
try:
    import pymysql
    pymysql.install_as_MySQLdb()
except ImportError:
    pass
```

---

## 📋 Guía Paso a Paso: Cómo Iniciar el Backend con MariaDB

### 1. Preparar el Servidor MariaDB

Asegurate de que el servicio de MariaDB esté en ejecución y creá la base de datos:

**En Linux:**
```bash
sudo systemctl start mariadb
sudo mariadb -u root
```

**En Windows (XAMPP / WampServer / MariaDB standalone):**
Iniciá el módulo **MySQL / MariaDB** desde el panel de control de XAMPP o los servicios de Windows.

**Crear la base de datos y otorgar permisos en MariaDB:**
```sql
CREATE DATABASE IF NOT EXISTS brigada_hostel_db
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

-- (Opcional) Si deseás un usuario dedicado:
CREATE USER IF NOT EXISTS 'brigada_user'@'localhost' IDENTIFIED BY 'brigada_pass';
GRANT ALL PRIVILEGES ON brigada_hostel_db.* TO 'brigada_user'@'localhost';
FLUSH PRIVILEGES;
```

> **Alternativa directa por archivo SQL:** Podés cargar la estructura y datos de una sola vez ejecutando en tu terminal:
> ```bash
> mariadb -u root -p < database/init_db.sql
> ```

---

### 2. Configurar el Entorno Virtual de Python

Dentro de la carpeta `BackEnd/`:

**En Linux / macOS:**
```bash
cd BackEnd
python3 -m venv venv
source venv/bin/activate
```

**En Windows (PowerShell):**
```powershell
cd BackEnd
python -m venv venv
.\venv\Scripts\Activate.ps1
```

*(Comprobá que el prompt muestre el prefijo `(venv)`).*

---

### 3. Instalar Dependencias

Instalá todos los paquetes requeridos, incluyendo Django, DRF y PyMySQL:
```bash
pip install -r requirements.txt
```

---

### 4. Configurar el archivo `.env`

Copiá `.env.example` a `.env` si aún no lo hiciste:
```bash
# Linux / macOS
cp .env.example .env

# Windows
copy .env.example .env
```

Revisá las credenciales en tu `.env`:
```ini
DB_ENGINE=mariadb
DB_NAME=brigada_hostel_db
DB_USER=root
DB_PASSWORD=tu_contraseña_aqui
DB_HOST=127.0.0.1
DB_PORT=3306
```

---

### 5. Ejecutar Migraciones y Poblado de Datos Iniciales

Para que Django cree todas las tablas en MariaDB y cargue los registros de prueba:
```bash
python manage.py migrate
python manage.py seed_db
```

---

### 6. Iniciar el Servidor de Desarrollo Backend

```bash
python manage.py runserver 8000
```

El servidor quedará disponible en:
* **API Navegable DRF:** `http://127.0.0.1:8000/api/`
* **Panel de Administración Django:** `http://127.0.0.1:8000/admin/`

---

## 🧪 Pruebas Automatizadas y Verificación de Endpoints

1. **Suite de pruebas de Django:**
   ```bash
   python manage.py test dashboard --settings=brigada_backend.test_settings
   ```
   *(Ejecuta 13 tests unitarios cubriendo los códigos HTTP 200, 201, 204, 400, 401 y 404).*

2. **Script de Verificación Integral de la API (14 verificaciones de endpoints):**
   ```bash
   python verify_api.py
   ```

---

## 🌐 Cómo Correr el Frontend (Angular) con el Backend (Django)

Para tener el sistema completo funcionando (Frontend consumiendo la API de Django conectada a MariaDB):

### Diagrama de Comunicación

```
┌─────────────────────────┐         HTTP / JSON         ┌──────────────────────────────┐
│     Frontend Angular    │ ──────────────────────────> │   Backend Django REST (DRF)  │
│  http://localhost:4200  │ <────────────────────────── │    http://127.0.0.1:8000     │
└─────────────────────────┘      CORS Habilitado        └──────────────┬───────────────┘
                                                                       │
                                                                 PyMySQL / ORM
                                                                       │
                                                        ┌──────────────▼───────────────┐
                                                        │       Base de Datos          │
                                                        │      MariaDB (InnoDB)        │
                                                        │         Puerto 3306          │
                                                        └──────────────────────────────┘
```

### Paso a Paso para Ejecutar Ambos Simultáneamente:

1. **Terminal 1 — Iniciar el Backend (Django con MariaDB):**
   ```bash
   cd BrigadaHostel/BackEnd
   source venv/bin/activate       # En Windows: .\venv\Scripts\activate
   python manage.py runserver 8000
   ```
   *(Mantené esta terminal abierta. Debe indicar `Starting development server at http://127.0.0.1:8000/`).*

2. **Terminal 2 — Iniciar el Frontend (Angular):**
   ```bash
   cd BrigadaHostel/FrontEnd
   npm install                    # Solo la primera vez
   npm start                      # Ejecuta 'ng serve'
   ```
   *(El Frontend se compilará y quedará escuchando en `http://localhost:4200/`).*

3. **Verificación de la Conexión:**
   - La configuración del frontend en `src/environments/environment.development.ts` y `environment.ts` apunta a:
     ```typescript
     export const environment = {
       production: false,
       apiUrl: 'http://127.0.0.1:8000/api'
     };
     ```
   - Abrí tu navegador en **`http://localhost:4200/`**.
   - Accedé a la sección de **Reservas**, **Huéspedes** o **Métricas** en el Dashboard: los datos provendrán en tiempo real desde **MariaDB** a través de Django REST Framework.

---

## 📡 Catálogo de Endpoints de la API REST

| Método | Endpoint | Descripción | Códigos HTTP |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/` | Raíz de la API y mapa de recursos disponibles | `200` |
| `GET` | `/api/reservas/` | Listar reservas (filtros: `?estado=`, `?search=`, `?tipoHabitacion=`) | `200` |
| `POST` | `/api/reservas/` | Crear nueva reserva con validaciones de fechas y disponibilidad | `201`, `400` |
| `GET` | `/api/reservas/<id>/` | Detalle de reserva por ID | `200`, `404` |
| `PATCH` | `/api/reservas/<id>/` | Modificación parcial de reserva | `200`, `400`, `404` |
| `PATCH` | `/api/reservas/<id>/estado/`| Actualización directa del estado operativo (`pendiente`, `confirmada`, `cancelada`) | `200`, `400`, `404` |
| `DELETE` | `/api/reservas/<id>/` | Eliminar reserva del sistema | `204`, `404` |
| `GET` | `/api/habitaciones/` | Catálogo de habitaciones (`?disponible=true`) | `200` |
| `POST` | `/api/habitaciones/` | Registrar nueva habitación en el sistema | `201`, `400` |
| `GET` | `/api/dashboard/metricas/`| Métricas en tiempo real (ocupación, check-ins, cancelaciones, ingresos) | `200` |
| `GET` | `/api/integrantes/` | Listado del equipo de desarrollo (Quiénes Somos) | `200` |
| `POST` | `/api/auth/login/` | Autenticación de usuario para acceso al Dashboard con validación de intentos | `200`, `400`, `401`, `403` |
