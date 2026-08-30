# BrigadaHostel & Panel de Administracion
(Ver al ultimo, a partir de la seccion traspaso a Angular, version extendida actualizada del ReadMe para Ev. 4)

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
10. Traspaso a Angular

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

---






# Traspaso a Angular

> Esta sección documenta el estado del traspaso de la maqueta estática descrita arriba a componentes Angular. El resto del README se conserva sin modificar como registro del proyecto original; lo que sigue refleja la arquitectura actual del FrontEnd.

**Última verificación:** 29/08/2026 — Alejo Camolotto

## Estado general

Todos los módulos y pantallas fueron migrados a Angular y verificados por navegación directa en la aplicación (`ng serve` + `localhost:4200`), no solo por la existencia de archivos en el proyecto.

## Detalle por módulo

| Módulo | Ruta | Estado |
| --- | --- | --- |
| Home | `/home` | Migrado |
| Quiénes Somos | `/quienes-somos` | Migrado |
| Login | `/auth/login` | Migrado |
| Registro | `/auth/signup` | Migrado |
| Recuperar contraseña | `/auth/forgot-password` | Migrado |
| Dashboard Admin — Resumen | `/dashboard/admin/resumen` | Migrado |
| Dashboard Admin — Reservas | `/dashboard/admin/reservas` | Migrado |
| Dashboard Admin — Configuración | `/dashboard/admin/configuracion` | Migrado |
| Dashboard Usuario — Resumen | `/dashboard/usuario/resumen` | Migrado |
| Dashboard Usuario — Reservas | `/dashboard/usuario/reservas` | Migrado |
| 404 | `/404`, `/**` | Migrado |

### Submódulos embebidos en Resumen Admin

Los módulos de Huéspedes, Métricas y Operaciones (ver responsables en la sección *About & Contributors*) no tienen ruta propia: se renderizan dentro de `resumen-admin` (`/dashboard/admin/resumen`), apilados uno debajo del otro. Para verlos hay que entrar a esa ruta y hacer scroll — no existe un link de menú que lleve directo a cada uno.

| Componente | Estado | Ubicación en el código |
| --- | --- | --- |
| Módulo Huéspedes | Migrado | `resumen-admin/components/modulo-huespedes` |
| Módulo Métricas | Migrado | `resumen-admin/components/modulo-metricas` |
| Módulo Operaciones | Migrado | `resumen-admin/components/modulo-operaciones` |

## Cómo verificar un componente correctamente

Un error común es abrir el archivo `.component.html` directamente en el navegador (`file:///...`). Esto **no funciona**: el archivo es un template de Angular, no una página HTML autónoma — no carga estilos ni resuelve bindings, y se ve como texto plano sin formato.


**Forma correcta:**

1. Instalar dependencias una vez por máquina (no se sube al repo): `npm install` dentro de `FrontEnd`.
2. Levantar el servidor de desarrollo: `ng serve` dentro de `FrontEnd`.
3. Abrir `http://localhost:4200` en el navegador.
4. Navegar por la app (menú, links) hasta la pantalla en cuestión — nunca abrir el `.html` suelto.
5. Si el componente es un submódulo embebido (ver tabla arriba), puede requerir scroll dentro de la vista padre en vez de tener una URL propia.

   ### Datos Técnicos y Arquitectura                                        
                                                                             
    * **Framework:** Angular 21 (v21.2.x) con arquitectura de **Standalone   
  Components** (`standalone: true`).                                         
    * **Enrutamiento:** Angular Router (`provideRouter`) con soporte para    
  **Lazy Loading** (`loadComponent`), rutas anidadas (`children`),           
  redirecciones por defecto y títulos dinámicos por página (`title`).        
    * **Estado y Reactividad:** RxJS y servicios inyectables                 
  (`DashboardService`) para el control de roles (Admin / Usuario) y estado   
  global de la sesión.                                                       
    * **Tipado:** TypeScript 5.9+ con interfaces y tipos estrictos para      
  modelos de datos (`AdminReservation`, `UserRole`, etc.).                   
                                                                             
                                                                             
  ### Estilos Utilizados y Sistema de Diseño                               
                                                                             
    El proyecto combina lo mejor de dos mundos para lograr máxima fidelidad  
  visual y rendimiento:                                                      
                                                                             
    1. **Bootstrap 5.3.3:**                                                  
       * Utilizado principalmente en las vistas institucionales (**Home** y  
  **Quiénes Somos**) para garantizar que mantengan la estructura, espaciados 
  y jerarquía de la maqueta original.                                        
       * Provee utilidades de grilla (`container`, `row`, `col-*`),          
  alineaciones flexbox y tablas base.                                        
    2. **Sistema de Diseño Propio (CSS3 Puro + Variables CSS):**             
       * Definido en `src/styles.css` con variables CSS centralizadas (`--bg-
  sidebar: #0f172a`, `--primary: #1e293b`, `--success: #10b981`, etc.).      
       * Tipografía global **Quicksand** (Google Fonts).                     
       * Componentes avanzados: panel lateral deslizable (*Side Drawer*),    
  modales con desenfoque de fondo (*backdrop-filter: blur*), notificaciones  
  tipo *Toast* flotantes, insignias de estado (*badges*) y tarjetas con      
  elevación sutil.                                                           
    3. **Diseño 100% Responsivo (Mobile-First & Media Queries):**            
       * **Móviles (<= 480px / 768px):** El sidebar colapsa en un menú       
  lateral tipo drawer (`aside.open`), las tablas de datos se transforman     
  automáticamente en tarjetas legibles y los formularios se adaptan a una    
  sola columna.                                                              
       * **Tablets y Laptops (<= 992px / 1200px):** Reordenamiento automático
  de grillas de métricas de 4 a 2 columnas.                                  
                                                                             
                                                                   
                                                                             
  ### Formularios Reactivos (`ReactiveFormsModule`)                        
                                                                             
    Todos los formularios de captura y edición de datos fueron construidos   
  utilizando **Formularios Reactivos** (`FormBuilder`, `FormGroup`,          
  `FormControl`), garantizando un manejo robusto de errores, inmutabilidad y 
  separación lógica:                                                         
                                                                             
    * **Módulos implementados:** Login, Registro (`Signup`), Recuperar       
  Contraseña (`ForgotPassword`) y Configuración del Administrador (Perfil,   
  Seguridad y Preferencias).                                                 
    * **Validadores Personalizados (`custom-validators.ts`):**               
      * `noWhitespaceValidator()`: Impide que los campos requeridos se       
  completen únicamente con espacios en blanco.                               
      * `customEmailValidator()`: Expresión regular estricta para validar    
  correos electrónicos con formato real (`usuario@dominio.com`).             
      * `dniValidator()`: Validación de formato numérico de DNI de 7 a 8     
  dígitos.                                                                   
      * `passwordStrengthValidator()`: Exige que la contraseña tenga un      
  mínimo de 6 caracteres, combinando obligatoriamente letras y números.      
      * `passwordMatchValidator(pass, confirmPass)`: Validador cruzado       
  (*cross-field validator*) a nivel de formulario para garantizar la         
  coincidencia entre la contraseña y su confirmación.                        
    * **Feedback Visual e Interactivo:** Los mensajes de error se muestran de
  forma dinámica cuando el usuario interactúa con el campo (`.touched` / `.  
  invalid`), activándose además la validación total al presionar enviar      
  (`markAllAsTouched()`).                                                    
                                                                             

                                                                             
  ### Gestión de Ruta 404 (Página No Encontrada)                           
                                                                             
    * **Enrutamiento:** Cuenta con una ruta explícita `/404` y una captura de
  comodín `path: '**'` que intercepta cualquier URL inválida o inexistente.  
    * **Componente `NotFoundComponent`:**                                    
      * Vista estilizada con mensaje amigable de extravío.                   
      * Botón interactivo para **Regresar Atrás** utilizando el historial del
  navegador (`Location.back()`).                                             
      * Botón de **Ir al Inicio** (`/home`).                                 
      * Enlaces rápidos hacia las secciones clave de la plataforma (*Quiénes 
  Somos*, *Acceso al Panel*, *Dashboard Admin* y *Portal Huésped*).          
    * **Acceso de prueba:** En la barra de navegación superior de *Home* y   
  *Quiénes Somos* se incluyó un enlace directo **"Test 404"** para comprobar 
  y auditar rápidamente el funcionamiento del interceptor.                   





   ## Diagrama Entidad-Relación (DER)                                       
                                                                             
    El **Diagrama Entidad-Relación (DER)** modela la capa conceptual de datos
  del sistema **Brigada Hostel**, dando soporte integral a los casos de uso  
  principales: autenticación y control de acceso por roles, gestión del      
  catálogo de habitaciones, creación y administración del ciclo de vida de   
  reservas, contratación de servicios adicionales, auditoría de operaciones  
  administrativas y envío de notificaciones al cliente.                      
                                                                             
    > **Archivo original:** Puedes consultar el diagrama gráfico en          
  `Docs/Diagrama Entidad-Relación (DER)/DER_BrigadaHostel.png`.              
                                                                             
    ### Diagrama Conceptual (Mermaid)                                        
                                                                             
    ```mermaid                                                               
    erDiagram                                                                
        USUARIO ||--o{ RESERVA : "realiza (1:N)"                             
        USUARIO ||--o{ LOG_AUDITORIA : "genera (1:N)"                        
        USUARIO ||--o{ NOTIFICACION : "recibe (1:N)"                         
                                                                             
        HABITACION ||--o{ RESERVA : "corresponde_a (1:N)"                    
                                                                             
        RESERVA ||--|{ RESERVA_SERVICIO : "incluye (1:N)"                    
        SERVICIO ||--o{ RESERVA_SERVICIO : "incluido_en (1:N)"               
                                                                             
        RESERVA ||--o{ LOG_AUDITORIA : "queda_registrada (1:N)"              
        RESERVA ||--o{ NOTIFICACION : "origina (1:N)"                        
                                                                             
        USUARIO {                                                            
            int id_usuario PK                                                
            string nombre                                                    
            string apellido                                                  
            string email UK                                                  
            string contrasena_hash                                           
            enum rol                                                         
            enum estado_cuenta                                               
            int intentos_fallidos                                            
            datetime fecha_bloqueo                                           
        }                                                                    
                                                                             
        HABITACION {                                                         
            int id_habitacion PK                                             
            string numero UK                                                 
            string tipo                                                      
            int capacidad                                                    
            decimal precio_noche                                             
            string estado                                                    
        }                                                                    
                                                                             
        RESERVA {                                                            
            int id_reserva PK                                                
            string numero_reserva UK                                         
            int id_usuario FK                                                
            int id_habitacion FK                                             
            date fecha_checkin                                               
            date fecha_checkout                                              
            datetime fecha_creacion                                          
            string estado                                                    
            decimal monto_total                                              
        }                                                                    
                                                                             
        SERVICIO {                                                           
            int id_servicio PK                                               
            string nombre                                                    
            string descripcion                                               
            decimal costo                                                    
        }                                                                    
                                                                             
        RESERVA_SERVICIO {                                                   
            int id_reserva PK,FK                                             
            int id_servicio PK,FK                                            
            int cantidad                                                     
            decimal subtotal                                                 
        }                                                                    
                                                                             
        LOG_AUDITORIA {                                                      
            int id_log PK                                                    
            int id_usuario FK                                                
            int id_reserva FK                                                
            string accion                                                    
            datetime fecha_hora                                              
            string detalle                                                   
        }                                                                    
                                                                             
        NOTIFICACION {                                                       
            int id_notificacion PK                                           
            int id_reserva FK                                                
            int id_usuario FK                                                
            string tipo                                                      
            datetime fecha_envio                                             
            string estado_envio                                              
        }                                                                    

  
  
  ### Entidades y Cardinalidades del DER
                                                                            
  • REALIZA (USUARIO — RESERVA) | Cardinalidad: 1 : N                        
  Un Cliente puede realizar múltiples reservas a lo largo del tiempo; cada   
  reserva pertenece a un único Cliente.
  
  • CORRESPONDE A (HABITACION — RESERVA) | Cardinalidad: 1 : N               
  Una habitación puede integrar múltiples reservas en distintos períodos de  
  fechas; cada reserva corresponde a una única habitación asignada.
  
  • INCLUYE (RESERVA — SERVICIO) | Cardinalidad: N : M
  Una reserva puede incluir varios servicios adicionales y un mismo servicio 
  puede figurar en múltiples reservas. Esta relación de muchos a muchos se   
  resuelve mediante la entidad asociativa RESERVA_SERVICIO (con clave        
  compuesta id_reserva e id_servicio).
  
  • GENERA (USUARIO — LOG_AUDITORIA) | Cardinalidad: 1 : N
  Cada acción administrativa queda registrada en el historial junto con el   
  usuario (habitualmente Administrador) que la ejecutó.
  
  • QUEDA REGISTRADA (RESERVA — LOG_AUDITORIA) | Cardinalidad: 1 : N         
  Una reserva puede acumular múltiples registros de auditoría a lo largo de  
  su ciclo de vida (creación, modificaciones, cancelaciones, check-in).
  
  • RECIBE (USUARIO — NOTIFICACION) | Cardinalidad: 1 : N
  El cliente puede recibir múltiples avisos y notificaciones automáticas por 
  correo electrónico ante confirmaciones, cambios de estado o cancelaciones.
  
  • ORIGINA (RESERVA — NOTIFICACION) | Cardinalidad: 1 : N
  Cada reserva puede originar diversas notificaciones vinculadas a las       
  modificaciones de su estado operativo.

                                                                                                                       
  ## Modelo Relacional (MR)                                                  
                                                                             
  El Modelo Relacional (MR) traduce el modelo conceptual a un esquema físico 
  normalizado de 7 tablas relacionales, definiendo tipos de datos,           
  restricciones de unicidad (UNIQUE), claves primarias (PK) y claves foráneas
  (FK), preparado para motores SQL (MySQL / PostgreSQL / MariaDB).           
                                                                             
  │ Archivo original: Puedes consultar el diagrama relacional en Docs/Modelo 
  │ Relacional (MR)/MR_BrigadaHostel.png.                                    
                                                        
  ### Diccionario de Datos / Estructura de Tablas                            
                                                                             
  #### 1. Tabla: USUARIO                                                     
                                                                             
  Almacena las credenciales, roles y políticas de seguridad y bloqueo de     
  cuentas.                                                                   
                                                                                                                                      
  #### 2. Tabla: HABITACION                                                  
                                                                             
  Catálogo de unidades de hospedaje del establecimiento.                     
                                                                                                                                      
  #### 3. Tabla: RESERVA                                                     
                                                                             
  Registro central de transacciones y hospedajes del sistema.                
                                                    
  #### 4. Tabla: SERVICIO                                                    
                                                                             
  Catálogo de amenidades y servicios extras disponibles.                     
                                                                                                                                     
  #### 5. Tabla: RESERVA_SERVICIO (Tabla Intermedia N:M)                     
                                                                             
  Resuelve la relación muchos a muchos entre reservas y servicios            
  contratados.                                                               
                                     
  #### 6. Tabla: LOG_AUDITORIA                                               
                                                                             
  Registro inmutable de trazabilidad y auditoría administrativa.             

  #### 7. Tabla: NOTIFICACION                                                
                                                                             
  Historial de comunicaciones y avisos emitidos hacia los clientes.          
                                                                             

  ### Trazabilidad con Casos de Uso e Historias de Usuario
  
  • HU01 / HU02 / FA-01 (Inicio de Sesión y Bloqueo de Cuenta): Mapeado en   
  USUARIO mediante rol, estado_cuenta, intentos_fallidos y fecha_bloqueo.    
  
  • HU03 / FA-02 (Recuperación de Contraseña): Mapeado en NOTIFICACION (tipo 
  = 'Recuperación de contraseña').
  
  • HU04 (Verificar Disponibilidad y Calcular Estadía): Resuelto mediante la 
  combinación de HABITACION y RESERVA.
  
  • HU05 / FA-04 (Contratación de Servicios Extras): Mapeado en SERVICIO y la
  tabla asociativa RESERVA_SERVICIO.
  
  • HU06 (Cancelación de Reserva por el Cliente): Actualiza RESERVA.estado = 
  'Cancelada' y registra en NOTIFICACION.
  
  • HU07 (Gestión Administrativa, Check-in y Auditoría): Interactúa sobre    
  RESERVA, persistiendo cada cambio en LOG_AUDITORIA y disparando avisos en  
  NOTIFICACION.



## Roles para este avance

| Área                           | Responsable         |
| ------------------------------ | ------------------- |
| Inicio / Home                  | Oscar Quevedo       |
| Sobre Nosotros                 | Jorge Quevedo       |
| Dashboard + README             | Agustín Gallardo    |
| Métricas/Operaciones + DER/MR  | Mauricio Ferreyra   |
| Huéspedes + README             | Alejo Camolotto     |

## Contributors

* @agstudio98 — Agustín Gallardo
* @Oscar-Quevedo — Oscar Quevedo
* @JQuevedoJorge — Jorge Quevedo
* @Camolotto — Alejo Camolotto
* @EmiTeck — Mauricio Ferreyra

  ## Tecnologías Utilizadas                                                
                                                                             
    * **HTML5:** Semántica web moderna y accesible.                          
    * **CSS3:** Sistema de diseño personalizado, variables CSS (CSS Custom   
  Properties), efectos *glassmorphism* y diseño 100% responsivo vía Media    
  Queries.                                                                   
    * **Bootstrap 5.3.3:** Maquetado responsivo, utilidades y grilla para las
  secciones institucionales.
    * **Angular 21 (v21.2.x):** Framework SPA basado en arquitectura de      
  *Standalone Components*, *Lazy Loading* y *Reactive Forms*.
    * **Angular CLI (v21.2.12):** Herramienta de línea de comandos para      
  scaffolding, compilación y empaquetado.
    * **TypeScript (~5.9.2):** Lenguaje tipado estricto para modelos,        
  interfaces y lógica de negocio.
    * **RxJS (~7.8.0):** Programación reactiva para la gestión de estados y  
  flujos asíncronos.
    * **Vitest (v4.0.8):** Test runner ultrarrápido para pruebas unitarias.  
    * **Prettier (v3.8.1):** Formateador de código consistente para el equipo.
    * **Git:** Sistema de control de versiones distribuido.
    * **GitHub:** Alojamiento de repositorio, control de ramas e integración 
  colaborativa.
    * **Mermaid.js:** Diagramado interactivo de entidades, relaciones y      
  arquitectura conceptual.

                                                  
