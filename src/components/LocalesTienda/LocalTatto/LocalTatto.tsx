import React, { useState, useEffect, useContext } from 'react';
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
  IonDatetime
} from '@ionic/react';
import { personAddOutline, addCircleOutline, eyeOutline, logOutOutline } from 'ionicons/icons';
import { LOCALES_CONFIG } from '../../../constants/appConstants';
import { Profesional, Cita } from '../../interfaces/interfaceProfesional/interfacesProfesional';
import './LocalTatto.css';
import { useHistory } from "react-router-dom";
import { EstadoCitaActual } from '../../../constants/appConstants';
import { useLogin } from '../../useLogin/useLogin';
import { StorageContext } from '../../contexts/storageContexts'; 

const { TATTO } = LOCALES_CONFIG;

function LocalTatto() {
  const { storage } = useContext(StorageContext);
  const { 
    cerrarSesion: cerrarSesionHook, 
    verificarAutenticacion 
  } = useLogin();

  // Estados
  const [selectedView, setSelectedView] = useState('verCitas');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [clave, setClave] = useState('');
  const [repetClave, setRepetClave] = useState('');
  const [correo, setCorreo] = useState('');
  const [genero, setGenero] = useState('');
  const [telefono, setTelefono] = useState('');
  const [nombreCliente, setNombreCliente] = useState('');
  const [correoCliente, setCorreoCliente] = useState('');
  const [horario, setHorario] = useState<string | null>(null);
  const [posicion, setPosicion] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [idProfesionalSeleccionado, setIdProfesionalSeleccionado] = useState<any | null>(null);
  const [estado, setEstado] = useState<EstadoCitaActual>(EstadoCitaActual.PENDIENTE);
  const [error, setError] = useState('');
  const [tatuadores, setTatuadores] = useState<Profesional[]>([]);
  const [citas, setCitas] = useState<Cita[]>([]);
  const [contadorId, setContadorId] = useState(1);
  const [idLocalActual, setIdLocalActual] = useState<number | null>(null);
  const history = useHistory();

  useEffect(() => {
    const cargarDatos = async () => {
      if (!storage) return;

      const autenticado = await verificarAutenticacion();
      if (!autenticado) {
        history.push('/Login');
        return;
      }

      const idLocal = await storage.get('idLocalActual');
      const idGuardado = (await storage.get(TATTO.CLAVE_CONTADOR_ID)) ?? 1;
      const tatuadoresGuardados = (await storage.get(TATTO.CLAVE_PROFESIONALES)) ?? [];
      const citasGuardadas = (await storage.get(TATTO.CLAVE_CITAS)) ?? [];


      setIdLocalActual(idLocal);
      setContadorId(idGuardado);
      setTatuadores(tatuadoresGuardados);
      setCitas(citasGuardadas);
    };

    cargarDatos();
  }, [storage]);

  const generarNuevoId = async () => {
    const nuevoId = contadorId + 1;
    setContadorId(nuevoId);
    await storage?.set(TATTO.CLAVE_CONTADOR_ID, nuevoId);
    return nuevoId;
  };

  const validarTatuador = () => {
    if (!nombre || !apellido || !clave || !genero || !correo || !telefono) {
      setError('⚠️ Completa todos los campos');
      return false;
    }
    if (clave !== repetClave) {
      setError('🔒 Las contraseñas no coinciden');
      return false;
    }
    if (!/^\w+@\w+\.\w+$/.test(correo)) {
      setError('📧 Email inválido');
      return false;
    }
    setError('');
    return true;
  };

  const guardarTatuador = async () => {
    if (!validarTatuador() || !storage || !idLocalActual) return;

    const nuevoId = await generarNuevoId();
    const nuevoTatuador: Profesional = {
      id: nuevoId,
      idLocal: idLocalActual,
      nombre,
      apellido,
      correo,
      genero,
      especialidad: 'Tatuajes',
      clave,
      telefono
    };

    // Leer profesionales y tatuadores guardados, inicializar como [] si es null o undefined
    const profesionales = (await storage.get('profesionales')) || [];
    const tatuadoresActuales = (await storage.get(TATTO.CLAVE_PROFESIONALES)) || [];

    // Guardar actualizando los arrays con el nuevo profesional

    await Promise.all([
      storage.set('profesionales', [...profesionales, nuevoTatuador]),
      storage.set(TATTO.CLAVE_PROFESIONALES, [...tatuadoresActuales, nuevoTatuador])
    ]);

    setTatuadores(prev => [...prev, nuevoTatuador]);
    resetFormularioTatuador();
  };

  const resetFormularioTatuador = () => {
    setNombre('');
    setApellido('');
    setCorreo('');
    setGenero('');
    setClave('');
    setRepetClave('');
    setTelefono('');
  };

  const validarCita = () => {
    if (!nombreCliente || !correoCliente || !horario || !posicion || !idProfesionalSeleccionado) {
      setError('⚠️ Completa los campos requeridos');
      return false;
    }
    if (!/^\w+@\w+\.\w+$/.test(correoCliente)) {
      setError('📧 Email del cliente inválido');
      return false;
    }
    setError('');
    return true;
  };

  const guardarCita = async () => {
    if (!validarCita() || !storage || !idLocalActual) return;

    const nuevaCita: Cita = {
      id: contadorId,
      idLocal: idLocalActual,
      idProfesional: idProfesionalSeleccionado,
      tipoLocal: 'tatto',
      nombreCliente,
      correoCliente,
      horario: new Date(horario!).toISOString(),
      posicion,
      descripcion,
      estado: estado
    };

    const citasActualizadas = [...citas, nuevaCita];
    await storage.set(TATTO.CLAVE_CITAS, citasActualizadas);
    setCitas(citasActualizadas);
    resetFormularioCita();
  };

  const resetFormularioCita = () => {
    setNombreCliente('');
    setCorreoCliente('');
    setHorario(null);
    setPosicion('');
    setDescripcion('');
    setIdProfesionalSeleccionado(null);
  };

  const cerrarSesion = async () => {
    await cerrarSesionHook();
    history.push("/Login");
  };

  return (
    <>
      {/* MENÚ LATERAL: Opciones del local Tatto */}
      <IonMenu contentId="main-content">
        <IonHeader>
          <IonToolbar color="primary">
            <IonTitle>Menú Tatto</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonList lines="full">
            <IonItem button onClick={() => setSelectedView('agregar')}>
              <IonIcon slot="start" icon={personAddOutline} />
              <IonLabel>Agregar Tatuador</IonLabel>
            </IonItem>
            <IonItem button onClick={() => setSelectedView('agregarCita')}>
              <IonIcon slot="start" icon={addCircleOutline} />
              <IonLabel>Nueva Cita</IonLabel>
            </IonItem>
            <IonItem button onClick={() => setSelectedView('ver')}>
              <IonIcon slot="start" icon={eyeOutline} />
              <IonLabel>Ver Tatuadores</IonLabel>
            </IonItem>
            <IonItem button onClick={() => setSelectedView('verCitas')}>
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

      {/* CONTENIDO PRINCIPAL */}
      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        <IonContent className="ion-padding">
          {error && <IonText color="danger">{error}</IonText>}

          {/* Vista: Agregar Tatuador */}
          {selectedView === 'agregar' && (
            <div className="form-container">
              <IonList>
                <IonItem>
                  <IonInput
                    label="Nombre"
                    labelPlacement="floating"
                    placeholder="Ingresa el nombre"
                    value={nombre}
                    onIonChange={e => setNombre(e.detail.value!)}
                  />
                </IonItem>
                <IonItem>
                  <IonInput
                    label="Apellido"
                    labelPlacement="floating"
                    placeholder="Ingresa el apellido"
                    value={apellido}
                    onIonChange={e => setApellido(e.detail.value!)}
                  />
                </IonItem>
                <IonItem>
                  <IonInput
                    label="Email"
                    type="email"
                    labelPlacement="floating"
                    placeholder="Ingresa el email"
                    value={correo}
                    onIonChange={e => setCorreo(e.detail.value!)}
                  />
                </IonItem>
                <IonItem>
                  <IonInput
                    label="Telefono"
                    labelPlacement="floating"
                    placeholder="Ingresa el teléfono"
                    value={telefono}
                    onIonChange={e => setTelefono(e.detail.value!)}
                  />
                </IonItem>
                <IonItem>
                  <IonSelect
                    label="Género"
                    labelPlacement="floating"
                    value={genero}
                    onIonChange={e => setGenero(e.detail.value)}
                  >
                    <IonSelectOption value="masculino">Masculino</IonSelectOption>
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
                    onIonChange={e => setClave(e.detail.value!)}
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
                    onIonChange={e => setRepetClave(e.detail.value!)}
                  >
                    <IonInputPasswordToggle slot="end" />
                  </IonInput>
                </IonItem>
                <IonButton expand="block" onClick={guardarTatuador}>
                  Registrar
                </IonButton>
              </IonList>
            </div>
          )}

          {/* Vista: Agregar Cita */}
          {selectedView === 'agregarCita' && (
            <div className="form-container">
              <IonList>
                <IonItem>
                  <IonInput
                    label="Nombre Cliente"
                    labelPlacement="floating"
                    placeholder="Ingresa el nombre del cliente"
                    value={nombreCliente}
                    onIonChange={e => setNombreCliente(e.detail.value!)}
                  />
                </IonItem>
                <IonItem>
                  <IonInput
                    label="Email Cliente"
                    type="email"
                    labelPlacement="floating"
                    placeholder="Ingresa el email del cliente"
                    value={correoCliente}
                    onIonChange={e => setCorreoCliente(e.detail.value!)}
                  />
                </IonItem>
                <IonItem>
                  <IonLabel position="stacked">Horario</IonLabel>
                  <IonDatetimeButton datetime="datetime" />
                  <IonModal keepContentsMounted={true}>
                    <IonDatetime
                      id="datetime"
                      presentation="date-time"
                      onIonChange={e => setHorario(e.detail.value?.toString() || '')}
                    />
                  </IonModal>
                </IonItem>
                <IonItem>
                                  <IonSelect
                                    value={estado}
                                    placeholder="Selecciona el estado de la cita"
                                    onIonChange={e => setEstado(e.detail.value)}
                                  >
                                    <IonSelectOption value={EstadoCitaActual.PENDIENTE}>Pendiente</IonSelectOption>
                                    <IonSelectOption value={EstadoCitaActual.CONFIRMADA}>Confirmada</IonSelectOption>
                                    <IonSelectOption value={EstadoCitaActual.CANCELADA}>Cancelada</IonSelectOption>
                                  </IonSelect>
                                </IonItem>
                <IonItem>
                    <IonSelect
                        label="Seleccionar tatuador"
                        value={idProfesionalSeleccionado}
                        onIonChange={e => setIdProfesionalSeleccionado(e.detail.value)}
                    >
                        {tatuadores.map(t => (
                            <IonSelectOption key={t.id} value={t.id}>
                                {t.nombre} {t.apellido}
                            </IonSelectOption>
                        ))}
                    </IonSelect>
                </IonItem>
                <IonItem>
                  <IonInput
                    label="Posición"
                    labelPlacement="floating"
                    placeholder="Ej: Tatuaje de calavera"
                    value={posicion}
                    onIonChange={e => setPosicion(e.detail.value!)}
                  />
                </IonItem>
                <IonItem>
                  <IonInput
                    label="Descripción"
                    labelPlacement="floating"
                    placeholder="Detalles adicionales (opcional)"
                    value={descripcion}
                    onIonChange={e => setDescripcion(e.detail.value!)}
                  />
                </IonItem>
                <IonButton expand="block" onClick={guardarCita}>
                  Agendar Cita
                </IonButton>
              </IonList>
            </div>
          )}

          {/* Vista: Listado de Tatuadores */}
          {selectedView === 'ver' && (
            <div className="data-list">
              <h2>Tatuadores Registrados</h2>
              <IonList>
                {tatuadores.map(t => (
                  <IonItem key={t.id}>
                    <IonLabel>
                      <h2>{t.nombre} {t.apellido}</h2>
                      <p>{t.correo}</p>
                    </IonLabel>
                  </IonItem>
                ))}
              </IonList>
            </div>
          )}

          {/* Vista: Listado de Citas */}
          {selectedView === 'verCitas' && (
            <div className="data-list">
              <h2>{TATTO.TITULO_CITAS}</h2>
              <IonList>
                {citas.map(c => (
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

export default LocalTatto;
