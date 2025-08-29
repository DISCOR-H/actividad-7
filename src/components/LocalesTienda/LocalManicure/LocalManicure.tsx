import React, { useState, useEffect, useContext } from "react";
import {
  IonToolbar,
  IonHeader,
  IonTitle,
  IonContent,
  IonIcon,
  IonButton,
  IonMenu,
  IonPage,
  IonMenuButton,
  IonButtons,
  IonList,
  IonLabel,
  IonItem,
  IonModal,
  IonInput,
  IonSelect,
  IonDatetimeButton,
  IonSelectOption,
  IonInputPasswordToggle,
  IonText,
  IonDatetime,
} from "@ionic/react";
import {
  personAddOutline,
  addCircleOutline,
  eyeOutline,
  logOutOutline,
} from "ionicons/icons";
import { LOCALES_CONFIG } from "../../../constants/appConstants";
import {
  Profesional,
  Cita,
} from "../../interfaces/interfaceProfesional/interfacesProfesional";
import "./LocalManicure.css";
import { EstadoCitaActual } from "../../../constants/appConstants";
import { useLogin } from "../../useLogin/useLogin";
import { useHistory } from "react-router";
import { StorageContext } from "../../contexts/storageContexts"; // Importar el contexto

const { MANICURE } = LOCALES_CONFIG;

function LocalManicure() {
  // Obtener storage del contexto
  const { storage } = useContext(StorageContext); 
  const { cerrarSesion: cerrarSesionHook, verificarAutenticacion } = useLogin();

  // Estados
  const [selectedView, setSelectedView] = useState("verCitas");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [clave, setClave] = useState("");
  const [repetClave, setRepetClave] = useState("");
  const [correo, setCorreo] = useState("");
  const [genero, setGenero] = useState("");
  const [telefono, setTelefono] = useState("");
  const [nombreCliente, setNombreCliente] = useState("");
  const [correoCliente, setCorreoCliente] = useState("");
  const [horario, setHorario] = useState<string | null>(null);
  const [servicio, setServicio] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [idProfesionalSeleccionado, setIdProfesionalSeleccionado] = useState<any | null>(null);
  const [estado, setEstado] = useState<EstadoCitaActual>(
    EstadoCitaActual.PENDIENTE
  );
  const [error, setError] = useState("");
  const [manicuristas, setManicuristas] = useState<Profesional[]>([]);
  const [citas, setCitas] = useState<Cita[]>([]);
  const [contadorId, setContadorId] = useState(1);
  const [idLocalActual, setIdLocalActual] = useState<number | null>(null);
  const history = useHistory();

  useEffect(() => {
    const cargarDatos = async () => {
      if (!storage) return;

      // Verificar autenticación
      const autenticado = await verificarAutenticacion();
      if (!autenticado) {
        console.log("Usuario no autenticado");
        history.push("/Login");
        return;
      }

      // Cargar datos del local
      const idLocal = await storage.get("idLocalActual");
      const idGuardado = (await storage.get(MANICURE.CLAVE_CONTADOR_ID))?? 1;
      const manicuristasGuardados = (await storage.get(MANICURE.CLAVE_PROFESIONALES)) ?? [];
      // Cargar configuraciones
      const citasGuardadas = (await storage.get(MANICURE.CLAVE_CITAS)) ?? []
      
      setIdLocalActual(idLocal);
      setContadorId(idGuardado);
      setManicuristas(manicuristasGuardados);
      setCitas(citasGuardadas);
    };

    cargarDatos();
  }, [storage]); // Ejecutar cuando cambie el storage

  const generarNuevoId = async () => {
    const nuevoId = contadorId + 1;
    setContadorId(nuevoId);
    await storage?.set(MANICURE.CLAVE_CONTADOR_ID, nuevoId);
    return nuevoId;
  };

  const validarManicurista = () => {
    if (!nombre || !apellido || !clave || !genero || !correo || !telefono) {
      setError("⚠️ Completa todos los campos");
      return false;
    }
    if (clave !== repetClave) {
      setError("🔒 Las contraseñas no coinciden");
      return false;
    }
    if (!/^\w+@\w+\.\w+$/.test(correo)) {
      setError("📧 Email inválido");
      return false;
    }
    setError("");
    return true;
  };

  const guardarManicurista = async () => {
    if (!validarManicurista() || !storage || !idLocalActual) return;

    const nuevoId = await generarNuevoId();
    const nuevoManicurista: Profesional = {
      id: nuevoId,
      idLocal: idLocalActual,
      nombre,
      apellido,
      correo,
      genero,
      especialidad: "Manicure",
      clave,
      telefono,
    };

    // Actualizar datos en storage
    const profesionales =(await storage.get('profesionales')) || [];
    const manicuristasActualizados = (await storage.get(MANICURE.CLAVE_PROFESIONALES)) || []; 

    await Promise.all([
      storage.set("profesionales", [...profesionales, nuevoManicurista]),
      storage.set(MANICURE.CLAVE_PROFESIONALES, [
        ...manicuristasActualizados,
        nuevoManicurista,
      ]),
    ]);

    setManicuristas((prev) => [...prev, nuevoManicurista]);
    resetFormularioManicure();
  };
  
  const resetFormularioManicure= () =>{
    // Resetear formulario
    setNombre("");
    setApellido("");
    setCorreo("");
    setGenero("");
    setClave("");
    setRepetClave("");
    setTelefono("");
  };

  const validarCita = () => {
    if (
      !nombreCliente ||
      !correoCliente ||
      !horario ||
      !servicio ||
      !idProfesionalSeleccionado
    ) {
      setError("⚠️ Completa los campos requeridos");
      return false;
    }
    if (!/^\w+@\w+\.\w+$/.test(correoCliente)) {
      setError("📧 Email del cliente inválido");
      return false;
    }
    setError("");
    return true;
  };

  const guardarCita = async () => {
    if (!validarCita() || !storage || !idLocalActual) return;

    const nuevaCita: Cita = {
      id: contadorId,
      idLocal: idLocalActual,
      idProfesional: idProfesionalSeleccionado,
      tipoLocal: "manicure",
      nombreCliente,
      correoCliente,
      horario: new Date(horario!).toISOString(),
      posicion: servicio,
      descripcion,
      estado: estado,
    };

    const citasActualizadas = [...citas, nuevaCita];
    await storage.set(MANICURE.CLAVE_CITAS, citasActualizadas);
    setCitas(citasActualizadas);

    // Resetear formulario
    setNombreCliente("");
    setCorreoCliente("");
    setHorario(null);
    setServicio("");
    setDescripcion("");
    setIdProfesionalSeleccionado(null);
  };

  const cerrarSesion = async () => {
    await cerrarSesionHook();
    history.push("/Login");
  };

  return (
    <>
      {/* Menú lateral con opciones para el local de Manicure */}
      <IonMenu contentId="main-content">
        <IonHeader>
          <IonToolbar color="tertiary">
            <IonTitle>Menú Manicure</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonList lines="full">
            <IonItem button onClick={() => setSelectedView("agregar")}>
              <IonIcon slot="start" icon={personAddOutline} />
              <IonLabel>Agregar Manicurista</IonLabel>
            </IonItem>
            <IonItem button onClick={() => setSelectedView("agregarCita")}>
              <IonIcon slot="start" icon={addCircleOutline} />
              <IonLabel>Nueva Cita</IonLabel>
            </IonItem>
            <IonItem button onClick={() => setSelectedView("ver")}>
              <IonIcon slot="start" icon={eyeOutline} />
              <IonLabel>Ver Manicuristas</IonLabel>
            </IonItem>
            <IonItem button onClick={() => setSelectedView("verCitas")}>
              <IonIcon slot="start" icon={eyeOutline} />
              <IonLabel>Ver Citas</IonLabel>
            </IonItem>
            <IonItem button onClick={cerrarSesion}>
              <IonIcon slot="start" icon={logOutOutline} />
              <IonLabel>Cerrar Sesión</IonLabel>
            </IonItem>
          </IonList>
        </IonContent>
      </IonMenu>

      {/* Contenido principal del local */}
      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        <IonContent className="ion-padding">
          {/* Mostrar mensaje de error, si existe */}
          {error && <IonText color="danger">{error}</IonText>}

          {/* Vista: Agregar Manicurista */}
          {selectedView === "agregar" && (
            <div className="form-container">
              <IonList>
                <IonItem>
                  <IonInput
                    label="Nombre"
                    labelPlacement="floating"
                    placeholder="Ingresa el nombre"
                    value={nombre}
                    onIonChange={(e) => setNombre(e.detail.value!)}
                  />
                </IonItem>
                <IonItem>
                  <IonInput
                    label="Apellido"
                    labelPlacement="floating"
                    placeholder="Ingresa el apellido"
                    value={apellido}
                    onIonChange={(e) => setApellido(e.detail.value!)}
                  />
                </IonItem>
                <IonItem>
                  <IonInput
                    label="Email"
                    type="email"
                    labelPlacement="floating"
                    placeholder="Ingresa el email"
                    value={correo}
                    onIonChange={(e) => setCorreo(e.detail.value!)}
                  />
                </IonItem>
                <IonItem>
                  <IonInput
                    label="Teléfono"
                    labelPlacement="floating"
                    placeholder="Ingresa el teléfono"
                    value={telefono}
                    onIonChange={(e) => setTelefono(e.detail.value!)}
                  />
                </IonItem>
                <IonItem>
                  <IonSelect
                    label="Género"
                    labelPlacement="floating"
                    value={genero}
                    onIonChange={(e) => setGenero(e.detail.value)}
                  >
                    <IonSelectOption value="masculino">
                      Masculino
                    </IonSelectOption>
                    <IonSelectOption value="femenino">Femenino</IonSelectOption>
                    <IonSelectOption value="otro">Otro</IonSelectOption>
                  </IonSelect>
                </IonItem>
                <IonItem>
                  <IonInput
                    label="Contraseña"
                    type="password"
                    labelPlacement="floating"
                    placeholder="Ingresa la contraseña"
                    value={clave}
                    onIonChange={(e) => setClave(e.detail.value!)}
                  >
                    <IonInputPasswordToggle slot="end" />
                  </IonInput>
                </IonItem>
                <IonItem>
                  <IonInput
                    label="Repetir Contraseña"
                    type="password"
                    labelPlacement="floating"
                    placeholder="Repite la contraseña"
                    value={repetClave}
                    onIonChange={(e) => setRepetClave(e.detail.value!)}
                  >
                    <IonInputPasswordToggle slot="end" />
                  </IonInput>
                </IonItem>
                <IonButton expand="block" onClick={guardarManicurista}>
                  Registrar
                </IonButton>
              </IonList>
            </div>
          )}

          {/* Vista: Agregar Cita */}
          {selectedView === "agregarCita" && (
            <div className="form-container">
              <IonList>
                <IonItem>
                  <IonInput
                    label="Nombre Cliente"
                    labelPlacement="floating"
                    placeholder="Ingresa el nombre del cliente"
                    value={nombreCliente}
                    onIonChange={(e) => setNombreCliente(e.detail.value!)}
                  />
                </IonItem>
                <IonItem>
                  <IonInput
                    label="Email Cliente"
                    type="email"
                    labelPlacement="floating"
                    placeholder="Ingresa el email del cliente"
                    value={correoCliente}
                    onIonChange={(e) => setCorreoCliente(e.detail.value!)}
                  />
                </IonItem>
                <IonItem>
                  <IonLabel position="stacked">Horario</IonLabel>
                  <IonDatetimeButton datetime="datetime" />
                  <IonModal keepContentsMounted={true}>
                    <IonDatetime
                      id="datetime"
                      presentation="date-time"
                      onIonChange={(e) =>
                        setHorario(e.detail.value?.toString() || "")
                      }
                    />
                  </IonModal>
                </IonItem>
                <IonItem>
                  <IonSelect
                    value={estado}
                    placeholder="Selecciona el estado de la cita"
                    onIonChange={(e) => setEstado(e.detail.value)}
                  >
                    <IonSelectOption value={EstadoCitaActual.PENDIENTE}>
                      Pendiente
                    </IonSelectOption>
                    <IonSelectOption value={EstadoCitaActual.CONFIRMADA}>
                      Confirmada
                    </IonSelectOption>
                    <IonSelectOption value={EstadoCitaActual.CANCELADA}>
                      Cancelada
                    </IonSelectOption>
                  </IonSelect>
                </IonItem>
                <IonItem>
                  <IonSelect
                    label="Seleccionar Manicurista"
                    value={idProfesionalSeleccionado}
                    onIonChange={(e) =>
                      setIdProfesionalSeleccionado(e.detail.value)
                    }
                  >
                    {manicuristas.map((m) => (
                      <IonSelectOption key={m.id} value={m.id}>
                        {m.nombre} {m.apellido}
                      </IonSelectOption>
                    ))}
                  </IonSelect>
                </IonItem>
                <IonItem>
                  <IonInput
                    label="Servicio"
                    labelPlacement="floating"
                    placeholder="Ej: Manicure Básico"
                    value={servicio}
                    onIonChange={(e) => setServicio(e.detail.value!)}
                  />
                </IonItem>
                <IonItem>
                  <IonInput
                    label="Descripción"
                    labelPlacement="floating"
                    placeholder="Detalles adicionales (opcional)"
                    value={descripcion}
                    onIonChange={(e) => setDescripcion(e.detail.value!)}
                  />
                </IonItem>
                <IonButton expand="block" onClick={guardarCita}>
                  Agendar Cita
                </IonButton>
              </IonList>
            </div>
          )}

          {/* Vista: Listado de Manicuristas */}
          {selectedView === "ver" && (
            <div className="data-list">
              <h2>Manicuristas Registrados</h2>
              <IonList>
                {manicuristas.map((m) => (
                  <IonItem key={m.id}>
                    <IonLabel>
                      <h2>
                        {m.nombre} {m.apellido}
                      </h2>
                      <p>{m.correo}</p>
                    </IonLabel>
                  </IonItem>
                ))}
              </IonList>
            </div>
          )}

          {/* Vista: Listado de Citas */}
          {selectedView === "verCitas" && (
            <div className="data-list">
              <h2>{MANICURE.TITULO_CITAS}</h2>
              <IonList>
                {citas.map((c) => (
                  <IonItem key={c.id}>
                    <IonLabel>
                      <h2>{c.nombreCliente}</h2>
                      <p>{new Date(c.horario).toLocaleString()}</p>
                      <p>{c.posicion}</p>
                      {c.descripcion && <p>{c.descripcion}</p>}
                    </IonLabel>
                  </IonItem>
                ))}
              </IonList>
            </div>
          )}
        </IonContent>
      </IonPage>
    </>
  );
}

export default LocalManicure;
