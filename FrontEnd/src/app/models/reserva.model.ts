export interface Reserva {
  id?: string;
  nombre: string;
  email: string;
  dni?: string;
  telefono?: string;
  fechaIngreso: string;
  fechaSalida: string;
  huespedes: number;
  tipoHabitacion: string;
  serviciosExtra?: string[];
  precioTotal?: number;
  estado: 'pendiente' | 'confirmada' | 'cancelada';
  notas?: string;
  fechaCreacion?: string;
}