from django.core.management.base import BaseCommand
from datetime import date
from dashboard.models import (
    Usuario,
    Habitacion,
    Servicio,
    Reserva,
    LogAuditoria,
    Integrante
)


class Command(BaseCommand):
    help = 'Puebla la base de datos relacional con los datos iniciales de BrigadaHostel'

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE('Iniciando carga de datos iniciales en la base de datos relacional...'))

        # 1. Usuarios
        usuarios_data = [
            {
                'id': 1,
                'nombre': 'Administrador Brigada',
                'apellido': 'Hostel',
                'email': 'admin@brigadahostel.com',
                'password': 'admin123',
                'rol': 'admin',
                'estado_cuenta': 'Activa',
            },
            {
                'id': 2,
                'nombre': 'Usuario Demo',
                'apellido': 'Huésped',
                'email': 'huesped@brigada.com',
                'password': 'user123',
                'rol': 'usuario',
                'estado_cuenta': 'Activa',
            },
            {
                'id': 3,
                'nombre': 'María',
                'apellido': 'García',
                'email': 'maria.garcia@email.com',
                'password': 'maria123',
                'rol': 'usuario',
                'estado_cuenta': 'Activa',
            },
            {
                'id': 4,
                'nombre': 'Carlos',
                'apellido': 'Ruiz',
                'email': 'carlos.ruiz@email.com',
                'password': 'carlos123',
                'rol': 'usuario',
                'estado_cuenta': 'Activa',
            },
        ]

        for u in usuarios_data:
            Usuario.objects.update_or_create(
                id=u['id'],
                defaults={
                    'nombre': u['nombre'],
                    'apellido': u['apellido'],
                    'email': u['email'],
                    'password': u['password'],
                    'rol': u['rol'],
                    'estado_cuenta': u['estado_cuenta'],
                }
            )
        self.stdout.write(self.style.SUCCESS('✔ Usuarios cargados con éxito.'))

        # 2. Habitaciones
        habitaciones_data = [
            {
                'id': 1,
                'numero': '101',
                'tipo': 'Individual',
                'precio_noche': 30000.00,
                'capacidad': 1,
                'disponible': True,
                'estado': 'Disponible',
                'descripcion': 'Habitación individual privada con escritorio, WiFi de alta velocidad y baño compartido.'
            },
            {
                'id': 2,
                'numero': '102',
                'tipo': 'Doble',
                'precio_noche': 45000.00,
                'capacidad': 2,
                'disponible': True,
                'estado': 'Disponible',
                'descripcion': 'Espacio confortable para 2 personas con cama matrimonial, aire acondicionado y baño privado.'
            },
            {
                'id': 3,
                'numero': '201',
                'tipo': 'Suite',
                'precio_noche': 85000.00,
                'capacidad': 4,
                'disponible': True,
                'estado': 'Disponible',
                'descripcion': 'Suite superior con vista panorámica, cama king size, sala de estar y minibar.'
            },
            {
                'id': 4,
                'numero': '301',
                'tipo': 'Compartida (Dorm)',
                'precio_noche': 18000.00,
                'capacidad': 6,
                'disponible': True,
                'estado': 'Disponible',
                'descripcion': 'Cama en dormitorio compartido con cortina de privacidad, luz de lectura y locker individual.'
            },
        ]

        for h in habitaciones_data:
            Habitacion.objects.update_or_create(
                id=h['id'],
                defaults={
                    'numero': h['numero'],
                    'tipo': h['tipo'],
                    'precio_noche': h['precio_noche'],
                    'capacidad': h['capacidad'],
                    'disponible': h['disponible'],
                    'estado': h['estado'],
                    'descripcion': h['descripcion'],
                }
            )
        self.stdout.write(self.style.SUCCESS('✔ Catálogo de habitaciones cargado con éxito.'))

        # 3. Servicios
        servicios_data = [
            {
                'id': 1,
                'nombre': 'Desayuno Buffet Diario',
                'descripcion': 'Desayuno continental completo con frutas, panes y café de especialidad.',
                'costo': 4500.00
            },
            {
                'id': 2,
                'nombre': 'Traslado Aeropuerto / Terminal',
                'descripcion': 'Servicio de transfer privado coordinado según horarios de vuelo o micro.',
                'costo': 15000.00
            },
            {
                'id': 3,
                'nombre': 'Circuito Spa & Relax',
                'descripcion': 'Acceso al sauna seco y sesión de masajes relajantes de 45 minutos.',
                'costo': 22000.00
            },
            {
                'id': 4,
                'nombre': 'Lavandería Express',
                'descripcion': 'Lavado, secado y doblado de indumentaria en el mismo día.',
                'costo': 6000.00
            },
        ]

        for s in servicios_data:
            Servicio.objects.update_or_create(
                id=s['id'],
                defaults={
                    'nombre': s['nombre'],
                    'descripcion': s['descripcion'],
                    'costo': s['costo'],
                }
            )
        self.stdout.write(self.style.SUCCESS('✔ Catálogo de servicios adicionales cargado con éxito.'))

        # 4. Reservas
        reservas_data = [
            {
                'id': 1,
                'numero_reserva': 'BH-1',
                'usuario_id': 2,
                'habitacion_id': 2,
                'nombre': 'Juan Pérez',
                'email': 'juan.perez@email.com',
                'dni': '38.999.111',
                'telefono': '+54 9 11 555-1234',
                'tipo_habitacion': 'Doble',
                'fecha_ingreso': date(2026, 10, 10),
                'fecha_salida': date(2026, 10, 14),
                'huespedes': 2,
                'precio_total': 180000.00,
                'servicios_extra': ['Desayuno Buffet Diario'],
                'estado': 'confirmada',
                'notas': 'Llega después de las 20hs.',
            },
            {
                'id': 2,
                'numero_reserva': 'BH-2',
                'usuario_id': 3,
                'habitacion_id': 1,
                'nombre': 'María García',
                'email': 'maria.garcia@email.com',
                'dni': '35.123.456',
                'telefono': '+54 9 11 876-5432',
                'tipo_habitacion': 'Individual',
                'fecha_ingreso': date(2026, 9, 22),
                'fecha_salida': date(2026, 9, 25),
                'huespedes': 1,
                'precio_total': 90000.00,
                'servicios_extra': ['Desayuno Buffet Diario', 'Traslado Aeropuerto / Terminal'],
                'estado': 'confirmada',
                'notas': 'Requiere factura A.',
            },
            {
                'id': 3,
                'numero_reserva': 'BH-3',
                'usuario_id': 4,
                'habitacion_id': 3,
                'nombre': 'Carlos Ruiz',
                'email': 'carlos.ruiz@email.com',
                'dni': '12.888.444',
                'telefono': '+54 9 261 456-7890',
                'tipo_habitacion': 'Suite',
                'fecha_ingreso': date(2026, 9, 15),
                'fecha_salida': date(2026, 9, 18),
                'huespedes': 3,
                'precio_total': 255000.00,
                'servicios_extra': [],
                'estado': 'cancelada',
                'notas': 'Canceló por motivos de viaje imprevistos.',
            },
            {
                'id': 4,
                'numero_reserva': 'BH-4',
                'usuario_id': 2,
                'habitacion_id': 4,
                'nombre': 'Ana Laura Gómez',
                'email': 'ana.gomez@email.com',
                'dni': '40.222.333',
                'telefono': '+54 9 351 987-6543',
                'tipo_habitacion': 'Compartida (Dorm)',
                'fecha_ingreso': date(2026, 10, 12),
                'fecha_salida': date(2026, 10, 15),
                'huespedes': 1,
                'precio_total': 54000.00,
                'servicios_extra': ['Desayuno Buffet Diario'],
                'estado': 'pendiente',
                'notas': 'Cama baja preferente.',
            },
        ]

        for r in reservas_data:
            Reserva.objects.update_or_create(
                id=r['id'],
                defaults={
                    'numero_reserva': r['numero_reserva'],
                    'usuario_id': r['usuario_id'],
                    'habitacion_id': r['habitacion_id'],
                    'nombre': r['nombre'],
                    'email': r['email'],
                    'dni': r['dni'],
                    'telefono': r['telefono'],
                    'tipo_habitacion': r['tipo_habitacion'],
                    'fecha_ingreso': r['fecha_ingreso'],
                    'fecha_salida': r['fecha_salida'],
                    'huespedes': r['huespedes'],
                    'precio_total': r['precio_total'],
                    'servicios_extra': r['servicios_extra'],
                    'estado': r['estado'],
                    'notas': r['notas'],
                }
            )
        self.stdout.write(self.style.SUCCESS('✔ Reservas operativas cargadas con éxito.'))

        # 5. Integrantes
        integrantes_data = [
            {'id': 1, 'nombre': 'Giuliano', 'apellido': 'BATISTELA', 'responsabilidad': 'Modelado DER y Backend', 'dni': '42561123', 'github': 'https://github.com/gbatistela'},
            {'id': 2, 'nombre': 'Alejo Nicolas', 'apellido': 'CAMOLOTTO', 'responsabilidad': 'Arquitectura y Documentación', 'dni': '44606044', 'github': 'https://github.com/Camolotto'},
            {'id': 3, 'nombre': 'Mauricio Emiliano', 'apellido': 'FERREYRA', 'responsabilidad': 'Frontend Angular y Vistas', 'dni': '38158836', 'github': 'https://github.com/EmiTeck'},
            {'id': 4, 'nombre': 'Agustin Nicolas', 'apellido': 'GALLARDO', 'responsabilidad': 'Backend Django y Base de Datos', 'dni': '41600077', 'github': 'https://github.com/agstudio98'},
            {'id': 5, 'nombre': 'Jorge Francisco', 'apellido': 'QUEVEDO', 'responsabilidad': 'Control de Calidad y Tests', 'dni': '31218408', 'github': 'https://github.com/JQuevedoJorge'},
            {'id': 6, 'nombre': 'Oscar Alberto', 'apellido': 'QUEVEDO', 'responsabilidad': 'Diseño UX/UI y Maquetado', 'dni': '34839723', 'github': 'https://github.com/Oscar-Quevedo'},
        ]

        for integ in integrantes_data:
            Integrante.objects.update_or_create(
                id=integ['id'],
                defaults={
                    'nombre': integ['nombre'],
                    'apellido': integ['apellido'],
                    'responsabilidad': integ['responsabilidad'],
                    'dni': integ['dni'],
                    'github': integ['github'],
                }
            )
        self.stdout.write(self.style.SUCCESS('✔ Integrantes de la Brigada Z cargados con éxito.'))

        # 6. Log Auditoría
        LogAuditoria.objects.get_or_create(
            accion='Inicialización del Sistema',
            detalle='Carga de datos iniciales en la base de datos relacional completada.'
        )

        self.stdout.write(self.style.SUCCESS('\n🎉 ¡Base de datos poblada exitosamente con datos iniciales!'))
