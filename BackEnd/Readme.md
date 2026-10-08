# 🏨 BrigadaHostel — Backend REST API (Django & Django REST Framework)

Backend profesional desarrollado para el sistema de administración y portal de autogestión de **BrigadaHostel**.

Implementado íntegramente con **Django 5** y **Django REST Framework (DRF)** bajo una arquitectura limpia (**Clean Architecture**) y principios de diseño **SOLID**, con base de datos relacional integrada en archivo (`brigada_hostel.sqlite3`), sin necesidad de instalar servidores de bases de datos externos.

---

## 🏛️ Arquitectura Limpia y Principios SOLID

El código de la aplicación `dashboard/` está organizado en capas con responsabilidades desacopladas:

| Capa | Archivo | Principio SOLID / Responsabilidad |
| :--- | :--- | :--- |
| **Modelos** | `models.py` | Definición de entidades, esquemas relacionales y persistencia en base de datos. |
| **Serializadores** | `serializers.py` | Validación de datos de entrada/salida y transformación camelCase (Angular) a snake_case (Python). |
| **Selectores (Queries)** | `selectors.py` | **S (Single Responsibility)**: Centraliza todas las consultas, filtrados y búsquedas del ORM. |
| **Servicios de Negocio** | `services.py` | **S / O / D**: Encapsula reglas de negocio (cálculo de métricas, transiciones de estado de reservas, auditoría y autenticación). |
| **Vistas (Controladores)** | `views.py` | **S / D (Dependency Inversion)**: Controladores HTTP que reciben el request, validan, delegan a servicios y retornan códigos HTTP explícitos (`200`, `201`, `204`, `400`, `401`, `404`). |
| **Comandos de Poblado** | `management/commands/seed_db.py` | Generación y carga de datos iniciales consistentes de usuarios, habitaciones, reservas e integrantes. |
| **Pruebas Automatizadas** | `tests.py` & `verify_api.py` | Cobertura integral de todos los códigos de respuesta HTTP y flujos de negocio. |

---

## 📋 Guía Rápida para el Equipo: Cómo Iniciar el Backend

Compartí estos pasos con tus compañeros para que puedan clonar el repositorio e iniciar el backend en sus computadoras:

### 1. Clonar el repositorio y entrar a la carpeta del Backend
```bash
git clone <URL_DEL_REPOSITORIO>
cd BrigadaHostel/BackEnd
```

### 2. Crear y activar el entorno virtual de Python

**En Linux / macOS:**
```bash
python3 -m venv venv
source venv/bin/activate
```

**En Windows (PowerShell / CMD):**
```powershell
python -m venv venv
.\venv\Scripts\activate
```

*(Vas a ver que en la terminal aparece `(venv)` al inicio de la línea).*

### 3. Instalar las dependencias
```bash
pip install -r requirements.txt
```

### 4. Configurar variables de entorno (Opcional)
El proyecto incluye un archivo `.env.example`. Podés copiarlo a `.env` (si aún no existe):
```bash
# En Linux / macOS:
cp .env.example .env

# En Windows:
copy .env.example .env
```

### 5. Aplicar migraciones y poblar la base de datos
La base de datos relacional SQLite (`brigada_hostel.sqlite3`) se ubica en la carpeta `database/`. Para inicializarla o asegurar que tenga todos los datos de prueba cargados:
```bash
python manage.py migrate
python manage.py seed_db
```

### 6. Iniciar el servidor backend
```bash
python manage.py runserver 8000
```
El servidor quedará corriendo en: **`http://127.0.0.1:8000/`**.
Podés abrir en tu navegador `http://127.0.0.1:8000/api/` para ver la documentación navegable de DRF.

---

## 🧪 Verificación y Pruebas Unitarias

Para comprobar que todos los endpoints y códigos HTTP funcionen al 100%:

1. **Ejecutar la suite de tests de Django:**
   ```bash
   python manage.py test
   ```
2. **Ejecutar el script de verificación integral (14 verificaciones de endpoints):**
   ```bash
   python verify_api.py
   ```

---

## 🌐 Conexión con el Frontend (Angular)

1. El frontend en `FrontEnd/` está configurado para consumir `http://127.0.0.1:8000/api` mediante `src/environments/environment.development.ts`.
2. Para correr el frontend:
   ```bash
   cd ../FrontEnd
   npm install
   npm start
   ```
3. Navegá a `http://localhost:4200/` en tu navegador.

---

## 📡 Catálogo de Endpoints de la API REST

| Método | Endpoint | Descripción | Códigos HTTP |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/` | Raíz de la API y mapa de endpoints | `200` |
| `GET` | `/api/reservas/` | Listar reservas (filtros: `?estado=`, `?search=`, `?tipoHabitacion=`) | `200` |
| `POST` | `/api/reservas/` | Crear nueva reserva con validaciones de fechas | `201`, `400` |
| `GET` | `/api/reservas/<id>/` | Detalle de reserva por ID | `200`, `404` |
| `PATCH` | `/api/reservas/<id>/` | Modificación parcial de reserva | `200`, `400`, `404` |
| `PATCH` | `/api/reservas/<id>/estado/`| Actualización directa del estado operativo | `200`, `400`, `404` |
| `DELETE` | `/api/reservas/<id>/` | Eliminar reserva del sistema | `204`, `404` |
| `GET` | `/api/habitaciones/` | Catálogo de habitaciones (`?disponible=true`) | `200` |
| `POST` | `/api/habitaciones/` | Registrar nueva habitación | `201`, `400` |
| `GET` | `/api/dashboard/metricas/`| Métricas en tiempo real (ocupación, check-ins, cancelaciones, ingresos) | `200` |
| `GET` | `/api/integrantes/` | Listado del equipo (Quiénes Somos) | `200` |
| `POST` | `/api/auth/login/` | Autenticación de usuario para acceso al Dashboard | `200`, `400`, `401`, `403` |
