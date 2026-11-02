export interface Habitacion {
  id: string;
  numero?: string;
  tipo: string;
  precioPorNoche: number;
  capacidad: number;
  disponible: boolean;
  descripcion?: string;
}