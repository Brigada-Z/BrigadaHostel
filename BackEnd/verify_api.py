#!/usr/bin/env python
"""
Script de verificación y validación de endpoints y códigos de estado HTTP
para la API del Dashboard de BrigadaHostel.
"""

import os
import sys
import django

# Configurar entorno Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'brigada_backend.test_settings')
django.setup()

from django.core.management import call_command
from rest_framework.test import APIClient
from rest_framework import status

def run_verification():
    print("=" * 70)
    print("VERIFICACIÓN DE CÓDIGOS DE ESTADO HTTP (Vistas heredadas de APIView)")
    print("=" * 70)

    # Migrar base de datos de prueba
    call_command('migrate', verbosity=0)
    # Poblar con datos iniciales
    call_command('seed_db', verbosity=0)

    client = APIClient()
    checks_passed = 0
    total_checks = 0

    def verify(endpoint, method, expected_status, description, data=None):
        nonlocal checks_passed, total_checks
        total_checks += 1
        fn = getattr(client, method.lower())
        kwargs = {'format': 'json'} if data is not None else {}
        args = [endpoint]
        if data is not None:
            args.append(data)

        response = fn(*args, **kwargs)
        is_ok = response.status_code == expected_status
        if is_ok:
            checks_passed += 1
            icon = "✅"
        else:
            icon = "❌"

        print(f"{icon} [{method.upper()}] {endpoint}")
        print(f"   Descripción:    {description}")
        print(f"   Status esperado: {expected_status} | Obtenido: {response.status_code}")
        if not is_ok:
            print(f"   Respuesta:       {response.data}")
        print("-" * 70)
        return response

    # 1. Catálogo de Habitaciones
    verify('/api/habitaciones/', 'GET', status.HTTP_200_OK, 'Listar todas las habitaciones')

    # 2. Catálogo de Integrantes (Quiénes Somos)
    verify('/api/integrantes/', 'GET', status.HTTP_200_OK, 'Listar integrantes de la Brigada Z')

    # 3. Métricas operativas del Dashboard
    verify('/api/dashboard/metricas/', 'GET', status.HTTP_200_OK, 'Métricas en vivo (ocupación, check-ins, ratio cancelación)')

    # 4. Listado de Reservas
    verify('/api/reservas/', 'GET', status.HTTP_200_OK, 'Listado general de reservas')

    # 5. Detalle de Reserva Existente
    verify('/api/reservas/1/', 'GET', status.HTTP_200_OK, 'Consultar detalle de reserva existente ID 1')

    # 6. Detalle de Reserva Inexistente (404)
    verify('/api/reservas/999/', 'GET', status.HTTP_404_NOT_FOUND, 'Consultar reserva inexistente ID 999')

    # 7. Creación de Reserva Válida (201)
    nueva_reserva = {
        "nombre": "Florencia Peña",
        "email": "flor@brigada.com",
        "dni": "36111222",
        "telefono": "+54 9 11 444-5555",
        "tipoHabitacion": "Doble",
        "fechaIngreso": "2026-11-01",
        "fechaSalida": "2026-11-05",
        "huespedes": 2,
        "precioTotal": 180000.0,
        "serviciosExtra": ["Desayuno Buffet Diario"],
        "estado": "confirmada"
    }
    resp_create = verify('/api/reservas/', 'POST', status.HTTP_201_CREATED, 'Crear nueva reserva válida', data=nueva_reserva)
    nueva_id = resp_create.data.get('id') if resp_create.status_code == 201 else None

    # 8. Creación de Reserva con Validación Inválida (400)
    reserva_invalida = {
        "nombre": "Error Fechas",
        "email": "error@test.com",
        "tipoHabitacion": "Suite",
        "fechaIngreso": "2026-11-10",
        "fechaSalida": "2026-11-05", # Checkout anterior a checkin
        "huespedes": 1,
        "precioTotal": 85000.0,
        "estado": "pendiente"
    }
    verify('/api/reservas/', 'POST', status.HTTP_400_BAD_REQUEST, 'Rechazar reserva con check-out anterior a check-in', data=reserva_invalida)

    # 9. Actualización Parcial PATCH (200)
    if nueva_id:
        verify(f'/api/reservas/{nueva_id}/', 'PATCH', status.HTTP_200_OK, 'Actualizar estado a cancelada con PATCH', data={"estado": "cancelada"})

    # 10. Eliminación de Reserva DELETE (204)
    if nueva_id:
        verify(f'/api/reservas/{nueva_id}/', 'DELETE', status.HTTP_204_NO_CONTENT, 'Eliminar reserva con DELETE')

    # 11. Eliminación de Reserva Inexistente (404)
    verify('/api/reservas/999/', 'DELETE', status.HTTP_404_NOT_FOUND, 'Intentar eliminar reserva inexistente')

    # 12. Autenticación Exitosa (200)
    login_valido = {"username": "admin@brigadahostel.com", "password": "admin123"}
    verify('/api/auth/login/', 'POST', status.HTTP_200_OK, 'Login con credenciales correctas', data=login_valido)

    # 13. Autenticación Fallida (401)
    login_invalido = {"username": "admin@brigadahostel.com", "password": "wrongpassword"}
    verify('/api/auth/login/', 'POST', status.HTTP_401_UNAUTHORIZED, 'Login con contraseña errónea', data=login_invalido)

    # 14. Autenticación Datos Vacíos (400)
    verify('/api/auth/login/', 'POST', status.HTTP_400_BAD_REQUEST, 'Login sin completar campos requeridos', data={})

    print(f"\nRESULTADO FINAL: {checks_passed}/{total_checks} verificaciones exitosas.")
    if checks_passed == total_checks:
        print("🎉 ¡TODOS LOS CÓDIGOS DE ESTADO HTTP Y VALIDACIONES FUNCIONAN CORRECTAMENTE!\n")
    else:
        print("⚠ Hubo fallos en algunas verificaciones.\n")
        sys.exit(1)

if __name__ == '__main__':
    run_verification()
