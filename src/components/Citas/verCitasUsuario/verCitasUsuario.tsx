import React, { useState, useEffect, useContext } from 'react';
import { 
  IonContent, 
  IonHeader, 
  IonPage, 
  IonTitle, 
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonAlert,
  IonText
} from '@ionic/react';
import { trash, calendar } from 'ionicons/icons';
import { Cita } from '../../interfaces/interfaceProfesional/interfacesProfesional';
import { EstadoCitaActual } from '../../../constants/appConstants';
import { LOCALES_CONFIG } from '../../../constants/appConstants';
import { StorageContext } from '../../contexts/storageContexts';

const MisCitasView: React.FC = () => {
  const { storage } = useContext(StorageContext);
  const [citas, setCitas] = useState<Cita[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [citaAEliminar, setCitaAEliminar] = useState<Cita | null>(null);
  const [usuario, setUsuario] = useState<any>(null);

  // Inicia la carga de datos cuando la instancia de storage esté disponible
  useEffect(() => {
    const init = async () => {
      if (!storage) return;
      // Obtener usuario logueado
      const sesion = await storage.get('sesionActual');
      if (sesion && sesion.tipo === 'usuario') {
        setUsuario(sesion);
        cargarCitasUsuario(storage, sesion.correo);
      }
    };
    init();
  }, [storage]);

  // Actualiza las citas cuando cambia el usuario
  useEffect(() => {
    if (storage && usuario) {
      cargarCitasUsuario(storage, usuario.correo);
    }
  }, [storage, usuario]);

  // Función para cargar citas del usuario desde todos los tipos de locales
  const cargarCitasUsuario = async (storage: any, correoUsuario: string) => {
    try {
      const todasCitas: Cita[] = [];
      // Normalizar el correo
      const correoNormalizado = correoUsuario.trim().toLowerCase();
      // Tipos de locales a consultar
      const tiposLocal: ('barberia' | 'manicure' | 'tatto')[] = ['barberia', 'manicure', 'tatto'];

      for (const tipo of tiposLocal) {
        const clave = LOCALES_CONFIG[tipo.toUpperCase()].CLAVE_CITAS;
        const citasLocal: Cita[] = (await storage.get(clave)) || [];
        todasCitas.push(...citasLocal);
      }
      // Filtrar las citas que correspondan al usuario
      const citasUsuario = todasCitas.filter(c => {
        const correoCita = c.correoCliente?.trim().toLowerCase();
        return correoCita === correoNormalizado;
      });

      setCitas(citasUsuario);
    } catch (error) {
      console.error('Error cargando citas:', error);
    }
  };

  // Función para cancelar una cita
  const cancelarCita = async (cita: Cita) => {
    if (!storage || !usuario) return;
    
    try {
      const clave = LOCALES_CONFIG[cita.tipoLocal.toUpperCase()].CLAVE_CITAS;
      const citasActuales: Cita[] = (await storage.get(clave)) || [];
      
      const nuevasCitas = citasActuales.map(c => 
        c.id === cita.id ? { ...c, estado: EstadoCitaActual.CANCELADA } : c
      );
      
      await storage.set(clave, nuevasCitas);
      cargarCitasUsuario(storage, usuario.correo);
    } catch (error) {
      console.error('Error cancelando cita:', error);
    }
  };

  // Función para eliminar una cita
  const eliminarCita = async () => {
    if (!storage || !citaAEliminar || !usuario) return;
    
    try {
      const clave = LOCALES_CONFIG[citaAEliminar.tipoLocal.toUpperCase()].CLAVE_CITAS;
      const citasActuales: Cita[] = (await storage.get(clave)) || [];
      
      const nuevasCitas = citasActuales.filter(c => c.id !== citaAEliminar.id);
      await storage.set(clave, nuevasCitas);
      cargarCitasUsuario(storage, usuario.correo);
      setCitaAEliminar(null);
    } catch (error) {
      console.error('Error eliminando cita:', error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Mis Citas</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent className="ion-padding">
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Confirmar Eliminación"
          message="¿Estás seguro de eliminar esta cita?"
          buttons={[
            { text: 'Cancelar', role: 'cancel' },
            { text: 'Eliminar', handler: eliminarCita }
          ]}
        />

        {citas.length === 0 ? (
          <IonText className="ion-text-center">
            <p>No tienes citas programadas</p>
          </IonText>
        ) : (
          <IonList>
            {citas.map(cita => (
              <IonItem key={cita.id}>
                <IonLabel>
                  <h2>{cita.nombreCliente}</h2>
                  <p>Servicio: {cita.tipoLocal}</p>
                  <p>Fecha: {new Date(cita.horario).toLocaleString()}</p>
                  <p>Estado: {cita.estado}</p>
                  {cita.descripcion && <p>Detalles: {cita.descripcion}</p>}
                </IonLabel>
                <div slot="end">
                  {cita.estado === EstadoCitaActual.PENDIENTE && (
                    <IonButton 
                      color="warning" 
                      onClick={() => cancelarCita(cita)}
                    >
                      <IonIcon icon={calendar} />
                    </IonButton>
                  )}
                  <IonButton 
                    color="danger" 
                    onClick={() => {
                      setCitaAEliminar(cita);
                      setShowAlert(true);
                    }}
                  >
                    <IonIcon icon={trash} />
                  </IonButton>
                </div>
              </IonItem>
            ))}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};

export default MisCitasView;
