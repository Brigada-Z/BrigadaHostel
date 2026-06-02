# Panel de Administración — BrigadaHostel (Maqueta)

> Interfaz interna de gestión operativa para el sistema de administración de BrigadaHostel. Diseñada con foco en usabilidad, rendimiento y mantenibilidad a largo plazo.

---

## Índice

1. [Descripción General](#descripción-general)
2. [Acceso y Autenticación](#acceso-y-autenticación)
3. [Módulos del Panel](#módulos-del-panel)
   - [Dashboard — Resumen General](#dashboard--resumen-general)
   - [Reservas — Flujo de Registro y Gestión](#reservas--flujo-de-registro-y-gestión)
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
Formulario de alta de nuevo usuario administrativo con los campos: nombre, apellido, email y contraseña. Al completarse, redirige al login.

---

## Módulos del Panel

### Dashboard — Resumen General

Es la pantalla principal luego de autenticarse. Está orientada a brindar una visión rápida del rendimiento comercial y operativo del hostel. Incluye un **selector de roles** en el encabezado para alternar entre la vista de **Administrador** y **Recepcionista**.

**Métricas principales (operativas):**

| Métrica | Valor de ejemplo | Indicador | Rol |
|---|---|---|---|
| Ocupación Hoy | 85% | 18/24 Camas | Todos |
| Check-ins Hoy | 6 | 2 Pendientes | Todos |
| Ratio de Cancelación | 4.2% | ▲ riesgo | Admin |
| Estadía Promedio | 3.2 noches | ▲ 0.5 noches | Admin |

**Gráficos y análisis detallados:**
- **Estado de Habitaciones** — Distribución visual: Ocupadas (18), Limpias (4), Sucias (2).
- **Ingresos Semanales** — Gráfico de barras con la evolución diaria (solo Admin).
- **Últimos Movimientos** — Registro de actividad reciente (Check-ins, Check-outs, Reservas).

---

### Reservas — Flujo de Registro y Gestión

Módulo orientado tanto a la creación como al mantenimiento de estadías.

**Registro de Nueva Reserva:**
El proceso sigue un flujo lógico de 4 pasos:
1. **Selección de Fechas** — Entrada y salida para verificar disponibilidad.
2. **Tipo de Habitación** — Selección entre Dormitorio Compartido ($20) o Habitación Privada ($55).
3. **Servicios y Resumen** — Selección de extras (Desayuno, Traslado) y desglose de costos.
4. **Confirmación** — Éxito del registro y código de reserva.

**Gestión de Reservas Existentes:**
Permite buscar por DNI o código para realizar:
- **Actualización de datos** del huésped o fechas.
- **Confirmación de Check-in** (modal de confirmación).
- **Cancelación** de la reserva.

---

### Recepción — Operatividad Diaria

Módulo orientado al trabajo operativo del mostrador y gestión diaria de huéspedes. Combina métricas operativas en tiempo real con herramientas administrativas.

---

### Huéspedes — Análisis de Huéspedes

Permite comprender el perfil y comportamiento de los visitantes mediante datos demográficos y patrones de estadía.

---

### Operaciones — Operaciones y Eficiencia

Muestra el estado operativo interno del hostel y permite monitorear el rendimiento diario del personal y los recursos.

---

### Métricas — Métricas Financieras y Operativas

Panel financiero y operativo del hostel con indicadores clave de rendimiento (RevPAR, ADR, Ocupación segmentada).

---

### Configuración — Ajustes del Sistema

Módulo de personalización de la cuenta y el entorno del administrador.

---

## Navegación y Estructura Compartida

Todas las páginas del panel comparten los mismos componentes reutilizables:

- **Sidebar** — Logo, navegación principal, Cerrar Sesión y Volver al sitio web.
- **Header** — Título actual, subtítulo, selector de rol y avatar.
- **Botón hamburguesa** — Visible únicamente en dispositivos móviles.

El enlace activo en la barra lateral utiliza la clase `active`.

---

## Aspectos Técnicos

### Selector de Roles (CSS Only)
El sistema implementa un toggle de roles mediante un checkbox oculto (`#role-toggle`). El uso de selectores CSS como `:checked ~ aside` permite ocultar dinámicamente secciones exclusivas para administradores (clase `.admin-only`) sin requerir JavaScript.

---

## About

Proyecto de Evidencia 1 — Sistema de administración hotelera.
Prototipo básico realizado como sitio estático responsive orientado a gestión interna.
