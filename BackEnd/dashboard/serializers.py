from rest_framework import serializers
from .models import Usuario, Habitacion, Servicio, Reserva, ReservaServicio, LogAuditoria, Notificacion, Integrante


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = [
            'id',
            'nombre',
            'apellido',
            'email',
            'password',
            'rol',
            'estado_cuenta',
            'intentos_fallidos',
            'fecha_bloqueo',
            'fecha_creacion',
        ]
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Exponer también password sólo si se requiere en mocks simples o tests
        return data


class HabitacionSerializer(serializers.ModelSerializer):
    precioPorNoche = serializers.DecimalField(
        source='precio_noche',
        max_digits=10,
        decimal_places=2,
        required=False
    )

    class Meta:
        model = Habitacion
        fields = [
            'id',
            'numero',
            'tipo',
            'precio_noche',
            'precioPorNoche',
            'capacidad',
            'disponible',
            'estado',
            'descripcion',
        ]

    def to_internal_value(self, data):
        # Soporte para camelCase desde Angular ('precioPorNoche' -> 'precio_noche')
        data = data.copy()
        if 'precioPorNoche' in data and 'precio_noche' not in data:
            data['precio_noche'] = data['precioPorNoche']
        return super().to_internal_value(data)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['id'] = str(data['id'])
        # Asegurar formato compatible con frontend
        data['precioPorNoche'] = float(instance.precio_noche)
        return data


class ServicioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Servicio
        fields = ['id', 'nombre', 'descripcion', 'costo']


class ReservaSerializer(serializers.ModelSerializer):
    fechaIngreso = serializers.DateField(source='fecha_ingreso', required=False)
    fechaSalida = serializers.DateField(source='fecha_salida', required=False)
    tipoHabitacion = serializers.CharField(source='tipo_habitacion', required=False)
    serviciosExtra = serializers.ListField(
        child=serializers.CharField(),
        source='servicios_extra',
        required=False
    )
    precioTotal = serializers.DecimalField(
        source='precio_total',
        max_digits=10,
        decimal_places=2,
        required=False
    )
    fechaCreacion = serializers.DateTimeField(
        source='fecha_creacion',
        read_only=True
    )

    class Meta:
        model = Reserva
        fields = [
            'id',
            'numero_reserva',
            'usuario',
            'habitacion',
            'nombre',
            'email',
            'dni',
            'telefono',
            'tipo_habitacion',
            'tipoHabitacion',
            'fecha_ingreso',
            'fechaIngreso',
            'fecha_salida',
            'fechaSalida',
            'huespedes',
            'precio_total',
            'precioTotal',
            'servicios_extra',
            'serviciosExtra',
            'estado',
            'notas',
            'fecha_creacion',
            'fechaCreacion',
        ]
        read_only_fields = ['id', 'numero_reserva', 'fecha_creacion', 'fechaCreacion']

    def to_internal_value(self, data):
        data = data.copy() if hasattr(data, 'copy') else dict(data)

        # Mapeo de compatibilidad camelCase (Angular) -> snake_case (Django Model)
        if 'fechaIngreso' in data and 'fecha_ingreso' not in data:
            data['fecha_ingreso'] = data['fechaIngreso']
        if 'fechaSalida' in data and 'fecha_salida' not in data:
            data['fecha_salida'] = data['fechaSalida']
        if 'tipoHabitacion' in data and 'tipo_habitacion' not in data:
            data['tipo_habitacion'] = data['tipoHabitacion']
        if 'serviciosExtra' in data and 'servicios_extra' not in data:
            data['servicios_extra'] = data['serviciosExtra']
        if 'precioTotal' in data and 'precio_total' not in data:
            data['precio_total'] = data['precioTotal']

        return super().to_internal_value(data)

    def validate(self, attrs):
        # Validación de coherencia de fechas
        fecha_ingreso = attrs.get('fecha_ingreso')
        fecha_salida = attrs.get('fecha_salida')

        if self.instance:
            fecha_ingreso = fecha_ingreso or self.instance.fecha_ingreso
            fecha_salida = fecha_salida or self.instance.fecha_salida

        if fecha_ingreso and fecha_salida and fecha_salida <= fecha_ingreso:
            raise serializers.ValidationError({
                'fechaSalida': 'La fecha de check-out debe ser estrictamente posterior a la fecha de check-in.'
            })

        return attrs

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['id'] = str(data['id'])
        data['precioTotal'] = float(instance.precio_total)
        data['fechaIngreso'] = str(instance.fecha_ingreso)
        data['fechaSalida'] = str(instance.fecha_salida)
        data['tipoHabitacion'] = instance.tipo_habitacion
        data['serviciosExtra'] = instance.servicios_extra or []
        data['fechaCreacion'] = instance.fecha_creacion.strftime('%Y-%m-%d')
        return data


class IntegranteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Integrante
        fields = ['id', 'nombre', 'apellido', 'responsabilidad', 'dni', 'github']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['id'] = str(data['id'])
        return data


class LogAuditoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = LogAuditoria
        fields = ['id', 'usuario', 'reserva', 'accion', 'fecha_hora', 'detalle']


class NotificacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notificacion
        fields = ['id', 'reserva', 'usuario', 'tipo', 'fecha_envio', 'estado_envio']
