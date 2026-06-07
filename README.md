# BrigadaHostel & Panel de Administracion

> Interfaz de gestión operativa y portal de autogestión para el sistema de administración de BrigadaHostel. Diseñada con foco en usabilidad, rendimiento, accesibilidad y mantenibilidad a largo plazo.

---

# Índice

1. Descripción General
2. Acceso y Autenticación
3. Modo Administrador
4. Modo Usuario
5. Casos de Uso e Historias de Usuario
6. Navegación y Estructura Compartida
7. Aspectos Técnicos
8. Sistema de Branching y Organización
9. About & Contributors

---

# Descripción General

BrigadaHostel es un ecosistema de gestión compuesto por páginas HTML estáticas. Para esta versión del proyecto se incorporó **Bootstrap 5.3.3** para la construcción de layouts responsivos, tanto en las páginas públicas del sitio como en los módulos internos del Dashboard.

El sistema fue desarrollado en dos vistas claramente diferenciadas:

* **Modo Administrador:** orientado al personal interno del hostel.
* **Modo Usuario:** enfocado en la autogestión de reservas y estadías por parte de huéspedes y clientes.

Además, se realizó una importante refactorización visual eliminando estilos en línea y clases repetidas, centralizando toda la apariencia visual y estructura compartida en un único archivo CSS (`dashboard.css`).

El objetivo principal es centralizar la administración interna y la experiencia de autogestión del cliente en una plataforma moderna, responsive y fácilmente mantenible.

---

# Acceso y Autenticación

El ingreso al sistema se realiza mediante dos páginas dedicadas que comparten la misma identidad visual del proyecto.

## Login (`loginDashboard.html`)

Formulario de acceso compuesto por:

* Email
* Contraseña

Al enviar el formulario, el usuario es redirigido al panel correspondiente según su rol.

Incluye:

* Crear cuenta nueva
* Recuperar contraseña

## Registro (`signupDashboard.html`)

Formulario de alta de nuevos usuarios compuesto por:

* Nombre
* Apellido
* Email
* Contraseña

La contraseña requiere un mínimo de 8 caracteres mediante validación HTML (`minlength`).

Una vez completado el registro, el usuario es redirigido al Login.

Ambas páginas presentan:

* Logo institucional
* Tarjeta de autenticación centrada
* Diseño responsive
* Estética unificada con el resto del sistema

---

# Modo Administrador

Orientado al personal administrativo del hostel. Permite gestionar reservas, monitorear operaciones, controlar recepción y analizar indicadores de rendimiento.

---

## Dashboard — Resumen Operativo (`dashboard.html`)

Pantalla principal del sistema.

### Métricas Principales

| Métrica           | Valor Prototipo | Indicador     |
| ----------------- | --------------- | ------------- |
| Ocupación Hoy     | 85%             | ▲ 18/24 camas |
| Check-ins Hoy     | 6               | 2 pendientes  |
| Ratio Cancelación | 4.2%            | ▲ riesgo      |
| Estadía Promedio  | 3.2 noches      | ▲ mejora      |

### Gráficos y Análisis

#### Estado de Habitaciones

* Ocupadas: 18
* Limpias: 4
* Sucias: 2

#### Tendencia de Ingresos

Visualización semanal mediante gráfico CSS.

#### Mix de Canales de Venta

* Booking: 60%
* Expedia: 20%
* Venta Directa: 15%
* Otros: 5%

#### Últimos Movimientos

Registro cronológico de actividades recientes:

* Check-in
* Check-out
* Modificaciones
* Cancelaciones

---

## Reservas — Gestión y Listado Maestro (`reservas.html`)

Panel centralizado para administración de reservas.

### Ejemplos

| Código  | Huésped      | Habitación | Estado    |
| ------- | ------------ | ---------- | --------- |
| BH-9921 | Juan Pérez   | Suite 101  | Pendiente |
| BH-8840 | María García | Doble 102  | Check-in  |
| BH-7730 | Carlos Ruiz  | Cama 4     | Cancelada |

### Funcionalidades

* Búsqueda avanzada
* Filtrado por estado
* Reasignación de habitación
* Gestión de observaciones
* Confirmar check-in
* Cancelar reserva

### Side Panel Administrativo

Permite:

* Editar datos
* Cambiar estado
* Agregar notas
* Ejecutar acciones rápidas

---

## Recepción — Operatividad Diaria

Módulo orientado a la gestión diaria del mostrador.

### Métricas Operativas

| Métrica                  | Valor         |
| ------------------------ | ------------- |
| Productividad Staff      | 142 gestiones |
| No-Show Rate             | 2.1%          |
| Tiempo Promedio Check-in | 4.5 min       |
| Ingresos Mostrador       | $1,240        |

### Análisis Incluidos

* Ocupación diaria
* Estado del inventario
* Modificaciones manuales
* Origen de cancelaciones
* Previsión de check-outs
* Alertas de discrepancias de montos

### Gestión de Huéspedes Activos

Tabla con:

* Habitación
* Estado
* Actualización rápida
* Check-out
* Reportes

---

## Huéspedes — Análisis de Huéspedes

**Responsable: Alejo Camolotto**

Permite comprender el perfil y comportamiento de los visitantes.

### Indicadores

* Huéspedes Totales: 1.240
* Satisfacción General: 4.8 / 5

### Directorio Reciente

* Carlos Mendoza (Argentina)
* Emily Watson (Reino Unido)
* Jean Pierre (Francia)
* Sofia Rossi (Italia)

### Distribución Demográfica

* Argentina: 45%
* Brasil: 20%
* Estados Unidos: 15%
* España: 10%
* Otros: 10%

### Funcionalidades

* Nacionalidades
* Segmentación por edad
* Motivos de viaje
* Fidelización
* Estadísticas visuales
* Análisis demográfico

---

## Operaciones — Operaciones y Eficiencia

**Responsable: Giuliano Batistella**

Monitorea recursos internos, limpieza y mantenimiento.

### Indicadores

* Eficiencia Operativa: 92%

### Estado de Habitaciones

* Habitación 101 — Limpia
* Habitación 102 — En Limpieza
* Dormitorio 4 — Sucia (URGENTE)

### Mantenimiento

* Reparación de grifería — Habitación 105

### Funcionalidades

* Seguimiento de limpieza
* Inventario
* Consumo energético
* Atención al huésped
* Rendimiento operativo
* Gestión de recursos

---

## Métricas — Métricas Financieras y Operativas

**Responsable: Mauricio Ferreyra**

Panel financiero y operativo del hostel.

### Indicadores Principales

| Indicador            | Valor  |
| -------------------- | ------ |
| RevPAR               | $45.20 |
| ADR                  | $58.00 |
| Utilidad Neta        | $12.4K |
| Costo de Adquisición | $4.10  |

### Funcionalidades

* Evolución financiera
* Rentabilidad
* ROI de campañas
* Ocupación segmentada
* Análisis comercial

---

## Configuración — Ajustes del Sistema

Personalización de la cuenta administrativa.

### Estado del Sistema

| Indicador                | Valor         |
| ------------------------ | ------------- |
| Estado Cuenta            | Verificada    |
| Rol Usuario              | Super Admin   |
| Último Cambio Contraseña | Hace 12 días  |
| Versión Sistema          | v2.4.8-stable |

### Secciones

#### Perfil

* Foto
* Nombre
* Email

#### Preferencias

* Idioma
* Tema Claro/Oscuro
* Modo Compacto

#### Notificaciones

* Reservas
* Reportes
* Alertas SMS

#### Seguridad

* 2FA
* Cambio de contraseña
* Sesiones activas

---

# Modo Usuario

Diseñado para huéspedes y clientes que desean autogestionar sus reservas y estadías.

## Dashboard — Tu Resumen (`dashboardUsuario.html`)

| Métrica            | Valor |
| ------------------ | ----- |
| Días para tu viaje | 13    |
| Estadías Totales   | 4     |
| Brigada Points     | 1.250 |
| Crédito Disponible | $25   |

### Próxima Estadía

* Habitación 101 — Suite Premium
* Estado: Confirmada
* Código: BH-9921
* Estadía: 15/06/2026 al 18/06/2026

---

## Reservas — Wizard de Registro (`reservasUsuario.html`)

Proceso guiado de reserva.

### Paso 1 — Selección de Fechas

* Fecha Check-in
* Fecha Check-out

### Paso 2 — Tipo de Habitación

* Individual ($30/noche)
* Doble ($45/noche)
* Suite Premium ($85/noche)

### Paso 3 — Disponibilidad

* Disponible
* Sin disponibilidad

### Paso 4 — Servicios Adicionales

* Desayuno Buffet
* Traslado
* Cochera
* Late Check-out

### Paso 5 — Confirmación

* Resumen final
* Cálculo total
* Código de reserva generado

---

# Casos de Uso e Historias de Usuario

## Casos de Uso

### CU01 — Iniciar Sesión / Registrar Cuenta

El sistema permite acceder mediante Login y Registro diferenciando vistas de Administrador y Usuario.

### CU02 — Registrar Reserva

El usuario puede seleccionar fechas, habitación, servicios y confirmar una reserva.

### CU03 — Gestionar Reserva

El administrador puede modificar, reasignar o cancelar reservas.

---

## Historias de Usuario

* HU01 — Iniciar Sesión (Cliente)
* HU02 — Iniciar Sesión (Administrador)
* HU03 — Recuperar Contraseña
* HU04 — Registrar Reserva
* HU05 — Agregar Servicios a la Reserva
* HU06 — Cancelar Reserva
* HU07 — Gestionar Reservas del Hotel

---

# Navegación y Estructura Compartida

Todas las páginas reutilizan componentes comunes.

## Sidebar

* Logo institucional
* Navegación principal
* Cerrar sesión
* Volver al sitio web

## Header

* Título actual
* Usuario activo
* Avatar
* Switch de modo Administrador / Usuario

## Menú Mobile

Implementado mediante checkbox oculto y botón hamburguesa.

---

# Aspectos Técnicos

## Bootstrap 5.3.3

Utilizado para:

* Sistema de grillas
* Componentes responsive
* Layouts adaptativos

## Refactorización CSS

* Eliminación de estilos inline
* Eliminación de clases duplicadas
* Centralización en `dashboard.css`

## Navegación Mobile sin JavaScript

El menú lateral mobile se controla mediante:

```html
<input type="checkbox" id="menu-cb" hidden>
```

Al activarse despliega el sidebar sin requerir JavaScript.

## Diseño Adaptativo

Las tablas utilizan el atributo:

```html
data-label=""
```

permitiendo transformarse automáticamente en tarjetas responsive en dispositivos móviles.

---

# Sistema de Branching y Organización

Este proyecto está documentado con un flujo de Git basado en Git Flow, que incluye las ramas `main` y `develop`.

## Estructura de ramas

* `main` — versión estable y lista para producción.
* `develop` — rama de integración donde se unen las nuevas funcionalidades.
* `feature/*` — ramas para el desarrollo de funcionalidades, creadas desde `develop`.
* `release/*` — ramas opcionales para preparar versiones estables desde `develop`.
* `hotfix/*` — ramas para correcciones urgentes creadas desde `main` y luego sincronizadas con `develop`.

## Flujo de trabajo recomendado

1. Cambiar a `develop`.
2. Crear la rama de trabajo desde `develop`:

```bash
git checkout -b feature/nombre-feature
```

3. Hacer commits pequeños, atómicos y descriptivos.

4. Usar convenciones de mensaje:

* `feat:` para nuevas funcionalidades.
* `fix:` para correcciones.
* `docs:` para documentación.
* `refactor:` para mejoras internas.

5. Subir la rama al remoto:

```bash
git push -u origin feature/nombre-feature
```

6. Abrir Pull Request / Merge Request hacia `develop`.
7. Una vez revisado, unir la rama a `develop`.
8. Para lanzamientos, crear `release/*` desde `develop`, luego merge a `main`.
9. En caso de corrección urgente, crear `hotfix/*` desde `main`, mergear a `main` y luego a `develop`.

## Buena práctica de commits

* Cada commit debe representar un cambio claro y limitado.
* Evitar mensajes genéricos como "cambios" o "arreglos".

Ejemplo:

```bash
git commit -m "feat: agregar sección de contribuyentes en README"
```

## Consideración importante

El repositorio ya incluye la rama `develop`, por lo que el documento debe reflejar este flujo real.

Si el equipo decide usar un flujo más simple (GitHub Flow), el README deberá ajustarse para describir ese esquema en lugar de Git Flow.

---

# About & Contributors

**Proyecto de Evidencia 1 — Sistema de Administración Hotelera**

Prototipo responsive orientado a la gestión interna y autogestión de huéspedes.

**Tecnicatura Superior en Desarrollo de Software — ISPC 2026**

## Roles

| Área                           | Responsable         |
| ------------------------------ | ------------------- |
| Inicio / Home                  | Oscar Quevedo       |
| Sobre Nosotros                 | Jorge Quevedo       |
| Dashboard                      | Agustín Gallardo    |
| Métricas + Caso de Uso         | Mauricio Ferreyra   |
| Operaciones + Diagramas        | Giuliano Batistella |
| Huéspedes + README + Branching | Alejo Camolotto     |

## Contributors

* @agstudio98 — Agustín Gallardo
* @Oscar-Quevedo — Oscar Quevedo
* @JQuevedoJorge — Jorge Quevedo
* @Camolotto — Alejo Camolotto
* @gbatistela — Giuliano Batistella
* @EmiTeck — Mauricio Ferreyra

## Tecnologías Utilizadas

* HTML5
* CSS3
* Bootstrap 5.3.3
* Git
* GitHub
