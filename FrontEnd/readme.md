# Panel de Administración — BrigadaHostel

> Interfaz interna de gestión operativa para el sistema de administración de BrigadaHostel. Diseñada con foco en usabilidad, rendimiento y mantenibilidad a largo plazo.

---

## Índice

1. [Descripción General](#descripción-general)
2. [Acceso y Autenticación](#acceso-y-autenticación)
3. [Módulos del Panel](#módulos-del-panel)
   - [Dashboard — Resumen General](#dashboard--resumen-general)
   - [Reservas — Flujo de Registro](#reservas--flujo-de-registro)
   - [Recepción — Operatividad Diaria](#recepción--operatividad-diaria)
   - [Configuración — Ajustes del Sistema](#configuración--ajustes-del-sistema)
4. [Navegación y Estructura Compartida](#navegación-y-estructura-compartida)
5. [Aspectos Técnicos](#aspectos-técnicos)
6. [Guía para el Desarrollo](#guía-para-el-desarrollo)

---

## Descripción General

BrigadaHostel Admin es un panel de administración interno compuesto por páginas HTML estáticas con estilos centralizados en un único archivo CSS. No depende de frameworks JavaScript ni de un backend activo para funcionar: toda la lógica de navegación, menús y layout está resuelta a nivel de CSS puro.

El panel está orientado al personal administrativo del hostel y cubre cuatro áreas operativas: análisis de rendimiento, gestión de reservas, control de recepción y configuración del sistema.

---

## Acceso y Autenticación

El ingreso al panel se realiza a través de dos páginas dedicadas que comparten la misma estética del sistema:

### Login (`loginDashboard.html`)
Formulario de acceso con dos campos: email y contraseña. Al enviar el formulario, redirige directamente a `dashboard.html`. Incluye un enlace para crear una cuenta nueva.

### Registro (`signupDashboard.html`)
Formulario de alta de nuevo usuario administrativo con los campos: nombre, apellido, email y contraseña (mínimo 8 caracteres, validado con `minlength`). Al completarse, redirige al login. El título del `<head>` tiene un typo menor (`Singup`) que puede corregirse.

Ambas páginas muestran el logo del hostel en la parte superior de la tarjeta de autenticación.

---

## Módulos del Panel

### Dashboard — Resumen General

Es la pantalla de inicio tras autenticarse. Está orientada a dar una visión rápida del rendimiento comercial del hostel.

**Métricas principales (fila de tarjetas):**

| Métrica | Valor de ejemplo | Indicador |
|---|---|---|
| Anticipación Promedio de Reserva | 12.4 días | ▲ vs mes pasado |
| Tasa de Abandono en Checkout | 24.8% | ▼ mejora del 5% |
| Ratio de Cancelación | 4.2% | ▲ riesgo |
| Estadía Promedio (LOS) | 3.2 noches | ▲ 0.5 noches |

**Gráficos y análisis detallados:**

- **Embudo de Conversión** — Muestra el recorrido del usuario desde la búsqueda hasta la reserva efectiva: Búsquedas (4.2k) → Ver disponibilidad (2.7k) → Calcular costo (1.2k) → Registrar reserva (504).
- **Top Servicios Extras** — Ranking con barras horizontales de los servicios adicionales más vendidos: Desayuno Buffet ($4.2k), Cochera Privada ($2.8k), Masajes Spa ($1.5k), Traslados ($1.2k), Lavandería ($0.8k).
- **Distribución de Ingresos** — Gráfico de torta CSS con la proporción por tipo de habitación: Suites 45%, Dobles 30%, Simples 25%.
- **Estacionalidad de Consultas** — Gráfico de barras verticales con la demanda mensual de enero a junio.
- **Canales de Venta** — Comparación entre Web Site (70% — $8.4k) y Mobile App (30% — $3.6k).
- **Impacto de Extras en el Ticket** — Compara el ticket base promedio ($145) contra el ticket final con servicios adicionales ($192.50).

---

### Reservas — Flujo de Registro

Página orientada a registrar una nueva estadía. El proceso está dividido en **4 pasos secuenciales** indicados por un stepper visual en la parte superior.

| Paso | Contenido |
|---|---|
| **1 — Selección de Fechas** | Formulario con dos campos de tipo `date`: Fecha de Entrada y Fecha de Salida. El botón "Ver Disponibilidad" avanza al paso 2. |
| **2 — Tipo de Habitación** | Dos opciones presentadas en tarjetas: **Dormitorio Compartido** ($20/noche — 8 camas, Wifi, Locker) y **Habitación Privada Deluxe** ($55/noche — Cama King, Baño Suite, Aire Acondicionado). Seleccionar una avanza al paso 3. |
| **3 — Servicios y Resumen** | Panel izquierdo con servicios adicionales (Desayuno Buffet +$12/día, Traslado al Aeropuerto +$25). Panel derecho con resumen de costos desglosado: estadía, servicios, impuestos (10%) y total a pagar. |
| **4 — Confirmación** | Pantalla de éxito con ícono de check verde, código de reserva (`#BH-9921`) y opción de descarga en PDF. Botón para volver al Dashboard. |

La navegación entre pasos funciona mediante anclas HTML (`#paso1`, `#paso2`, etc.), sin JavaScript.

---

### Recepción — Operatividad Diaria

Orientada al trabajo en mostrador. Combina métricas operativas en tiempo real con herramientas de gestión de huéspedes.

**Métricas rápidas:**

| Métrica | Valor de ejemplo |
|---|---|
| Productividad del Staff | 142 gestiones (+12 hoy) |
| No-Show Rate | 2.1% (▼ mejora) |
| Tiempo Promedio de Check-in | 4.5 min (▼ mejorado) |
| Ingresos en Mostrador | $1,240 (▲ 15% venta directa) |

**Secciones de análisis:**

- **Ocupación Real Diaria** — Círculo de progreso CSS que muestra 18 de 24 habitaciones ocupadas (85%).
- **Estado de Inventario** — Barra de distribución visual con cuatro estados: Ocupadas (18), Limpias (4), Sucias (2), En Mantenimiento (0).
- **Modificaciones Manuales** — Gráfico de barras por día de la semana para monitorear ajustes realizados en mostrador.
- **Origen de Cancelaciones** — Comparación entre cancelaciones por Admin/Recepción (45%) y autogestión del usuario (55%).
- **Previsión de Check-outs** — Barra de salidas previstas para los próximos días.
- **Discrepancia de Montos** — Alerta destacada en rojo que muestra diferencias entre el monto calculado y el cobrado (+$245.00 de ejemplo).

**Tabla de gestión:** Lista de huéspedes activos con columnas de habitación, estado (`Hospedado`), y acciones directas por fila (Actualizar, Check-out, Reportar).

---

### Configuración — Ajustes del Sistema

Módulo de personalización de la cuenta y el entorno del administrador.

**Métricas de estado (fila de tarjetas):**

| Indicador | Valor |
|---|---|
| Estado de Cuenta | Verificada — Seguridad Alta |
| Rol de Usuario | Super Admin — Acceso Total |
| Último Cambio de Contraseña | Hace 12 días (próximo en 78 días) |
| Versión del Sistema | v2.4.8-stable |

**Secciones:**

- **Perfil de Administrador** — Foto de perfil (JPG/PNG, máx. 800K), nombre completo y email de contacto con botón de actualización.
- **Preferencias Visuales** — Selector de idioma (Español, English, Português), selector de tema Claro/Oscuro y toggle de Modo Compacto.
- **Alertas y Notificaciones** — Tres opciones configurables: Nuevas Reservas (email), Reporte de Turno (cierre de caja) y Alertas SMS (marcadas como costo extra).
- **Seguridad y Acceso** — Alerta visible de 2FA desactivado, formulario de cambio de contraseña (contraseña actual + nueva), y registro de últimas sesiones activas (dispositivo y hora).

---

## Navegación y Estructura Compartida

Todas las páginas del panel (excepto las de autenticación) comparten los mismos elementos de interfaz:

- **Barra lateral (sidebar)** — Contiene el logo, el nombre del panel, la navegación principal (Resumen, Reservas, Recepción, Configuración) y dos acciones en el pie: Cerrar Sesión y Volver al sitio web.
- **Encabezado (header)** — Muestra el título de la sección actual, un subtítulo descriptivo y el nombre del usuario con su avatar en la esquina derecha.
- **Botón hamburguesa** — Visible solo en mobile, controla la apertura del sidebar.

El enlace activo en la barra lateral se marca con la clase `active`, diferenciando visualmente la sección en la que se encuentra el usuario.

---

## Aspectos Técnicos

### Navegación Mobile sin JavaScript
El menú lateral en dispositivos móviles se controla con un `<input type="checkbox" id="menu-cb" hidden>` y un `<label for="menu-cb">` como disparador. Al activarse, un overlay cubre el contenido y el sidebar se despliega. Este mecanismo no requiere JavaScript, lo que garantiza compatibilidad total y carga instantánea.

### Diseño Adaptativo
Las tablas de datos (como la de recepción) se transforman automáticamente en tarjetas apiladas en pantallas pequeñas, usando el atributo `data-label` en cada celda para mostrar el encabezado de columna correspondiente.

### Centralización de Estilos
Todos los módulos referencian un único archivo `dashboard.css`. Cualquier cambio en ese archivo se refleja en todo el panel, lo que facilita el mantenimiento y garantiza consistencia visual.

---

## Guía para el Desarrollo

- **No introducir JavaScript** para funciones que el CSS ya resuelve (menú mobile, anclas, estados visuales).
- **Respetar las clases de utilidad existentes** (`btn-premium`, `btn-outline`, `metric-card`, `content-section`, `input-field`, etc.) antes de escribir estilos nuevos.
- **Mantener el atributo `data-label`** en las celdas `<td>` de cualquier tabla nueva, para que funcione correctamente el layout responsive en mobile.
- **Seguir el mismo patrón de encabezado y sidebar** al agregar nuevas páginas, incluyendo el checkbox de control del menú mobile y el link activo en la navegación.
- **Mantener los comentarios en el HTML** con el estilo actual (en mayúsculas y con guiones: `<!-- SECCIÓN DE ... -->`), ya que sirven como separadores de bloque claros en archivos extensos.
