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

const TattoDetailView: React.FC = () => {
  const { storage } = useContext(StorageContext);
  const { id } = useParams<{ id: string }>();
  const history = useHistory();

  const [selectedLocal, setSelectedLocal] = useState<Local | null>(null);
  const [tatuadores, setTatuadores] = useState<Profesional[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedTatuadorId, setSelectedTatuadorId] = useState<number | null>(null);
  const [user, setUser] = useState<Usuario | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarDatos = async () => {
      if (!storage) return;

      try {
        const localId = parseInt(id, 10);
        
        // Cargar datos en paralelo
        const [locales, todosTatuadores, storedUser] = await Promise.all([
          storage.get("locales") || [],
          storage.get("tatuadores") || [],
          storage.get(AUTH_CONSTANTS.CLAVE_SESION_ACTUAL)
        ]);

        // 1. Buscar local
        const localEncontrado = locales.find((l: Local) => l.id === localId) || null;
        setSelectedLocal(localEncontrado);

        // 2. Filtrar tatuadores
        const tatuadoresDelLocal = todosTatuadores.filter((t: Profesional) => t.idLocal === localId);
        setTatuadores(tatuadoresDelLocal);

        // 3. Cargar usuario
        if (storedUser?.tipo === 'usuario') {
          const usuarios: Usuario[] = await storage.get(AUTH_CONSTANTS.CLAVE_USUARIOS) || [];
          const usuarioCompleto = usuarios.find(u => u.id === storedUser.id);
          
          if (usuarioCompleto) {
            setUser(usuarioCompleto);
          } else {
            setError("Usuario no encontrado en registros");
          }
        }

        setError("");
      } catch (err) {
        console.error("Error al cargar la información:", err);
        setError("Error al cargar detalles del estudio");
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [id, storage]);

  const handleBack = () => history.goBack();

  const abrirModalCita = (tatuadorId: number) => {
    setSelectedTatuadorId(tatuadorId);
    setShowModal(true);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Detalle de Tatuajes</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {loading && <IonText>Cargando...</IonText>}
        {error && <IonText color="danger">{error}</IonText>}
        
        {!loading && !selectedLocal && (
          <IonText color="danger">Local no encontrado</IonText>
        )}

        {!loading && selectedLocal && (
          <>
            <h2>{selectedLocal.nombreTienda}</h2>
            <p>{selectedLocal.correoTienda}</p>
            <p>{selectedLocal.direccion}</p>

            <IonList>
              {tatuadores.length === 0 ? (
                <IonItem>
                  <IonLabel>No hay tatuadores en este local</IonLabel>
                </IonItem>
              ) : (
                tatuadores.map( (t) => (
                  <IonItem key={t.id}>
                    <IonLabel>
                      <h2>{t.nombre} {t.apellido}</h2>
                      <p>{t.correo}</p>
                      <p>{t.telefono}</p>
                    </IonLabel>
                    <IonButton onClick={() => abrirModalCita(t.id)}>
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
          {selectedTatuadorId && selectedLocal && user ? (
            <CitaForm
              idProfesional={selectedTatuadorId}
              idLocal={selectedLocal.id}
              tipoLocal="tatto"
              user={user}
              onDismiss={() => setShowModal(false)}
            />
          ) : (
            <div style={{ padding: "20px" }}>
              <p>No se pudo cargar el formulario. Asegúrate de estar logueado.</p>
              <IonButton onClick={() => setShowModal(false)}>Cerrar</IonButton>
            </div>
          )}
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default TattoDetailView;