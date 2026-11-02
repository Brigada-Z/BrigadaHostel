export interface Incidencia {
  id?: number;
  usuario: number | null;
  habitacion: number | null;
  titulo: string;
  descripcion: string;
  severidad: 'baja' | 'media' | 'alta';
  estado: 'abierta' | 'en_proceso' | 'resuelta' | 'cerrada';
  fechaCreacion?: string;
}
