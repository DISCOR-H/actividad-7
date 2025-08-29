import React, { useState, useEffect, useContext } from "react";
import {
  IonContent,
  IonItem,
  IonInput,
  IonLabel,
  IonButton,
  IonDatetimeButton,
  IonModal,
  IonDatetime,
  IonAlert,
  IonText
} from "@ionic/react";
// Importamos las interfaces para Cita y Usuario
import { Cita, Usuario } from "../../interfaces/interfaceProfesional/interfacesProfesional";
// Importamos la configuración, el estado inicial y el tipo de local desde appConstants.ts
import { LOCALES_CONFIG, EstadoCitaActual, TipoLocal } from "../../../constants/appConstants";
// Importamos el StorageContext
import { StorageContext } from "../../contexts/storageContexts";

interface CitaFormProps {
  idProfesional: number; // ID del profesional asignado a la cita
  idLocal: number; // ID del local
  tipoLocal: TipoLocal; // Tipo de local (se usa para determinar la clave de citas y el contador)
  user: Usuario; // Usuario logueado (cliente) que crea la cita
  onDismiss: () => void; // Función para cerrar el modal
}

const CitaForm: React.FC<CitaFormProps> = ({ idProfesional, idLocal, tipoLocal, user, onDismiss }) => {
  // Estados para los campos del formulario
  const [horario, setHorario] = useState<string>("");
  const [posicion, setPosicion] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [error, setError] = useState("");
  // Usamos la instancia centralizada de Storage del contexto
  const { storage } = useContext(StorageContext);
  // Estado para mostrar la alerta de éxito
  const [showAlert, setShowAlert] = useState(false);
  // Contador para generar IDs para las citas
  const [citaCounter, setCitaCounter] = useState<number>(1);

  // Cuando el Storage esté listo y se sepa el tipo de local, se carga el contador de citas
  useEffect(() => {
    const loadCounter = async () => {
      if (storage) {
        // Clave dinámica para el contador según el tipo de local (ej. 'contador-id-citas-tatto')
        const counterKey = `contador-id-citas-${tipoLocal}`;
        const savedCounter = await storage.get(counterKey);
        setCitaCounter(savedCounter || 1);
      }
    };
    loadCounter();
  }, [storage, tipoLocal]);

  /**
   * Genera un nuevo ID para la cita usando el contador almacenado.
   * Actualiza el contador en Storage y retorna el nuevo ID.
   */
  const generarNuevoIdCita = async (): Promise<number> => {
    const newId = citaCounter;
    const counterKey = `contador-id-citas-${tipoLocal}`;
    const nextCounter = citaCounter + 1;
    setCitaCounter(nextCounter);
    await storage?.set(counterKey, nextCounter);
    return newId;
  };

  /**
   * Valida que se hayan completado los campos obligatorios: horario y posición.
   */
  const validarCita = (): boolean => {
    if (!horario || !posicion) {
      setError("Completa los campos obligatorios: horario y posición.");
      return false;
    }
    setError("");
    return true;
  };

  /**
   * Guarda la cita en Storage utilizando el contador para generar un ID.
   * La cita se guarda bajo la clave específica según el tipo de local.
   * Se muestra una alerta de éxito y se cierra el modal.
   */
  const guardarCita = async () => {
    if (!validarCita() || !storage) return;

    // Verificamos que el usuario tenga definidas las propiedades nombre y apellido
    if (!user || !user.nombre || !user.apellido) {
      setError("Error: datos incompletos del usuario.");
      return;
    }

    // Determinar la clave de citas según el tipo de local
    let citasKey = "";
    if (tipoLocal === "tatto") {
      citasKey = LOCALES_CONFIG.TATTO.CLAVE_CITAS;
    } else if (tipoLocal === "manicure") {
      citasKey = LOCALES_CONFIG.MANICURE.CLAVE_CITAS;
    } else if (tipoLocal === "barberia") {
      citasKey = LOCALES_CONFIG.BARBERIA.CLAVE_CITAS;
    }

    // Generar un nuevo ID para la cita
    const idCita = await generarNuevoIdCita();

    // Crear el objeto cita; se asigna el estado inicial como "pendiente"
    const nuevaCita: Cita = {
      id: idCita,
      idLocal: idLocal,
      idProfesional: idProfesional,
      tipoLocal: tipoLocal,
      // Construir el nombre del cliente usando los datos del usuario logueado
      nombreCliente: user.nombre,
      correoCliente: user.correo,
      horario: new Date(horario).toISOString(),
      posicion: posicion,
      descripcion: descripcion,
      estado: EstadoCitaActual.PENDIENTE,
    };

    console.log('Nueva Cita: ', nuevaCita);
    // Obtener citas existentes, agregamos la nueva y las guardamos en Storage
    const citasGuardadas = (await storage.get(citasKey)) || [];
    const citasActualizadas = [...citasGuardadas, nuevaCita];
    await storage.set(citasKey, citasActualizadas);

    console.log('Citas Actualizadas: ', citasActualizadas);
    // Mostrar alerta de éxito y cerrar el modal
    setShowAlert(true);
  };

  return (
    <>
      <IonAlert
        isOpen={showAlert}
        onDidDismiss={onDismiss}
        header={"Cita Creada"}
        message={"La cita se ha creado exitosamente."}
        buttons={["OK"]}
      />
      <IonContent className="ion-padding">
        {error && <IonText color="danger">{error}</IonText>}
        {/* Campo para Nombre del Cliente */}
        <IonItem>
          <IonLabel position="stacked">Nombre del Cliente</IonLabel>
          <IonInput
            value={`${user.nombre} ${user.apellido}`.trim()}
            readonly
            placeholder={!user.nombre ? "Nombre no disponible" : ""}
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Correo del Cliente</IonLabel>
          <IonInput value={user?.correo || ""} readonly />
        </IonItem>

        {/* Selección de Horario */}
        <IonItem>
          <IonLabel position="stacked">Horario</IonLabel>
          <IonDatetimeButton datetime="datetime" />
          <IonModal keepContentsMounted={true}>
            <IonDatetime
              id="datetime"
              presentation="date-time"
              onIonChange={(e) =>
                setHorario(e.detail.value ? e.detail.value.toString() : "")
              }
            />
          </IonModal>
        </IonItem>

        {/* Ingreso de la Posición */}
        <IonItem>
          <IonLabel position="stacked">Posición</IonLabel>
          <IonInput
            value={posicion}
            onIonChange={(e) => setPosicion(e.detail.value!)}
            placeholder="Ingresa la ubicación o detalle de la posición"
          />
        </IonItem>

        {/* Campo opcional para Descripción */}
        <IonItem>
          <IonLabel position="stacked">Descripción (opcional)</IonLabel>
          <IonInput
            value={descripcion}
            onIonChange={(e) => setDescripcion(e.detail.value!)}
            placeholder="Detalles adicionales"
          />
        </IonItem>
        <IonButton expand="block" onClick={guardarCita}>
          Crear Cita
        </IonButton>
      </IonContent>
    </>
  );
};

export default CitaForm;
