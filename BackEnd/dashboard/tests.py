from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from datetime import date, timedelta
from .models import Usuario, Habitacion, Reserva, Servicio, Integrante


class DashboardAPITests(TestCase):
    """
    Suite de pruebas unitarias para validar que todas las vistas heredadas de APIView
    devuelvan estrictamente los códigos de estado HTTP correctos:
    - 200 OK
    - 201 CREATED
    - 204 NO CONTENT
    - 400 BAD REQUEST
    - 401 UNAUTHORIZED
    - 404 NOT FOUND
    """

    def setUp(self):
        self.client = APIClient()

        # Usuario de prueba
        self.usuario = Usuario.objects.create(
            nombre="Admin",
            apellido="Brigada",
            email="admin@brigadahostel.com",
            password="admin123",
            rol="admin"
        )

        # Habitación de prueba
        self.habitacion = Habitacion.objects.create(
            numero="101",
            tipo="Individual",
            precio_noche=30000.00,
            capacidad=1,
            disponible=True,
            estado="Disponible"
        )

        # Reserva de prueba
        self.reserva = Reserva.objects.create(
            numero_reserva="BH-100",
            usuario=self.usuario,
            habitacion=self.habitacion,
            nombre="Juan Perez",
            email="juan.perez@test.com",
            dni="12345678",
            telefono="11223344",
            tipo_habitacion="Individual",
            fecha_ingreso=date.today(),
            fecha_salida=date.today() + timedelta(days=3),
            huespedes=1,
            precio_total=90000.00,
            estado="confirmada"
        )

    # --------------------------------------------------------------------------
    # 1. Pruebas de Códigos HTTP en Reservas (List / Create)
    # --------------------------------------------------------------------------
    def test_get_reservas_devuelve_200_ok(self):
        """GET /api/reservas/ debe retornar status 200 OK con la lista"""
        response = self.client.get('/api/reservas/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data, list)
        self.assertGreaterEqual(len(response.data), 1)

    def test_post_reserva_valida_devuelve_201_created(self):
        """POST /api/reservas/ con payload válido debe retornar status 201 CREATED"""
        payload = {
            "nombre": "Carlos Santana",
            "email": "carlos@test.com",
            "dni": "98765432",
            "telefono": "+549110000000",
            "tipoHabitacion": "Individual",
            "fechaIngreso": str(date.today() + timedelta(days=5)),
            "fechaSalida": str(date.today() + timedelta(days=8)),
            "huespedes": 1,
            "precioTotal": 90000.00,
            "estado": "pendiente"
        }
        response = self.client.post('/api/reservas/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('id', response.data)
        self.assertEqual(response.data['nombre'], "Carlos Santana")

    def test_post_reserva_fechas_invalidas_devuelve_400_bad_request(self):
        """POST /api/reservas/ con fechaSalida anterior a fechaIngreso debe retornar 400 BAD REQUEST"""
        payload = {
            "nombre": "Test Invalido",
            "email": "invalido@test.com",
            "tipoHabitacion": "Individual",
            "fechaIngreso": str(date.today() + timedelta(days=5)),
            "fechaSalida": str(date.today() + timedelta(days=2)),  # Anterior
            "huespedes": 1,
            "precioTotal": 30000.00,
            "estado": "pendiente"
        }
        response = self.client.post('/api/reservas/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('fechaSalida', response.data.get('errores', {}))

    # --------------------------------------------------------------------------
    # 2. Pruebas de Códigos HTTP en Reserva Detalle
    # --------------------------------------------------------------------------
    def test_get_reserva_existente_devuelve_200_ok(self):
        """GET /api/reservas/<id>/ existente debe retornar 200 OK"""
        response = self.client.get(f'/api/reservas/{self.reserva.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['nombre'], "Juan Perez")

    def test_get_reserva_inexistente_devuelve_404_not_found(self):
        """GET /api/reservas/9999/ inexistente debe retornar 404 NOT FOUND"""
        response = self.client.get('/api/reservas/9999/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_patch_reserva_devuelve_200_ok(self):
        """PATCH /api/reservas/<id>/ debe modificar parcialmente y retornar 200 OK"""
        payload = {"estado": "cancelada", "notas": "Cancelada por fuerza mayor"}
        response = self.client.patch(f'/api/reservas/{self.reserva.id}/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.reserva.refresh_from_db()
        self.assertEqual(self.reserva.estado, "cancelada")

    def test_delete_reserva_existente_devuelve_204_no_content(self):
        """DELETE /api/reservas/<id>/ debe eliminar y retornar 204 NO CONTENT"""
        response = self.client.delete(f'/api/reservas/{self.reserva.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Reserva.objects.filter(pk=self.reserva.id).exists())

    def test_delete_reserva_inexistente_devuelve_404_not_found(self):
        """DELETE /api/reservas/9999/ debe retornar 404 NOT FOUND"""
        response = self.client.delete('/api/reservas/9999/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    # --------------------------------------------------------------------------
    # 3. Pruebas de Habitaciones y Métricas
    # --------------------------------------------------------------------------
    def test_get_habitaciones_devuelve_200_ok(self):
        """GET /api/habitaciones/ debe retornar 200 OK"""
        response = self.client.get('/api/habitaciones/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_get_dashboard_metricas_devuelve_200_ok(self):
        """GET /api/dashboard/metricas/ debe calcular y retornar 200 OK"""
        response = self.client.get('/api/dashboard/metricas/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('ocupacionHoy', response.data)
        self.assertIn('ratioCancelacion', response.data)
        self.assertIn('totales', response.data)

    # --------------------------------------------------------------------------
    # 4. Pruebas de Autenticación
    # --------------------------------------------------------------------------
    def test_login_exitoso_devuelve_200_ok(self):
        """POST /api/auth/login/ con credenciales correctas retorna 200 OK"""
        payload = {"username": "admin@brigadahostel.com", "password": "admin123"}
        response = self.client.post('/api/auth/login/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['usuario']['rol'], 'admin')

    def test_login_credenciales_invalidas_devuelve_401_unauthorized(self):
        """POST /api/auth/login/ con contraseña incorrecta retorna 401 UNAUTHORIZED"""
        payload = {"username": "admin@brigadahostel.com", "password": "incorrect_password"}
        response = self.client.post('/api/auth/login/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_login_vacio_devuelve_400_bad_request(self):
        """POST /api/auth/login/ sin datos requeridos retorna 400 BAD REQUEST"""
        response = self.client.post('/api/auth/login/', {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
