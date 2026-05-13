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
   - [Huéspedes — Análisis de Huéspedes](#huéspedes--análisis-de-huéspedes)
   - [Operaciones — Operaciones y Eficiencia](#operaciones--operaciones-y-eficiencia)
   - [Métricas — Métricas Financieras y Operativas](#métricas--métricas-financieras-y-operativas)
   - [Configuración — Ajustes del Sistema](#configuración--ajustes-del-sistema)
4. [Navegación y Estructura Compartida](#navegación-y-estructura-compartida)
5. [Aspectos Técnicos](#aspectos-técnicos)
6. [Sistema de Branching y Organización](#sistema-de-branching-y-organización)
7. [Guía para el Desarrollo](#guía-para-el-desarrollo)

---

## Descripción General

BrigadaHostel Admin es un panel de administración interno compuesto por páginas HTML estáticas con estilos centralizados en un único archivo CSS. No depende de frameworks JavaScript ni de un backend activo para funcionar: toda la lógica de navegación, menús y layout está resuelta a nivel de CSS puro.

El panel está orientado al personal administrativo del hostel y cubre múltiples áreas operativas:

- análisis de rendimiento,
- gestión de reservas,
- control de recepción,
- análisis de huéspedes,
- monitoreo operativo,
- métricas financieras,
- configuración del sistema.

El objetivo principal es centralizar la administración interna del hostel en una interfaz moderna, responsive y fácilmente mantenible.

---

## Acceso y Autenticación

El ingreso al panel se realiza a través de dos páginas dedicadas que comparten la misma estética visual del sistema.

### Login (`loginDashboard.html`)
Formulario de acceso con dos campos: email y contraseña. Al enviar el formulario, el usuario es redirigido directamente a `dashboard.html`. Incluye un enlace para crear una cuenta nueva.

### Registro (`signupDashboard.html`)
Formulario de alta de nuevo usuario administrativo con los campos: nombre, apellido, email y contraseña (mínimo 8 caracteres, validado con `minlength`). Al completarse, redirige al login.

> **Nota:** El título del `<head>` contiene un typo menor (`Singup`) que puede corregirse por `Signup`.

Ambas páginas muestran el logo del hostel y la tarjeta de autenticación centrada con estilo visual compartido con el resto del sistema.

---

## Módulos del Panel

### Dashboard — Resumen General

Es la pantalla principal luego de autenticarse. Está orientada a brindar una visión rápida del rendimiento comercial y operativo del hostel.

**Métricas principales (fila de tarjetas):**

| Métrica | Valor de ejemplo | Indicador |
|---|---|---|
| Anticipación Promedio de Reserva | 12.4 días | ▲ vs mes pasado |
| Tasa de Abandono en Checkout | 24.8% | ▼ mejora del 5% |
| Ratio de Cancelación | 4.2% | ▲ riesgo |
| Estadía Promedio (LOS) | 3.2 noches | ▲ 0.5 noches |

**Gráficos y análisis detallados:**

- **Embudo de Conversión** — Recorrido del usuario desde la búsqueda hasta la reserva efectiva: Búsquedas (4.2k) → Ver disponibilidad (2.7k) → Calcular costo (1.2k) → Registrar reserva (504).
- **Top Servicios Extras** — Ranking de servicios adicionales más vendidos: Desayuno Buffet ($4.2k), Cochera Privada ($2.8k), Masajes Spa ($1.5k), Traslados ($1.2k), Lavandería ($0.8k).
- **Distribución de Ingresos** — Gráfico de torta CSS por tipo de habitación: Suites 45%, Dobles 30%, Simples 25%.
- **Estacionalidad de Consultas** — Gráfico de barras verticales con la demanda mensual de enero a junio.
- **Canales de Venta** — Comparación entre Web Site (70% — $8.4k) y Mobile App (30% — $3.6k).
- **Impacto de Extras en el Ticket** — Ticket base promedio ($145) vs ticket final con extras ($192.50).

---

### Reservas — Flujo de Registro

Página orientada al registro de nuevas estadías. El proceso está dividido en **4 pasos secuenciales** mediante un stepper visual.

| Paso | Contenido |
|---|---|
| **1 — Selección de Fechas** | Formulario con Fecha de Entrada y Fecha de Salida. El botón "Ver Disponibilidad" avanza al paso 2. |
| **2 — Tipo de Habitación** | **Dormitorio Compartido** ($20/noche — 8 camas, Wifi, Locker) y **Habitación Privada Deluxe** ($55/noche — Cama King, Baño Suite, Aire Acondicionado). |
| **3 — Servicios y Resumen** | Servicios adicionales (Desayuno Buffet +$12/día, Traslado al Aeropuerto +$25) con resumen de costos: estadía, servicios, impuestos (10%) y total final. |
| **4 — Confirmación** | Pantalla de éxito con ícono de check verde, código de reserva (`#BH-9921`), descarga PDF y botón para volver al Dashboard. |

La navegación entre pasos funciona mediante anclas HTML (`#paso1`, `#paso2`, etc.), sin JavaScript.

---

### Recepción — Operatividad Diaria

Módulo orientado al trabajo operativo del mostrador y gestión diaria de huéspedes. Combina métricas operativas en tiempo real con herramientas administrativas.

**Métricas rápidas:**

| Métrica | Valor de ejemplo |
|---|---|
| Productividad del Staff | 142 gestiones (+12 hoy) |
| No-Show Rate | 2.1% (▼ mejora) |
| Tiempo Promedio de Check-in | 4.5 min (▼ mejorado) |
| Ingresos en Mostrador | $1,240 (▲ 15% venta directa) |

**Secciones de análisis:**

- **Ocupación Real Diaria** — Círculo de progreso CSS: 18 de 24 habitaciones ocupadas (85%).
- **Estado de Inventario** — Distribución visual: Ocupadas (18), Limpias (4), Sucias (2), En Mantenimiento (0).
- **Modificaciones Manuales** — Gráfico de barras por día para monitorear ajustes en recepción.
- **Origen de Cancelaciones** — Admin/Recepción (45%) vs autogestión del usuario (55%).
- **Previsión de Check-outs** — Visualización de salidas programadas para próximos días.
- **Discrepancia de Montos** — Alerta en rojo con diferencias entre montos calculados y cobrados (+$245.00 de ejemplo).

**Tabla de gestión:** Lista de huéspedes activos con habitación, estado y acciones rápidas por fila (Actualizar, Check-out, Reportar).

---

### Huéspedes — Análisis de Huéspedes

> Responsable: [@Alejo Camolotto](https://github.com/Camolotto)

Permite comprender el perfil y comportamiento de los visitantes mediante datos demográficos y patrones de estadía.

Incluye información sobre:
- Nacionalidades principales
- Rangos de edad
- Motivos del viaje
- Nivel de fidelización

Estas métricas ayudan a identificar el público objetivo, adaptar servicios, optimizar estrategias de marketing y aumentar la retención de clientes recurrentes.

**Funcionalidades principales:**
- Distribución por nacionalidades
- Segmentación por edades
- Motivos frecuentes de viaje
- Huéspedes recurrentes
- Estadísticas visuales
- Análisis demográfico general

---

### Operaciones — Operaciones y Eficiencia

> Responsable: [@Giuliano Batistella](https://github.com/gbatistela)

Muestra el estado operativo interno del hostel y permite monitorear el rendimiento diario del personal y los recursos. Incluye métricas de limpieza, mantenimiento, inventario, consumo energético y atención al huésped.

**Objetivos:** optimizar procesos internos, mejorar eficiencia operativa, reducir costos y mantener calidad de servicio.

**Funcionalidades principales:**
- Seguimiento de limpieza
- Estado de inventario
- Consumo de energía
- Tiempo de respuesta al huésped
- Rendimiento operativo diario
- Gestión de recursos internos

---

### Métricas — Métricas Financieras y Operativas

> Responsable: [@Mauricio Ferreyra](https://github.com/EmiTeck)

Panel financiero y operativo del hostel con indicadores clave de rendimiento.

**Indicadores principales:**

- **RevPAR** — Ingreso por habitación disponible con evolución mensual.
- **ADR (Average Daily Rate)** — Tarifa diaria promedio de reservas.
- **Ocupación por tipo de habitación** — Análisis de ocupación segmentado.
- **ROI de campañas de marketing** — Retorno de inversión de campañas promocionales.

**Objetivos del módulo:** evaluar rentabilidad, medir crecimiento, analizar eficiencia operativa y visualizar desempeño comercial.

---

### Configuración — Ajustes del Sistema

Módulo de personalización de la cuenta y el entorno del administrador.

**Métricas de estado:**

| Indicador | Valor |
|---|---|
| Estado de Cuenta | Verificada — Seguridad Alta |
| Rol de Usuario | Super Admin — Acceso Total |
| Último Cambio de Contraseña | Hace 12 días (próximo en 78 días) |
| Versión del Sistema | v2.4.8-stable |

**Secciones:**

- **Perfil de Administrador** — Foto de perfil (JPG/PNG, máx. 800K), nombre completo y email de contacto.
- **Preferencias Visuales** — Idioma (Español, English, Português), tema Claro/Oscuro y Modo Compacto.
- **Alertas y Notificaciones** — Nuevas Reservas (email), Reporte de Turno y Alertas SMS.
- **Seguridad y Acceso** — Estado de 2FA, cambio de contraseña y registro de sesiones activas.

---

## Navegación y Estructura Compartida

Todas las páginas del panel comparten los mismos componentes reutilizables:

- **Sidebar** — Logo, navegación principal, Cerrar Sesión y Volver al sitio web.
- **Header** — Título actual, subtítulo, usuario activo y avatar.
- **Botón hamburguesa** — Visible únicamente en dispositivos móviles. Controla la apertura y cierre del sidebar.

El enlace activo en la barra lateral utiliza la clase `active`.

---

## Aspectos Técnicos

### Navegación Mobile sin JavaScript
El menú lateral mobile se controla con un `<input type="checkbox" id="menu-cb" hidden>` y un `<label for="menu-cb">` como disparador visual. Al activarse, aparece un overlay y se despliega el sidebar sin requerir JavaScript, garantizando compatibilidad total y carga instantánea.

### Diseño Adaptativo
Las tablas se transforman automáticamente en tarjetas apiladas usando el atributo `data-label` en cada celda `<td>`, manteniendo compatibilidad responsive en pantallas pequeñas.

### Centralización de Estilos
Todos los módulos utilizan un único archivo `dashboard.css`. Esto permite mantenimiento simplificado, consistencia visual y reutilización de componentes en todo el panel.

---

## Sistema de Branching y Organización

El proyecto utiliza una metodología basada en ramas para facilitar el trabajo colaborativo.

### Estructura de ramas

- `main` → versión estable final
- `develop` → integración general
- `feature/*` → desarrollo individual


### Flujo de trabajo

1. Crear rama desde `develop`
2. Desarrollar el módulo correspondiente
3. Realizar commits descriptivos
4. Subir cambios al repositorio
5. Realizar merge hacia `develop`

### Roles

| Área | Responsable |
|---|---|
| Inicio / Home | [Oscar Quevedo](https://github.com/Oscar-Quevedo) |
| Sobre Nosotros | [Jorge Quevedo](https://github.com/JQuevedoJorge) |
| Dashboard | [Agusin Gallardo](https://github.com/agstudio98) |
| Métricas + Caso de Uso | [Mauricio Ferreyra](https://github.com/EmiTeck) |
| Operaciones + Diagramas | [Giuliano Batistella](https://github.com/gbatistela) |
| Huéspedes + README + Branching | [Alejo Camolotto](https://github.com/Camolotto) |

> En caso de dificultades utilizando Git por terminal, también pueden realizarse modificaciones directamente desde GitHub mediante edición web y commits manuales.

---

## Guía para el Desarrollo

- **No introducir JavaScript** para funciones resueltas por CSS.
- **Reutilizar clases existentes** (`btn-premium`, `btn-outline`, `metric-card`, `content-section`, `input-field`, etc.) antes de crear nuevas.
- **Mantener `data-label`** en las celdas `<td>` de cualquier tabla nueva para que funcione el layout responsive en mobile.
- **Seguir la misma estructura de sidebar y header** al agregar nuevas páginas, incluyendo el checkbox de control del menú mobile y el link activo en la navegación.
- **Mantener comentarios HTML en mayúsculas** con el estilo actual: `<!-- SECCIÓN DE ... -->`.
- **Respetar consistencia visual y responsive** en todos los módulos.

---

## About

Proyecto de Evidencia 1 — Sistema de administración hotelera.
Prototipo básico realizado como sitio estático responsive orientado a gestión interna.

## Contributors

| | |
|---|---|
| [@agstudio98](https://github.com/agstudio98) | Agustín Gallardo |
| [@Oscar-Quevedo](https://github.com/Oscar-Quevedo) | Oscar Quevedo |
| [@JQuevedoJorge](https://github.com/JQuevedoJorge) | Jorge Quevedo |
| [@Camolotto](https://github.com/Camolotto) | Alejo Camolotto |
| [@gbatistela](https://github.com/gbatistela) | Giuliano Batistella |
| [@EmiTeck](https://github.com/EmiTeck) | Mauricio Ferreyra |

## Languages

- HTML
- CSS
