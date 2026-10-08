"""
Vistas de la API REST (Django REST Framework) - Arquitectura Limpia y Principios SOLID:
- S (Single Responsibility): Los controladores HTTP solo se encargan del protocolo HTTP, validación y status codes.
- D (Dependency Inversion): La lógica de negocio y las consultas se delegan a la capa de Servicios y Selectores.
- Códigos HTTP explícitos: 200 OK, 201 CREATED, 204 NO CONTENT, 400 BAD REQUEST, 401 UNAUTHORIZED, 404 NOT FOUND.
"""

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .serializers import (
    UsuarioSerializer,
    HabitacionSerializer,
    ServicioSerializer,
    ReservaSerializer,
    IntegranteSerializer
)
from .selectors import (
    ReservaSelector,
    HabitacionSelector,
    UsuarioSelector,
    ServicioSelector,
    IntegranteSelector
)
from .services import (
    ReservaService,
    DashboardMetricasService,
    AuthService
)


# ==============================================================================
# VISTA RAÍZ DEL SERVICIO API (GET / y GET /api/)
# ==============================================================================

class APIRootView(APIView):
    """Índice y explorador de la API de BrigadaHostel. Retorna 200 OK."""

    def get(self, request):
        return Response({
            'servicio': 'BrigadaHostel API REST (Django REST Framework)',
            'estado': 'en_linea',
            'version': '2.0.0',
            'endpoints': {
                'reservas': request.build_absolute_uri('/api/reservas/'),
                'habitaciones': request.build_absolute_uri('/api/habitaciones/'),
                'dashboard_metricas': request.build_absolute_uri('/api/dashboard/metricas/'),
                'integrantes': request.build_absolute_uri('/api/integrantes/'),
                'usuarios': request.build_absolute_uri('/api/usuarios/'),
                'login': request.build_absolute_uri('/api/auth/login/'),
                'admin_panel': request.build_absolute_uri('/admin/'),
            }
        }, status=status.HTTP_200_OK)


# ==============================================================================
# VISTAS DE RESERVAS (APIView con códigos HTTP explícitos)
# ==============================================================================

class ReservaListCreateAPIView(APIView):
    """
    Listado y registro de reservas.
    - GET: 200 OK
    - POST: 201 CREATED | 400 BAD REQUEST
    """

    def get(self, request):
        estado = request.query_params.get('estado')
        tipo_hab = request.query_params.get('tipoHabitacion') or request.query_params.get('tipo_habitacion')
        search = request.query_params.get('search')

        queryset = ReservaSelector.filter_reservas(
            estado=estado,
            tipo_habitacion=tipo_hab,
            search=search
        )
        serializer = ReservaSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = ReservaSerializer(data=request.data)
        if serializer.is_valid():
            reserva = ReservaService.crear_reserva(serializer.validated_data)
            output_serializer = ReservaSerializer(reserva)
            return Response(output_serializer.data, status=status.HTTP_201_CREATED)

        return Response(
            {
                'mensaje': 'Error de validación al crear la reserva.',
                'errores': serializer.errors
            },
            status=status.HTTP_400_BAD_REQUEST
        )


class ReservaDetailAPIView(APIView):
    """
    Operaciones sobre una reserva individual.
    - GET: 200 OK | 404 NOT FOUND
    - PUT: 200 OK | 400 BAD REQUEST | 404 NOT FOUND
    - PATCH: 200 OK | 400 BAD REQUEST | 404 NOT FOUND
    - DELETE: 204 NO CONTENT | 404 NOT FOUND
    """

    def get(self, request, pk):
        reserva = ReservaSelector.get_by_id(pk)
        if reserva is None:
            return Response(
                {'error': f"Reserva con ID '{pk}' no encontrada."},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = ReservaSerializer(reserva)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        reserva = ReservaSelector.get_by_id(pk)
        if reserva is None:
            return Response(
                {'error': f"Reserva con ID '{pk}' no encontrada para actualizar."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = ReservaSerializer(reserva, data=request.data)
        if serializer.is_valid():
            reserva_actualizada = ReservaService.actualizar_reserva(
                reserva,
                serializer.validated_data,
                partial=False
            )
            output_serializer = ReservaSerializer(reserva_actualizada)
            return Response(output_serializer.data, status=status.HTTP_200_OK)

        return Response(
            {
                'mensaje': 'Error de validación al actualizar la reserva.',
                'errores': serializer.errors
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    def patch(self, request, pk):
        reserva = ReservaSelector.get_by_id(pk)
        if reserva is None:
            return Response(
                {'error': f"Reserva con ID '{pk}' no encontrada para modificación parcial."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = ReservaSerializer(reserva, data=request.data, partial=True)
        if serializer.is_valid():
            reserva_actualizada = ReservaService.actualizar_reserva(
                reserva,
                serializer.validated_data,
                partial=True
            )
            output_serializer = ReservaSerializer(reserva_actualizada)
            return Response(output_serializer.data, status=status.HTTP_200_OK)

        return Response(
            {
                'mensaje': 'Error de validación en modificación parcial.',
                'errores': serializer.errors
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    def delete(self, request, pk):
        reserva = ReservaSelector.get_by_id(pk)
        if reserva is None:
            return Response(
                {'error': f"Reserva con ID '{pk}' no encontrada para eliminar."},
                status=status.HTTP_404_NOT_FOUND
            )

        numero_reserva = ReservaService.eliminar_reserva(reserva)
        return Response(
            {'mensaje': f"Reserva #{numero_reserva} eliminada exitosamente."},
            status=status.HTTP_204_NO_CONTENT
        )


class ReservaEstadoAPIView(APIView):
    """
    Actualización rápida de estado operativo de reserva.
    - PATCH: 200 OK | 400 BAD REQUEST | 404 NOT FOUND
    """

    def patch(self, request, pk):
        reserva = ReservaSelector.get_by_id(pk)
        if reserva is None:
            return Response(
                {'error': f"Reserva con ID '{pk}' no encontrada."},
                status=status.HTTP_404_NOT_FOUND
            )

        nuevo_estado = request.data.get('estado')
        exito, error_msg = ReservaService.cambiar_estado(reserva, nuevo_estado)
        if not exito:
            return Response({'error': error_msg}, status=status.HTTP_400_BAD_REQUEST)

        serializer = ReservaSerializer(reserva)
        return Response(serializer.data, status=status.HTTP_200_OK)


# ==============================================================================
# VISTAS DE HABITACIONES (APIView)
# ==============================================================================

class HabitacionListCreateAPIView(APIView):
    """
    Catálogo de habitaciones del hostel.
    - GET: 200 OK
    - POST: 201 CREATED | 400 BAD REQUEST
    """

    def get(self, request):
        disponible_param = request.query_params.get('disponible')
        disponible_bool = None
        if disponible_param is not None:
            disponible_bool = disponible_param.lower() in ('true', '1', 'si')

        queryset = HabitacionSelector.filter_habitaciones(disponible=disponible_bool)
        serializer = HabitacionSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = HabitacionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(
            {
                'mensaje': 'Error de validación al crear habitación.',
                'errores': serializer.errors
            },
            status=status.HTTP_400_BAD_REQUEST
        )


class HabitacionDetailAPIView(APIView):
    """
    Detalle, modificación y eliminación de habitación.
    - GET: 200 OK | 404 NOT FOUND
    - PUT: 200 OK | 400 BAD REQUEST | 404 NOT FOUND
    - PATCH: 200 OK | 400 BAD REQUEST | 404 NOT FOUND
    - DELETE: 204 NO CONTENT | 404 NOT FOUND
    """

    def get(self, request, pk):
        habitacion = HabitacionSelector.get_by_id(pk)
        if habitacion is None:
            return Response(
                {'error': f"Habitación con ID '{pk}' no encontrada."},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = HabitacionSerializer(habitacion)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        habitacion = HabitacionSelector.get_by_id(pk)
        if habitacion is None:
            return Response(
                {'error': f"Habitación con ID '{pk}' no encontrada."},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = HabitacionSerializer(habitacion, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):
        habitacion = HabitacionSelector.get_by_id(pk)
        if habitacion is None:
            return Response(
                {'error': f"Habitación con ID '{pk}' no encontrada."},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = HabitacionSerializer(habitacion, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        habitacion = HabitacionSelector.get_by_id(pk)
        if habitacion is None:
            return Response(
                {'error': f"Habitación con ID '{pk}' no encontrada."},
                status=status.HTTP_404_NOT_FOUND
            )
        habitacion.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ==============================================================================
# VISTAS DE USUARIOS Y AUTENTICACIÓN (APIView)
# ==============================================================================

class UsuarioListCreateAPIView(APIView):
    """
    Listado y registro de usuarios.
    - GET: 200 OK
    - POST: 201 CREATED | 400 BAD REQUEST
    """

    def get(self, request):
        usuarios = UsuarioSelector.get_all()
        serializer = UsuarioSerializer(usuarios, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = UsuarioSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UsuarioDetailAPIView(APIView):
    """
    Detalle de usuario individual.
    - GET: 200 OK | 404 NOT FOUND
    """

    def get(self, request, pk):
        usuario = UsuarioSelector.get_by_id(pk)
        if usuario is None:
            return Response(
                {'error': f"Usuario con ID '{pk}' no encontrado."},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = UsuarioSerializer(usuario)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UsuarioLoginAPIView(APIView):
    """
    Autenticación de usuarios para login de dashboard.
    - POST: 200 OK | 400 BAD REQUEST | 401 UNAUTHORIZED | 403 FORBIDDEN
    """

    def post(self, request):
        username = request.data.get('username') or request.data.get('email')
        password = request.data.get('password')

        if not username or not password:
            return Response(
                {'error': 'Debe ingresar nombre de usuario/email y contraseña.'},
                status=status.HTTP_400_BAD_request if hasattr(status, 'HTTP_400_BAD_request') else status.HTTP_400_BAD_REQUEST
            )

        status_code, payload = AuthService.autenticar_usuario(username, password)
        return Response(payload, status=status_code)


# ==============================================================================
# VISTAS DE SERVICIOS ADICIONALES (APIView)
# ==============================================================================

class ServicioListCreateAPIView(APIView):
    """
    Catálogo de servicios extras del hostel.
    - GET: 200 OK
    - POST: 201 CREATED | 400 BAD REQUEST
    """

    def get(self, request):
        servicios = ServicioSelector.get_all()
        serializer = ServicioSerializer(servicios, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = ServicioSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ==============================================================================
# VISTAS DE INTEGRANTES (APIView)
# ==============================================================================

class IntegranteListCreateAPIView(APIView):
    """
    Listado de integrantes para sección Quiénes Somos.
    - GET: 200 OK
    - POST: 201 CREATED | 400 BAD REQUEST
    """

    def get(self, request):
        integrantes = IntegranteSelector.get_all()
        serializer = IntegranteSerializer(integrantes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = IntegranteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ==============================================================================
# VISTAS DE MÉTRICAS DEL DASHBOARD (APIView)
# ==============================================================================

class DashboardMetricasAPIView(APIView):
    """
    Calcula indicadores de rendimiento y KPIs en tiempo real para el Dashboard.
    - GET: 200 OK
    """

    def get(self, request):
        metricas = DashboardMetricasService.calcular_metricas()
        return Response(metricas, status=status.HTTP_200_OK)
