import React, { useState, useEffect, useContext } from "react";
import {
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonBadge,
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
// Eliminamos la importación directa de Storage y usamos el StorageContext
import { StorageContext } from "../../contexts/storageContexts"; 
import { Local, Profesional } from "../../interfaces/interfaceProfesional/interfacesProfesional";
import CitaForm from "../../Citas/crearCitas/crearCitas";
import "./ManicureDetail.css";

const CLAVE_SESION_ACTUAL = 'sesionActual';

const ManicureDetail: React.FC = () => {
  // Obtenemos el ID del local desde la URL
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  // Obtenemos la instancia centralizada de Storage desde el Context
  const { storage } = useContext(StorageContext);

  // Estados del componente
  const [selectedLocal, setSelectedLocal] = useState<Local | null>(null);
  const [manicures, setManicures] = useState<Profesional[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedManicureId, setSelectedManicureId] = useState<number | null>(null);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState("");

  /**
   * useEffect: Inicializa Storage y carga:
   * 1. El local correspondiente al ID recibido en la URL.
   * 2. La lista global de manicuristas filtrada por el ID del local.
   * 3. El usuario (cliente) logueado, obtenido desde Storage.
   */
  useEffect(() => {
    const initStorage = async () => {
      try {
        if (!storage) return; // Esperar a que storage esté inicializado

        // Convertir el ID del local a número
        const localId = parseInt(id, 10);

        // 1. Cargar locales y buscar el local (salón de manicure) por su ID
        const locales: Local[] = (await storage.get("locales")) || [];
        const localEncontrado = locales.find((l) => l.id === localId) || null;
        setSelectedLocal(localEncontrado);

        // 2. Cargar la lista global de manicuristas y filtrar por el ID del local
        const todosManicuristas: Profesional[] = (await storage.get("manicuristas")) || [];
        const manicuristasDelLocal = todosManicuristas.filter((m) => m.idLocal === localId);
        setManicures(manicuristasDelLocal);

        // 3. Cargar el usuario (cliente) logueado desde Storage
        const storedUser = await storage.get(CLAVE_SESION_ACTUAL);
        if (storedUser) {
          const parsedUser =
            typeof storedUser === "string" ? JSON.parse(storedUser) : storedUser;
          setUser(parsedUser);
        } else {
          setError("No se encontró un usuario logueado.");
        }

        setLoading(false);
      } catch (err) {
        console.error("Error al cargar la información:", err);
        setError("Ocurrió un error al cargar la información.");
        setLoading(false);
      }
    };

    initStorage();
  }, [id, storage]);

  // Función para regresar a la vista anterior
  const handleBack = () => history.goBack();

  /**
   * Abre el modal para crear una cita para un manicurista específico.
   */
  const abrirModalCita = (manicureId: number) => {
    setSelectedManicureId(manicureId);
    setShowModal(true);
  };

  return (
    <IonPage>
      {/* Encabezado */}
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Detalle de Manicure</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {loading && <IonText>Cargando...</IonText>}
        {!loading && !selectedLocal && (
          <IonText color="danger">Salón no encontrado</IonText>
        )}
        {!loading && selectedLocal && (
          <>
            {/* Información del local */}
            <div className="local-header ion-text-center">
              <h1>{selectedLocal.nombreTienda}</h1>
              {selectedLocal.correoTienda && (
                <IonBadge color="medium">{selectedLocal.telefonoLocal}</IonBadge>
              )}
            </div>

            {/* Listado de manicuristas */}
            <IonList lines="full">
              <h3 className="ion-padding-start">Manicuristas</h3>
              {manicures.length === 0 ? (
                <IonItem>
                  <IonLabel>No hay manicuristas disponibles</IonLabel>
                </IonItem>
              ) : (
                manicures.map((m) => (
                  <IonItem key={m.id}>
                    <IonLabel>
                      <h2>{m.nombre} {m.apellido}</h2>
                      <p>{m.correo}</p>
                    </IonLabel>
                    <IonButton onClick={() => abrirModalCita(m.id)}>
                      Crear Cita
                    </IonButton>
                  </IonItem>
                ))
              )}
            </IonList>
          </>
        )}

        <IonButton onClick={handleBack}>Volver</IonButton>

        {/* Modal para crear la cita */}
        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          {selectedManicureId && selectedLocal && user ? (
            <CitaForm
              idProfesional={selectedManicureId}
              idLocal={selectedLocal.id}
              tipoLocal="manicure"
              user={user}
              onDismiss={() => setShowModal(false)}
            />
          ) : (
            <div style={{ padding: "20px" }}>
              <IonText color="danger">
                No se pudo cargar el formulario. Asegúrate de estar logueado.
              </IonText>
              <IonButton onClick={() => setShowModal(false)}>Cerrar</IonButton>
            </div>
          )}
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default ManicureDetail;
