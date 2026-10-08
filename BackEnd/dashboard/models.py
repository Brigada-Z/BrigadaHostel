from django.db import models


class Usuario(models.Model):
    ROLES = [
        ('admin', 'Administrador'),
        ('usuario', 'Huésped/Cliente'),
    ]

    ESTADOS_CUENTA = [
        ('Activa', 'Activa'),
        ('Bloqueada', 'Bloqueada'),
    ]

    nombre = models.CharField(max_length=60)
    apellido = models.CharField(max_length=60, blank=True, default='')
    email = models.EmailField(max_length=120, unique=True)
    password = models.CharField(max_length=255)
    rol = models.CharField(max_length=20, choices=ROLES, default='usuario')
    estado_cuenta = models.CharField(max_length=20, choices=ESTADOS_CUENTA, default='Activa')
    intentos_fallidos = models.IntegerField(default=0)
    fecha_bloqueo = models.DateTimeField(null=True, blank=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'usuarios'
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'

    def __str__(self):
        return f"{self.nombre} {self.apellido} ({self.email}) - {self.rol}"


class Habitacion(models.Model):
    ESTADOS = [
        ('Disponible', 'Disponible'),
        ('Ocupada', 'Ocupada'),
        ('Mantenimiento', 'Mantenimiento'),
    ]

    numero = models.CharField(max_length=10, unique=True, null=True, blank=True)
    tipo = models.CharField(max_length=50)
    precio_noche = models.DecimalField(max_digits=10, decimal_places=2)
    capacidad = models.IntegerField(default=1)
    disponible = models.BooleanField(default=True)
    estado = models.CharField(max_length=20, choices=ESTADOS, default='Disponible')
    descripcion = models.TextField(blank=True, default='')

    class Meta:
        db_table = 'habitaciones'
        verbose_name = 'Habitación'
        verbose_name_plural = 'Habitaciones'

    def __str__(self):
        return f"{self.tipo} (#{self.numero or self.id}) - ${self.precio_noche}/noche"


class Servicio(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True, default='')
    costo = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    class Meta:
        db_table = 'servicios'
        verbose_name = 'Servicio'
        verbose_name_plural = 'Servicios'

    def __str__(self):
        return f"{self.nombre} (${self.costo})"


class Reserva(models.Model):
    ESTADOS_RESERVA = [
        ('pendiente', 'Pendiente'),
        ('confirmada', 'Confirmada'),
        ('cancelada', 'Cancelada'),
    ]

    numero_reserva = models.CharField(max_length=30, unique=True, blank=True)
    usuario = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True, blank=True, related_name='reservas')
    habitacion = models.ForeignKey(Habitacion, on_delete=models.SET_NULL, null=True, blank=True, related_name='reservas')
    nombre = models.CharField(max_length=120)
    email = models.EmailField(max_length=120)
    dni = models.CharField(max_length=20, blank=True, default='')
    telefono = models.CharField(max_length=30, blank=True, default='')
    tipo_habitacion = models.CharField(max_length=50)
    fecha_ingreso = models.DateField()
    fecha_salida = models.DateField()
    huespedes = models.IntegerField(default=1)
    precio_total = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    servicios_extra = models.JSONField(default=list, blank=True)
    estado = models.CharField(max_length=20, choices=ESTADOS_RESERVA, default='pendiente')
    notas = models.TextField(blank=True, default='')
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'reservas'
        verbose_name = 'Reserva'
        verbose_name_plural = 'Reservas'
        ordering = ['-fecha_creacion']

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super().save(*args, **kwargs)
        if is_new and not self.numero_reserva:
            self.numero_reserva = f"BH-{self.id}"
            super().save(update_fields=['numero_reserva'])

    def __str__(self):
        return f"Reserva #{self.numero_reserva or self.id} - {self.nombre} ({self.estado})"


class ReservaServicio(models.Model):
    reserva = models.ForeignKey(Reserva, on_delete=models.CASCADE, related_name='servicios_detalle')
    servicio = models.ForeignKey(Servicio, on_delete=models.CASCADE, related_name='reservas_detalle')
    cantidad = models.IntegerField(default=1)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    class Meta:
        db_table = 'reserva_servicios'
        verbose_name = 'Servicio de Reserva'
        verbose_name_plural = 'Servicios de Reservas'

    def __str__(self):
        return f"{self.servicio.nombre} x {self.cantidad} en {self.reserva}"


class LogAuditoria(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True, blank=True, related_name='logs')
    reserva = models.ForeignKey(Reserva, on_delete=models.SET_NULL, null=True, blank=True, related_name='logs')
    accion = models.CharField(max_length=60)
    fecha_hora = models.DateTimeField(auto_now_add=True)
    detalle = models.TextField(blank=True, default='')

    class Meta:
        db_table = 'logs_auditoria'
        verbose_name = 'Log de Auditoría'
        verbose_name_plural = 'Logs de Auditoría'

    def __str__(self):
        return f"[{self.fecha_hora}] {self.accion} - {self.usuario}"


class Notificacion(models.Model):
    reserva = models.ForeignKey(Reserva, on_delete=models.CASCADE, null=True, blank=True, related_name='notificaciones')
    usuario = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True, blank=True, related_name='notificaciones')
    tipo = models.CharField(max_length=50)
    fecha_envio = models.DateTimeField(auto_now_add=True)
    estado_envio = models.CharField(max_length=20, default='Enviado')

    class Meta:
        db_table = 'notificaciones'
        verbose_name = 'Notificación'
        verbose_name_plural = 'Notificaciones'

    def __str__(self):
        return f"Notificación: {self.tipo} para {self.usuario}"


class Integrante(models.Model):
    nombre = models.CharField(max_length=60)
    apellido = models.CharField(max_length=60)
    responsabilidad = models.CharField(max_length=120, blank=True, default='')
    dni = models.CharField(max_length=20, blank=True, default='')
    github = models.CharField(max_length=150, blank=True, default='')

    class Meta:
        db_table = 'integrantes'
        verbose_name = 'Integrante'
        verbose_name_plural = 'Integrantes'

    def __str__(self):
        return f"{self.nombre} {self.apellido}"
