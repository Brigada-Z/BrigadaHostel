export interface MetricasDashboard {
  ocupacionHoy: {
    porcentaje: number;
    camasOcupadas: number;
    camasTotales: number;
    indicador: string;
  };
  checkinsHoy: {
    total: number;
    pendientes: number;
    indicador: string;
  };
  checkoutsHoy: {
    total: number;
  };
  ratioCancelacion: {
    porcentaje: number;
    indicador: string;
  };
  estadiaPromedio: {
    dias: number;
    indicador: string;
  };
  ingresosTotales: number;
  totales: {
    reservas: number;
    confirmadas: number;
    pendientes: number;
    canceladas: number;
    habitaciones: number;
    habitacionesDisponibles: number;
  };
}
