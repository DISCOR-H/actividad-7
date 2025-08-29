import { LocalConfig } from "../components/interfaces/interfaceProfesional/interfacesProfesional";

// Constantes de Autenticación
export const AUTH_CONSTANTS = {
    ERROR_CREDENCIALES: 'Correo o contraseña incorrectos.',
    ERROR_CORREO_INVALIDO: 'Por favor, ingresa un correo válido.',
    CLAVE_USUARIOS: 'usuarios',
    CLAVE_LOCALES: 'locales',
    CLAVE_PROFESIONALES: 'profesionales',
    CLAVE_SESION_ACTUAL: 'sesionActual',
    CLAVE_ID_LOCAL_ACTUAL: 'idLocalActual'
};

// Configuración de Locales (trasladada desde LocalCentral.tsx)

  
export const LOCALES_CONFIG: { [key: string]: LocalConfig } = {
    TATTO: {
        CLAVE_CITAS: 'citas-tatto',
        CLAVE_PROFESIONALES: 'tatuadores',
        CLAVE_CONTADOR_ID: 'contador-id-tatuadores',
        TITULO_CITAS: '📌 Citas de Tatuajes',
        ERROR_CITA: 'Error al guardar cita de tattoo'
    },
    MANICURE: {
        CLAVE_CITAS: 'citas-manicure',
        CLAVE_PROFESIONALES: 'manicuristas',
        CLAVE_CONTADOR_ID: 'contador-id-manicuristas',
        TITULO_CITAS: '💅 Citas de Manicure',
        ERROR_CITA: 'Error al guardar cita de manicure'
    },
    BARBERIA: {
        CLAVE_CITAS: 'citas-barberia',
        CLAVE_PROFESIONALES: 'barberos',
        CLAVE_CONTADOR_ID: 'contador-id-barberos',
        TITULO_CITAS: '✂️ Citas de Barbería',
        ERROR_CITA: 'Error al guardar cita de barbería'
    }
};


export enum EstadoCitaActual {
    PENDIENTE = 'pendiente',
    CONFIRMADA = 'confirmada',
    CANCELADA = 'cancelada',
    COMPLETADA = 'completada'
}


// Tipos comunes
export type TipoLocal = 'barberia' | 'manicure' | 'tatto'; 