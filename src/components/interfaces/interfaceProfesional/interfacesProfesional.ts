import { TipoLocal, EstadoCitaActual } from '../../../constants/appConstants';

// interfacesProfesional.ts

// Interface base para todos los profesionales
export interface Profesional {
    id: number;          // ID obligatorio y numérico (no opcional)
    idLocal: number;     // ID del local al que pertenece
    nombre: string;
    apellido: string;
    correo: string;
    genero: string;
    especialidad: string; // Ej: 'Tatuajes', 'Manicure', 'Barberia'
    clave: string;
    telefono: string;
}

// Interface para las citas
export interface Cita {
    id: number;          // ID obligatorio y numérico 
    idLocal: number;     // ID del local asociado
    idProfesional: number;
    tipoLocal: TipoLocal;   // 'tatto', 'manicure', 'barberia'
    nombreCliente: string;
    correoCliente: string;
    horario: string;     // Fecha en formato ISO
    posicion: string;    // Ubicación/descripción del servicio
    descripcion?: string; // Opcional
    estado:EstadoCitaActual;
}

// Interface para usuarios
export interface Usuario {
    id: number;
    nombre: string;
    apellido: string;
    edad: number | null;
    correo: string;
    clave: string;
    genero: string;
    telefono: string;
}

export interface LocalConfig {
    CLAVE_CITAS: string;         // Clave para guardar citas en Storage
    CLAVE_PROFESIONALES: string; // Clave para guardar profesionales
    CLAVE_CONTADOR_ID: string;   // Clave para guardar el contador de IDs
    TITULO_CITAS: string;        // Título para la vista de citas
    ERROR_CITA: string;          // Mensaje de error al guardar citas
}

// Interface para locales
export interface Local {
    id: number;
    nombreTienda: string;
    correoTienda: string;
    claveTienda: string;
    tipoLocal: TipoLocal // 'barberia', 'manicure', 'tatto'
    telefonoLocal: string;
    direccion:string;
}
//colocar direccion

export interface Calificacion {
    id: number;
    idCita: number;          // Cita relacionada
    idProfesional: number;   // Profesional calificado
    idUsuario: number;       // Usuario que califica
    puntuacion: number;      // 1-5
    comentario?: string;     // Opcional
    fecha: string;           // ISO Date
    tipo: 'profesional' | 'usuario'; // Quién recibe la calificación
}

