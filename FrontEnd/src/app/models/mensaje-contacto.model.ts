export interface MensajeContacto {
  id?: string;
  nombre: string;
  email: string;
  asunto: string;
  mensaje: string;
  fechaEnvio?: string;
}

/**
 * Error que el ContactoService entrega al componente: un mensaje apto para el usuario
 * y, si Django respondió 400, los errores de validación por campo.
 */
export interface ErrorEnvioContacto {
  mensaje: string;
  errores: Partial<Record<keyof MensajeContacto, string[]>>;
}
