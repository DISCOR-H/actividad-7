import { useState, useContext } from 'react';
import { StorageContext } from '../contexts/storageContexts';  // Importar el contexto
import { Local, Profesional } from '../interfaces/interfaceProfesional/interfacesProfesional';
import { AUTH_CONSTANTS } from '../../constants/appConstants';

const {
  ERROR_CREDENCIALES,
  ERROR_CORREO_INVALIDO,
  CLAVE_USUARIOS,
  CLAVE_LOCALES,
  CLAVE_PROFESIONALES,
  CLAVE_SESION_ACTUAL,
  CLAVE_ID_LOCAL_ACTUAL
} = AUTH_CONSTANTS;

export const useLogin = () => {
  const { storage } = useContext(StorageContext); // Usar storage del contexto
  const [login, setLogin] = useState<string>('');
  const [clavePass, setClavePass] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Eliminado el estado de store ya que usamos el contexto

  const validarCorreo = (correo: string): boolean => {
    const regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(correo);
  };

  const formLogin = async (e: React.FormEvent): Promise<{ tipo: 'usuario', id: number } | 
  { tipo: 'local', id: number, tipoLocal: string } | 
  { tipo: 'profesional', id: number } | null> => {
    e.preventDefault();

    if (!storage) {
      console.error('Storage no inicializado');
      setError('Error de configuración del sistema');
      return null;
    }

    if (!validarCorreo(login)) {
      setError(ERROR_CORREO_INVALIDO);
      return null;
    }

    try {
      const usuarios: any[] = (await storage.get(CLAVE_USUARIOS)) || [];
      const locales: Local[] = (await storage.get(CLAVE_LOCALES)) || [];
      const profesionales: Profesional[] = (await storage.get(CLAVE_PROFESIONALES)) || [];
      console.log('dentro del try');
      console.log('usuarios', usuarios);
      console.log('locales: ', locales);
      console.log('profesionales', profesionales);

      const encontrarUsuario = ({ correo, clave }: any) => 
        correo === login && clave === clavePass;
      
      console.log('encontrar usuario: ',encontrarUsuario);
      const usuarioEncontrado = usuarios.find(encontrarUsuario);
      console.log('usuario encontrado: ',usuarioEncontrado);
      const localEncontrado = locales.find((l: Local) => 
        l.correoTienda === login && l.claveTienda === clavePass
      );
      const profesionalEncontrado = profesionales.find(encontrarUsuario);
      console.log('profesionales encontrados Variable',profesionalEncontrado);

      const manejarSesion = async (tipo: string, datos: any) => {
        const token = generarToken(); // Función separada para generar tokens
        await Promise.all([
          storage.set(CLAVE_SESION_ACTUAL, { tipo, ...datos }),
          storage.set('token', token)
        ]);
        return { tipo, ...datos };
      };

      if (usuarioEncontrado) {
        return manejarSesion('usuario', {
          id: usuarioEncontrado.id,
          ...usuarioEncontrado
        });
      }

      if (localEncontrado) {
        await storage.set(CLAVE_ID_LOCAL_ACTUAL, localEncontrado.id);
        return manejarSesion('local', {
          id: localEncontrado.id,
          tipoLocal: localEncontrado.tipoLocal
        });
      }

      if (profesionalEncontrado) {
        return manejarSesion('profesional', {
          id: profesionalEncontrado.id
        });
      }

      setError(ERROR_CREDENCIALES);
      return null;

    } catch (err) {
      console.error('Error en login:', err);
      setError('Error en el proceso de autenticación');
      return null;
    }
  };

  const cerrarSesion = async () => {
    if (!storage) return;

    try {
      await Promise.all([
        storage.remove('token'),
        storage.remove(CLAVE_SESION_ACTUAL),
        storage.remove(CLAVE_ID_LOCAL_ACTUAL)
      ]);
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    }
  };

  const verificarAutenticacion = async (): Promise<boolean> => {
    if (!storage) return false;
    
    try {
      const token = await storage.get('token');
      return !!token;
    } catch (err) {
      console.error('Error verificando autenticación:', err);
      return false;
    }
  };

  // Función para generar tokens (mejorable)
  const generarToken = (): string => {
    return Math.random().toString(36).substr(2) + 
           Date.now().toString(36) + 
           Math.random().toString(36).substr(2);
  };

  return {
    login,
    setLogin,
    clavePass,
    setClavePass,
    error,
    setError,
    formLogin,
    validarCorreo,
    cerrarSesion,
    verificarAutenticacion
  };
};