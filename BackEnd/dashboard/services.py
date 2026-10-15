"""
Capa de Servicios de Negocio (Business Logic Services) - Principios SOLID:
- S (Single Responsibility): Cada servicio gestiona un único dominio de negocio (Reservas, Métricas, Autenticación).
- O (Open/Closed): Las reglas de negocio pueden extenderse sin modificar los controladores HTTP.
- D (Dependency Inversion): Las vistas dependen de esta capa de servicios para delegar lógica de negocio y efectos secundarios.
"""

from datetime import date
from typing import Tuple, Dict, Any, Optional, List
from django.utils import timezone
from django.db.models import Sum
from .models import (
    Usuario,
    Habitacion,
    Reserva,
    LogAuditoria
)
from .selectors import ReservaSelector, HabitacionSelector


class DisponibilidadService:
    """
    Control de disponibilidad de habitaciones (diagrama de secuencia UML B.3).
    Evita el overbooking: rechaza reservas cuyas fechas se superponen con otras activas
    cuando ya no quedan habitaciones libres del tipo solicitado.
    """

    @staticmethod
    def verificar_disponibilidad(
        tipo_habitacion: Optional[str],
        fecha_ingreso: Optional[date],
        fecha_salida: Optional[date],
        habitacion: Optional[Habitacion] = None,
        excluir_reserva_id: Optional[int] = None
    ) -> Tuple[bool, Optional[str]]:
        """
        Retorna (True, None) si hay cupo o (False, motivo) si las fechas se superponen.
        El cupo de un tipo es la cantidad de habitaciones habilitadas de ese tipo.
        """
        tipo = habitacion.tipo if habitacion else tipo_habitacion
        if not tipo or not fecha_ingreso or not fecha_salida:
            return True, None

        if habitacion is not None and not habitacion.disponible:
            return False, f"La habitación {habitacion.numero or habitacion.id} no está habilitada para reservas."

        superpuestas = ReservaSelector.reservas_superpuestas(fecha_ingreso, fecha_salida, excluir_reserva_id)

        if habitacion is not None and superpuestas.filter(habitacion=habitacion).exists():
            return False, f"La habitación {habitacion.numero or habitacion.id} ya está reservada en esas fechas."

        cupos = HabitacionSelector.filter_habitaciones(disponible=True).filter(tipo=tipo).count()
        ocupadas = superpuestas.filter(tipo_habitacion=tipo).count()
        if ocupadas >= cupos:
            return False, (
                f"No hay habitaciones '{tipo}' disponibles del {fecha_ingreso} al {fecha_salida}: "
                "las fechas se superponen con reservas existentes."
            )

        return True, None

    @classmethod
    def habitaciones_disponibles(cls, fecha_ingreso: date, fecha_salida: date) -> List[Habitacion]:
        """Habitaciones habilitadas con cupo libre durante todo el rango de fechas indicado."""
        return [
            habitacion
            for habitacion in HabitacionSelector.filter_habitaciones(disponible=True)
            if cls.verificar_disponibilidad(habitacion.tipo, fecha_ingreso, fecha_salida, habitacion=habitacion)[0]
        ]


class ReservaService:
    """Servicio que encapsula la lógica de negocio y auditoría del ciclo de vida de reservas."""

    ESTADOS_VALIDOS = ['pendiente', 'confirmada', 'cancelada']

    @staticmethod
    def crear_reserva(validated_data: Dict[str, Any]) -> Reserva:
        """Crea una reserva y genera el correspondiente log de auditoría."""
        reserva = Reserva.objects.create(**validated_data)
        LogAuditoria.objects.create(
            reserva=reserva,
            accion='Creación de Reserva',
            detalle=f"Reserva creada para {reserva.nombre} ({reserva.tipo_habitacion})"
        )
        return reserva

    @staticmethod
    def actualizar_reserva(reserva: Reserva, validated_data: Dict[str, Any], partial: bool = False) -> Reserva:
        """Actualiza los campos de una reserva y audita la operación."""
        estado_anterior = reserva.estado
        for attr, value in validated_data.items():
            setattr(reserva, attr, value)
        reserva.save()

        # Auditoría de cambio de estado o actualización general
        if 'estado' in validated_data and validated_data['estado'] != estado_anterior:
            LogAuditoria.objects.create(
                reserva=reserva,
                accion=f"Cambio de Estado a '{reserva.estado}'",
                detalle="Estado modificado desde el panel de administración."
            )
        else:
            accion = "Modificación Parcial de Reserva" if partial else "Actualización Completa de Reserva"
            LogAuditoria.objects.create(
                reserva=reserva,
                accion=accion,
                detalle=f"Reserva #{reserva.id} actualizada."
            )
        return reserva

    @classmethod
    def cambiar_estado(cls, reserva: Reserva, nuevo_estado: str) -> Tuple[bool, Optional[str]]:
        """
        Cambio rápido de estado operativo ('pendiente', 'confirmada', 'cancelada').
        Retorna (True, None) si es exitoso o (False, error_message) si falla la regla.
        """
        if not nuevo_estado or nuevo_estado not in cls.ESTADOS_VALIDOS:
            return False, f"Estado inválido. Debe ser uno de los siguientes: {', '.join(cls.ESTADOS_VALIDOS)}"

        reserva.estado = nuevo_estado
        reserva.save(update_fields=['estado'])

        LogAuditoria.objects.create(
            reserva=reserva,
            accion=f"Estado cambiado a '{nuevo_estado}'",
            detalle="Actualización rápida de estado operativo."
        )
        return True, None

    @staticmethod
    def eliminar_reserva(reserva: Reserva) -> str:
        """Elimina la reserva y registra el evento en auditoría."""
        numero_reserva = reserva.numero_reserva or str(reserva.id)
        reserva.delete()

        LogAuditoria.objects.create(
            accion='Eliminación de Reserva',
            detalle=f"Reserva #{numero_reserva} eliminada del sistema."
        )
        return numero_reserva


class DashboardMetricasService:
    """Servicio para cálculo de KPIs y métricas operativas del hostel."""

    @staticmethod
    def calcular_metricas() -> Dict[str, Any]:
        """Calcula ocupación, check-ins, cancelaciones e ingresos acumulados."""
        hoy = timezone.localdate()

        total_reservas = Reserva.objects.count()
        reservas_confirmadas = Reserva.objects.filter(estado='confirmada').count()
        reservas_canceladas = Reserva.objects.filter(estado='cancelada').count()
        reservas_pendientes = Reserva.objects.filter(estado='pendiente').count()

        # Check-ins y Check-outs de hoy
        checkins_hoy = Reserva.objects.filter(fecha_ingreso=hoy, estado='confirmada').count()
        checkouts_hoy = Reserva.objects.filter(fecha_salida=hoy, estado='confirmada').count()

        # Ratio de cancelación
        ratio_cancelacion = 0.0
        if total_reservas > 0:
            ratio_cancelacion = round((reservas_canceladas / total_reservas) * 100, 1)

        # Ingresos totales acumulados de confirmadas
        ingresos_agregados = Reserva.objects.filter(estado='confirmada').aggregate(total=Sum('precio_total'))
        ingresos_totales = float(ingresos_agregados['total'] or 0.0)

        # Capacidad y ocupación
        total_habitaciones = Habitacion.objects.count()
        camas_totales = Habitacion.objects.aggregate(capacidad_total=Sum('capacidad'))['capacidad_total'] or 24
        habitaciones_disponibles = Habitacion.objects.filter(disponible=True).count()

        # Camas ocupadas activas hoy
        reservas_activas_hoy = Reserva.objects.filter(
            estado='confirmada',
            fecha_ingreso__lte=hoy,
            fecha_salida__gte=hoy
        )
        camas_ocupadas = reservas_activas_hoy.aggregate(huespedes_totales=Sum('huespedes'))['huespedes_totales'] or 0
        porcentaje_ocupacion = round((camas_ocupadas / camas_totales * 100), 1) if camas_totales > 0 else 0.0

        return {
            'ocupacionHoy': {
                'porcentaje': porcentaje_ocupacion,
                'camasOcupadas': camas_ocupadas,
                'camasTotales': camas_totales,
                'indicador': f"▲ {camas_ocupadas}/{camas_totales} camas"
            },
            'checkinsHoy': {
                'total': checkins_hoy,
                'pendientes': reservas_pendientes,
                'indicador': f"{reservas_pendientes} pendientes"
            },
            'checkoutsHoy': {
                'total': checkouts_hoy
            },
            'ratioCancelacion': {
                'porcentaje': ratio_cancelacion,
                'indicador': '▲ riesgo' if ratio_cancelacion > 10 else '▼ bajo control'
            },
            'estadiaPromedio': {
                'dias': 3.2,
                'indicador': '▲ mejora'
            },
            'ingresosTotales': ingresos_totales,
            'totales': {
                'reservas': total_reservas,
                'confirmadas': reservas_confirmadas,
                'pendientes': reservas_pendientes,
                'canceladas': reservas_canceladas,
                'habitaciones': total_habitaciones,
                'habitacionesDisponibles': habitaciones_disponibles,
            }
        }


class AuthService:
    """Servicio de autenticación, control de intentos y auditoría de accesos."""

    MAX_INTENTOS_FALLIDOS = 3

    @classmethod
    def autenticar_usuario(cls, credential: str, password: str) -> Tuple[int, Dict[str, Any]]:
        """
        Valida las credenciales del usuario, gestiona el bloqueo de cuenta por seguridad
        y audita los accesos.
        Retorna (HTTP_STATUS_CODE, response_payload).
        """
        from .selectors import UsuarioSelector

        usuario = UsuarioSelector.get_by_credential(credential)
        if not usuario:
            return 401, {'error': 'Credenciales inválidas. Usuario no registrado.'}

        if usuario.estado_cuenta == 'Bloqueada':
            return 403, {'error': 'Esta cuenta se encuentra bloqueada por motivos de seguridad.'}

        if usuario.password != password:
            usuario.intentos_fallidos += 1
            if usuario.intentos_fallidos >= cls.MAX_INTENTOS_FALLIDOS:
                usuario.estado_cuenta = 'Bloqueada'
                usuario.fecha_bloqueo = timezone.now()
            usuario.save(update_fields=['intentos_fallidos', 'estado_cuenta', 'fecha_bloqueo'])

            intentos_restantes = max(0, cls.MAX_INTENTOS_FALLIDOS - usuario.intentos_fallidos)
            return 401, {
                'error': 'Contraseña incorrecta.',
                'intentosRestantes': intentos_restantes
            }

        # Restablecer intentos en caso de login exitoso
        if usuario.intentos_fallidos > 0:
            usuario.intentos_fallidos = 0
            usuario.save(update_fields=['intentos_fallidos'])

        LogAuditoria.objects.create(
            usuario=usuario,
            accion='Inicio de Sesión',
            detalle=f"Login exitoso en panel de {usuario.rol}."
        )

        return 200, {
            'mensaje': 'Inicio de sesión exitoso.',
            'usuario': {
                'id': str(usuario.id),
                'nombre': usuario.nombre,
                'apellido': usuario.apellido,
                'email': usuario.email,
                'rol': usuario.rol,
            }
        }
