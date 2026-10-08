from django.contrib import admin
from .models import (
    Usuario,
    Habitacion,
    Servicio,
    Reserva,
    ReservaServicio,
    LogAuditoria,
    Notificacion,
    Integrante
)


@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    list_display = ('id', 'nombre', 'apellido', 'email', 'rol', 'estado_cuenta', 'fecha_creacion')
    list_filter = ('rol', 'estado_cuenta')
    search_fields = ('nombre', 'apellido', 'email')


@admin.register(Habitacion)
class HabitacionAdmin(admin.ModelAdmin):
    list_display = ('id', 'numero', 'tipo', 'precio_noche', 'capacidad', 'disponible', 'estado')
    list_filter = ('tipo', 'disponible', 'estado')
    search_fields = ('numero', 'tipo')


@admin.register(Servicio)
class ServicioAdmin(admin.ModelAdmin):
    list_display = ('id', 'nombre', 'costo')
    search_fields = ('nombre',)


class ReservaServicioInline(admin.TabularInline):
    model = ReservaServicio
    extra = 1


@admin.register(Reserva)
class ReservaAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'numero_reserva',
        'nombre',
        'email',
        'tipo_habitacion',
        'fecha_ingreso',
        'fecha_salida',
        'precio_total',
        'estado',
        'fecha_creacion'
    )
    list_filter = ('estado', 'tipo_habitacion')
    search_fields = ('nombre', 'email', 'dni', 'numero_reserva')
    inlines = [ReservaServicioInline]


@admin.register(LogAuditoria)
class LogAuditoriaAdmin(admin.ModelAdmin):
    list_display = ('id', 'usuario', 'accion', 'fecha_hora', 'detalle')
    list_filter = ('accion', 'fecha_hora')
    search_fields = ('accion', 'detalle')


@admin.register(Notificacion)
class NotificacionAdmin(admin.ModelAdmin):
    list_display = ('id', 'usuario', 'tipo', 'estado_envio', 'fecha_envio')
    list_filter = ('tipo', 'estado_envio')


@admin.register(Integrante)
class IntegranteAdmin(admin.ModelAdmin):
    list_display = ('id', 'nombre', 'apellido', 'responsabilidad', 'dni')
    search_fields = ('nombre', 'apellido', 'dni')
