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
import './LocalBarberia.css';
import { EstadoCitaActual } from '../../../constants/appConstants';
import { useLogin } from '../../useLogin/useLogin';
import { useHistory } from 'react-router';
import { StorageContext } from '../../contexts/storageContexts';  // Ajusta la ruta según tu estructura

// Extraemos la configuración específica para Barbería del objeto LOCALES_CONFIG
const { BARBERIA } = LOCALES_CONFIG;

function LocalBarberia() {
  // Obtenemos la instancia de Storage desde el contexto
  const { storage } = useContext(StorageContext);
  console.log('este es el storage: ',storage);
  // Estados para controlar la vista seleccionada en el menú lateral
  const [selectedView, setSelectedView] = useState('verCitas'); // Opciones: 'agregar', 'agregarCita', 'ver', 'verCitas'

  // Estados para el registro de barberos
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [clave, setClave] = useState('');
  const [repetClave, setRepetClave] = useState('');
  const [correo, setCorreo] = useState('');
  const [genero, setGenero] = useState('');
  const [telefono, setTelefono] = useState('');

  // Estados para agendar citas
  const [nombreCliente, setNombreCliente] = useState('');
  const [correoCliente, setCorreoCliente] = useState('');
  const [horario, setHorario] = useState<any | null>(null);
  const [tipoCorte, setTipoCorte] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [idProfesionalSeleccionado, setIdProfesionalSeleccionado] = useState<any | null>(null);
  const [estado, setEstado] = useState<EstadoCitaActual>(EstadoCitaActual.PENDIENTE);

  // Estados generales
  const [error, setError] = useState('');
  const [barberos, setBarberos] = useState<Profesional[]>([]);
  const [citas, setCitas] = useState<Cita[]>([]);
  const [contadorId, setContadorId] = useState(1);
  const [idLocalActual, setIdLocalActual] = useState<number | null>(null);

  const history = useHistory();

  // Efecto: Inicializa Storage y carga datos existentes una vez que esté disponible en el contexto
  useEffect(() => {
    if (!storage) return; // Espera a que Storage se inicialice desde el contexto
    console.log('Espera a que Storage se inicialice desde el contexto: ', storage);
    const verificarSesion = async () => {
      const autenticado = await useLogin().verificarAutenticacion();
      console.log('verificar sesion: ', autenticado);
      if (!autenticado) {
        console.log('usuario no autenticado');
      }
    };
    try{
      const initStorage = async () => {
      // Verificar sesión primero
      await verificarSesion();

      // Cargar el ID del local actual (se guarda cuando se registra el local)
      const idLocal = await storage.get('idLocalActual');
      setIdLocalActual(idLocal);
      console.log('id local', idLocal);

      // Cargar el contador de IDs para barberos, si no existe se inicia en 1
      const idGuardado = (await storage.get(BARBERIA.CLAVE_CONTADOR_ID)) || 1;
      setContadorId(idGuardado);
      console.log('id guardado del initStorage: ', idGuardado);

      // Cargar la lista de barberos registrados para este local (clave específica para barbería)
      const barberosGuardados = (await storage.get(BARBERIA.CLAVE_PROFESIONALES)) || [];
      setBarberos(barberosGuardados);
      console.log('set barberos del initStorage: ', setBarberos);

      // Cargar la lista de citas agendadas para este local (clave específica para barbería)
      const citasGuardadas = (await storage.get(BARBERIA.CLAVE_CITAS)) || [];
      setCitas(citasGuardadas);

      console.log('Cargar la lista de citas agendadas para este local (clave específica para barbería): ',setCitas );
    };
    initStorage();
    }catch(error){
      console.log('error al inicializar: ',error);
    };
  }, [storage]);

  /**
   * Función para generar un nuevo ID autoincrementable.
   * Actualiza el contador en Storage y retorna el nuevo ID.
   */
  const generarNuevoId = async () => {
    const nuevoId = contadorId + 1;
    setContadorId(nuevoId);
    await storage?.set(BARBERIA.CLAVE_CONTADOR_ID, nuevoId);
    console.log('nuevoid del generar nuevo id: ', setContadorId);
    return nuevoId;  

  };

  /**
   * Valida el formulario de registro del barbero.
   */
  const validarBarbero = () => {
    if (!nombre || !apellido || !clave || !genero || !correo || !telefono) {
      setError('⚠️ Completa todos los campos');
      console.log('faltan datos del barbero');
      return false;
    }
    if (clave !== repetClave) {
      setError('🔒 Las contraseñas no coinciden');
      console.log('error de claves erroneas');
      return false;
    }
    if (!/^\w+@\w+\.\w+$/.test(correo)) {
      setError('📧 Email inválido');
      console.log('error de correo');
      return false;
    }
    setError('');
    return true;
  };

  /**
   * Guarda el registro de un nuevo barbero.
   */
  const guardarBarbero = async () => {
    try{
      console.log('creando un barbero');
      if (!validarBarbero() || !storage || !idLocalActual) return;
      console.log('creando barbero, esto es depues del validador');
      
      const nuevoId = await generarNuevoId();
      const nuevoBarbero: Profesional = {
        id: nuevoId,
        idLocal: idLocalActual,
        nombre,
        apellido,
        correo,
        genero,
        especialidad: 'Barbería',
        clave,
        telefono
      };
      console.log('barbero creado', nuevoBarbero);
      console.log('nuevo barbero del guardar barbero: ',nuevoBarbero );
      // Guardar el barbero en la lista global de profesionales
      const profesionales = (await storage.get('profesionales')) || [];
      const profesionalesActualizados = [...profesionales, nuevoBarbero];
      await storage.set('profesionales', profesionalesActualizados);

      console.log('profesionales: ', profesionales);
      console.log('profesional ACtualizados: ',profesionalesActualizados );

        // Guardar el barbero en la lista específica del local (Barbería)
      const barberosActualizados = [...barberos, nuevoBarbero];
      await storage.set(BARBERIA.CLAVE_PROFESIONALES, barberosActualizados);
      console.log('barberos actualizados despues del await storage.set', barberosActualizados);
      setBarberos(barberosActualizados);
    }catch(error){
      console.log('error al guardar barbero', error);
    }

    // Resetear los campos del formulario
    setNombre('');
    setApellido('');
    setCorreo('');
    setGenero('');
    setClave('');
    setRepetClave('');
    setTelefono('');
  };



  

  /**
   * Valida el formulario para agendar una cita.
   */
  const validarCita = () => {
    if (!nombreCliente || !correoCliente || !horario || !tipoCorte) {
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

  /**
   * Guarda una nueva cita para un servicio en Barbería.
   */
  const guardarCita = async () => {
    if (!validarCita() || !storage || !idLocalActual) return;

    const nuevaCita: Cita = {
      id: contadorId,
      idLocal: idLocalActual,
      idProfesional: idProfesionalSeleccionado,
      tipoLocal: 'barberia',
      nombreCliente,
      correoCliente,
      horario: new Date(horario).toISOString(),
      posicion: tipoCorte,
      descripcion,
      estado: estado
    };

    console.log('nueva cita: ',nuevaCita );

    const citasActualizadas = [...citas, nuevaCita];
    await storage.set(BARBERIA.CLAVE_CITAS, citasActualizadas);
    setCitas(citasActualizadas);
    console.log('citas actualizado: ',setCitas );

    // Resetear el formulario de cita
    setNombreCliente('');
    setCorreoCliente('');
    setHorario(null);
    setTipoCorte('');
    setDescripcion('');
    setIdProfesionalSeleccionado(null);
  };

  const { cerrarSesion: cerrarSesionHook, verificarAutenticacion } = useLogin();

  const cerrarSesion = async () => {
    await cerrarSesionHook();
    history.push("/Login");
  };

  return (
    <>
      {/* MENÚ LATERAL */}
      <IonMenu contentId="main-content">
        <IonHeader>
          <IonToolbar color="primary">
            <IonTitle>Menú Barbería</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonList lines="full">
            <IonItem button onClick={() => setSelectedView('agregar')}>
              <IonIcon slot="start" icon={personAddOutline} />
              <IonLabel>Agregar Barbero</IonLabel>
            </IonItem>
            <IonItem button onClick={() => setSelectedView('agregarCita')}>
              <IonIcon slot="start" icon={addCircleOutline} />
              <IonLabel>Nueva Cita</IonLabel>
            </IonItem>
            <IonItem button onClick={() => setSelectedView('ver')}>
              <IonIcon slot="start" icon={eyeOutline} />
              <IonLabel>Ver Barberos</IonLabel>
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

          {/* Vista: Agregar Barbero */}
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
                    label="Teléfono"
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
                <IonButton expand="block" onClick={guardarBarbero}>
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
                    label="Seleccionar Barbero"
                    value={idProfesionalSeleccionado}
                    onIonChange={e => setIdProfesionalSeleccionado(e.detail.value)}
                  >
                    {barberos.map(barbero => (
                      <IonSelectOption key={barbero.id} value={barbero.id}>
                        {barbero.nombre} {barbero.apellido}
                      </IonSelectOption>
                    ))}
                  </IonSelect>
                </IonItem>
                <IonItem>
                  <IonInput
                    label="Tipo de Corte"
                    labelPlacement="floating"
                    placeholder="Ej: Corte clásico"
                    value={tipoCorte}
                    onIonChange={e => setTipoCorte(e.detail.value!)}
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

          {/* Vista: Listado de Barberos */}
          {selectedView === 'ver' && (
            <div className="data-list">
              <h2>Barberos Registrados</h2>
              <IonList>
                {barberos.map(b => (
                  <IonItem key={b.id}>
                    <IonLabel>
                      <h2>{b.nombre} {b.apellido}</h2>
                      <p>{b.correo}</p>
                    </IonLabel>
                  </IonItem>
                ))}
              </IonList>
            </div>
          )}

          {/* Vista: Listado de Citas */}
          {selectedView === 'verCitas' && (
            <div className="data-list">
              <h2>{BARBERIA.TITULO_CITAS}</h2>
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

export default LocalBarberia;
