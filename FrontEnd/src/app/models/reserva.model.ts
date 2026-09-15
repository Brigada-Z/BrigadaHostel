export interface Reserva {
  id?: string;
  nombre: string;
  email: string;
  fechaIngreso: string;
  fechaSalida: string;
  huespedes: number;
  tipoHabitacion: string;
  estado: 'pendiente' | 'confirmada' | 'cancelada';
}