"""
Capa de Selectores (Query Selectors) - Principio de Responsabilidad Única (SRP).
Centraliza todas las consultas y filtros a la base de datos, desacoplando
la capa de datos de las vistas y servicios.
"""

from typing import Optional
from django.db.models import QuerySet, Q
from .models import (
    Usuario,
    Habitacion,
    Servicio,
    Reserva,
    Integrante
)


class ReservaSelector:
    """Selector para operaciones de consulta y filtrado sobre el modelo Reserva."""

    @staticmethod
    def get_all() -> QuerySet[Reserva]:
        return Reserva.objects.all()

    @staticmethod
    def get_by_id(pk: int | str) -> Optional[Reserva]:
        try:
            return Reserva.objects.get(pk=pk)
        except (Reserva.DoesNotExist, ValueError):
            return None

    @staticmethod
    def filter_reservas(
        estado: Optional[str] = None,
        tipo_habitacion: Optional[str] = None,
        search: Optional[str] = None
    ) -> QuerySet[Reserva]:
        queryset = Reserva.objects.all()

        if estado:
            queryset = queryset.filter(estado=estado)

        if tipo_habitacion:
            queryset = queryset.filter(tipo_habitacion=tipo_habitacion)

        if search:
            queryset = queryset.filter(
                Q(nombre__icontains=search) |
                Q(email__icontains=search) |
                Q(dni__icontains=search) |
                Q(numero_reserva__icontains=search)
            )

        return queryset


class HabitacionSelector:
    """Selector para consultas de inventario de habitaciones."""

    @staticmethod
    def get_all() -> QuerySet[Habitacion]:
        return Habitacion.objects.all()

    @staticmethod
    def get_by_id(pk: int | str) -> Optional[Habitacion]:
        try:
            return Habitacion.objects.get(pk=pk)
        except (Habitacion.DoesNotExist, ValueError):
            return None

    @staticmethod
    def filter_habitaciones(disponible: Optional[bool] = None) -> QuerySet[Habitacion]:
        queryset = Habitacion.objects.all()
        if disponible is not None:
            queryset = queryset.filter(disponible=disponible)
        return queryset


class UsuarioSelector:
    """Selector para consultas sobre usuarios y credenciales."""

    @staticmethod
    def get_all() -> QuerySet[Usuario]:
        return Usuario.objects.all()

    @staticmethod
    def get_by_id(pk: int | str) -> Optional[Usuario]:
        try:
            return Usuario.objects.get(pk=pk)
        except (Usuario.DoesNotExist, ValueError):
            return None

    @staticmethod
    def get_by_credential(credential: str) -> Optional[Usuario]:
        try:
            return Usuario.objects.get(
                Q(email__iexact=credential) | Q(nombre__iexact=credential)
            )
        except Usuario.DoesNotExist:
            return None


class ServicioSelector:
    """Selector para servicios adicionales."""

    @staticmethod
    def get_all() -> QuerySet[Servicio]:
        return Servicio.objects.all()


class IntegranteSelector:
    """Selector para el equipo del proyecto e integrantes."""

    @staticmethod
    def get_all() -> QuerySet[Integrante]:
        return Integrante.objects.all()
