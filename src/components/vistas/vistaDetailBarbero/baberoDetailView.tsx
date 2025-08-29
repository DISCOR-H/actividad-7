import React, { useState, useEffect, useContext } from "react";
import {
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonPage,
  IonButtons,
  IonMenuButton,
  IonText
} from "@ionic/react";
import { useParams, useHistory } from "react-router-dom";
import { Local, Profesional, Usuario } from "../../interfaces/interfaceProfesional/interfacesProfesional";
import CitaForm from "../../Citas/crearCitas/crearCitas";
import { AUTH_CONSTANTS } from "../../../constants/appConstants";
import { StorageContext } from "../../contexts/storageContexts"; 

const BarberiaDetailView: React.FC= () =>{
  const { storage } = useContext(StorageContext);
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  
  const [selectedLocal, setSelectedLocal] = useState<Local | null>(null);
  const [barberos, setBarberos] = useState<Profesional[]>([]);
  const [loading, setLoading]=useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedBarberoId, setSelectedBarberoId] = useState<number | null>(null);
  const [user, setUser] = useState<Usuario | null>(null);
  const [error, setError]= useState("");
  
  
  useEffect(()=> {
    const cargarDatos = async () => {
      if(!storage)return;

      try{
        const localId = parseInt(id, 10);
        // Cargar datos en paralelo
        const [locales, todosBarberos, storedUser]= await Promise.all([
          storage.get("locales") || [],
          storage.get("barberos") || [],
          storage.get(AUTH_CONSTANTS.CLAVE_SESION_ACTUAL)
        ]);

        // 1 Buscar Local
        const localEncontrado = locales.find((l: Local)=> l.id === localId) || null;
        setSelectedLocal(localEncontrado);

        // 2 filtrar barberos
        const barberosDelLocal = todosBarberos.filter((b: Profesional) => b.idLocal === localId);
        setBarberos(barberosDelLocal);

        // 3 Cargar Usuario
        if(storedUser?.tipo === 'usuario'){
          const usuarios: Usuario[] = await storage.get(AUTH_CONSTANTS.CLAVE_USUARIOS) || [];
          const usuarioCompleto = usuarios.find(u => u.id === storedUser.id);

          if (usuarioCompleto){
            setUser(usuarioCompleto);
          } else{
            setError("USUARIO NO ENCONTRADO EN REGISTROS.");
          }
        }
        setError("");


      } catch (err){
        console.log("ERROR AL CARGAR LA INFORMACION: ", err);
        setError("ERROR AL CARGAR DETALLES DEL ESTUDIO.");
      } finally {
        setLoading(false);
    }
  
  };

  cargarDatos();
},[id, storage]);

  const handleBack = () => history.goBack();

  const abrirModalCita = (barberoID: number) => {
    setSelectedBarberoId(barberoID);
    setShowModal(true);
  };
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Detalle de Barbería</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent className="ion-padding">
        {loading && <IonText>Cargando...</IonText>}
        {error && <IonText color="danger">{error}</IonText>}
        
        {!loading && !selectedLocal && (
          <IonText color="danger">Barbería no encontrada</IonText>
        )}

        {!loading && selectedLocal && (
          <>
            <h2>{selectedLocal.nombreTienda}</h2>
            <p>{selectedLocal.telefonoLocal}</p>
            <p>{selectedLocal.direccion}</p>

            <IonList>
              {barberos.length === 0 ? (
                <IonItem>
                  <IonLabel>No hay barberos en esta barbería</IonLabel>
                </IonItem>
              ) : (
                barberos.map((b) => (
                  <IonItem key={b.id}>
                    <IonLabel>
                      <h2>{b.nombre} {b.apellido}</h2>
                      <p>{b.telefono}</p>
                    </IonLabel>
                    <IonButton onClick={() => abrirModalCita(b.id)}>
                      Crear Cita
                    </IonButton>
                  </IonItem>
                ))
              )}
            </IonList>
          </>
        )}

        <IonButton onClick={handleBack}>Volver</IonButton>

        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          {selectedBarberoId && selectedLocal && user ? (
            <CitaForm
              idProfesional={selectedBarberoId}
              idLocal={selectedLocal.id}
              tipoLocal="barberia"
              user={user}
              onDismiss={() => setShowModal(false)}
            />
          ) : (
            <div style={{ padding: '20px' }}>
              <p>No se pudo cargar el formulario. Asegúrate de estar logueado.</p>
              <IonButton onClick={() => setShowModal(false)}>Cerrar</IonButton>
            </div>
          )}
        </IonModal>
      </IonContent>
    </IonPage>
  );
}

export default BarberiaDetailView;