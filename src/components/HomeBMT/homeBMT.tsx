import React, { useState, useEffect, useContext } from 'react';
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenu,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonIcon,
  IonLabel,
  IonList,
  IonText,
  IonSelect,
  IonSelectOption
} from '@ionic/react';
import { eyeOutline, person, logOutOutline } from 'ionicons/icons';
import { Profesional, Cita } from '../interfaces/interfaceProfesional/interfacesProfesional';
import { LOCALES_CONFIG, EstadoCitaActual, AUTH_CONSTANTS } from '../../constants/appConstants';
import { useHistory } from "react-router-dom";
import { useLogin } from '../useLogin/useLogin';
import { StorageContext } from '../contexts/storageContexts'; 

const { CLAVE_SESION_ACTUAL } = AUTH_CONSTANTS;

function MenuBMT() {
  // Obtenemos la instancia centralizada de Storage desde el Context
  const { storage } = useContext(StorageContext);

  // Funciones de autenticación y cierre de sesión
  const { cerrarSesion: cerrarSesionHook, verificarAutenticacion } = useLogin();

  // Estados del componente
  const [selectedView, setSelectedView] = useState('verMisCitas');
  const [profesional, setProfesional] = useState<Profesional | null>(null);
  const [misCitas, setMisCitas] = useState<Cita[]>([]);
  const [error, setError] = useState('');
  const history = useHistory();

  useEffect(() => {
    const init = async () => {
      if (!storage) return; // Esperar a que storage esté inicializado

      // Verificar si el usuario está autenticado
      const autenticado = await verificarAutenticacion();
      if (!autenticado) {
        history.push("/Login");
        return;
      }

      // Obtener la sesión actual
      const sesion = await storage.get(CLAVE_SESION_ACTUAL);
      if (!sesion || sesion.tipo !== 'profesional') {
        setError('No hay sesión profesional activa');
        return;
      }

      // Obtener la lista de profesionales
      const profesionales: Profesional[] = (await storage.get('profesionales')) || [];
      const profesionalEncontrado = profesionales.find(p => p.id === sesion.id);
      if (!profesionalEncontrado) {
        setError('Profesional no registrado');
        return;
      }
      setProfesional(profesionalEncontrado);

      // Determinar la clave de almacenamiento según la especialidad
      let claveCitas = '';
      const especialidadNormalizada = profesionalEncontrado.especialidad.toLowerCase();
      switch (especialidadNormalizada) {
        case 'tatuajes':
          claveCitas = LOCALES_CONFIG.TATTO.CLAVE_CITAS;
          break;
        case 'barbería':
          claveCitas = LOCALES_CONFIG.BARBERIA.CLAVE_CITAS;
          break;
        case 'manicure':
          claveCitas = LOCALES_CONFIG.MANICURE.CLAVE_CITAS;
          break;
        default:
          throw new Error(`Especialidad "${especialidadNormalizada}" no reconocida`);
      }

      // Obtener y filtrar las citas asignadas al profesional
      const todasCitas: Cita[] = (await storage.get(claveCitas)) || [];
      const citasFiltradas = todasCitas.filter(c => c.idProfesional === profesionalEncontrado.id);
      setMisCitas(citasFiltradas);
    };

    init();
  }, [storage, history, verificarAutenticacion]);

  const manejarCambioEstado = async (citaId: number, nuevoEstado: EstadoCitaActual) => {
    if (!storage || !profesional) return;

    try {
      // Actualizar el estado de la cita en la lista local
      const citasActualizadas = misCitas.map(cita =>
        cita.id === citaId ? { ...cita, estado: nuevoEstado } : cita
      );

      // Determinar la clave de almacenamiento según la especialidad
      let claveCitas = '';
      const especialidadNormalizada = profesional.especialidad.toLowerCase();
      switch (especialidadNormalizada) {
        case 'tatuajes':
          claveCitas = LOCALES_CONFIG.TATTO.CLAVE_CITAS;
          break;
        case 'barbería':
          claveCitas = LOCALES_CONFIG.BARBERIA.CLAVE_CITAS;
          break;
        case 'manicure':
          claveCitas = LOCALES_CONFIG.MANICURE.CLAVE_CITAS;
          break;
        default:
          throw new Error('Especialidad no válida');
      }

      // Guardar los cambios en Storage y actualizar el estado
      await storage.set(claveCitas, citasActualizadas);
      setMisCitas(citasActualizadas);

    } catch (error) {
      console.error('Error actualizando estado:', error);
      setError('Error al actualizar el estado');
    }
  };

  const cerrarSesion = async () => {
    await cerrarSesionHook();
    history.push("/Login");
  };

  return (
    <>
      <IonMenu contentId="main-content">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Menú Profesional</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonList>
            <IonItem button onClick={() => setSelectedView('verMisCitas')}>
              <IonIcon slot="start" icon={eyeOutline} />
              <IonLabel>Ver Mis Citas</IonLabel>
            </IonItem>
            <IonItem button onClick={() => setSelectedView('miUsuario')}>
              <IonIcon slot="start" icon={person} />
              <IonLabel>Mi Usuario</IonLabel>
            </IonItem>
            <IonItem button onClick={cerrarSesion}>
              <IonIcon slot="start" icon={logOutOutline} />
              <IonLabel>Cerrar Sesión</IonLabel>
            </IonItem>
          </IonList>
        </IonContent>
      </IonMenu>

      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>Panel Profesional</IonTitle>
          </IonToolbar>
        </IonHeader>
        
        <IonContent className="ion-padding">
          {error && <IonText color="danger">{error}</IonText>}

          {selectedView === 'verMisCitas' && (
            <IonList>
              {misCitas.length === 0 ? (
                <IonItem>
                  <IonLabel>No tienes citas asignadas</IonLabel>
                </IonItem>
              ) : (
                misCitas.map((cita) => (
                  <IonItem key={cita.id}>
                    <IonLabel>
                      <h2>{cita.nombreCliente}</h2>
                      <p>Fecha: {new Date(cita.horario).toLocaleString()}</p>
                      <p>Servicio: {cita.posicion}</p>
                      {cita.descripcion && <p>Detalles: {cita.descripcion}</p>}
                    </IonLabel>
                    <IonSelect
                      value={cita.estado}
                      onIonChange={e => manejarCambioEstado(cita.id, e.detail.value as EstadoCitaActual)}
                    >
                      {Object.values(EstadoCitaActual).map(estado => (
                        <IonSelectOption key={estado} value={estado}>
                          {estado.charAt(0).toUpperCase() + estado.slice(1)}
                        </IonSelectOption>
                      ))}
                    </IonSelect>
                  </IonItem>
                ))
              )}
            </IonList>
          )}

          {selectedView === 'miUsuario' && profesional && (
            <IonList>
              <IonItem>
                <IonLabel>Nombre: {profesional.nombre}</IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>Especialidad: {profesional.especialidad}</IonLabel>
              </IonItem>
            </IonList>
          )}
        </IonContent>
      </IonPage>
    </>
  );
}

export default MenuBMT;
