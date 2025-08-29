import React, { useState, useEffect, useContext } from 'react';
import {
    IonInput,
    IonItem,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
    IonSelect,
    IonSelectOption,
    IonLabel,
    IonInputPasswordToggle,
    IonText,
    IonAlert
} from '@ionic/react';
import { StorageContext } from '../../contexts/storageContexts';
import { Local } from '../../interfaces/interfaceProfesional/interfacesProfesional';
import './registroTienda.css';

const CLAVE_LOCALES = 'locales';
const CONTADOR_ID = 'contador-id-locales';

function RegistroTiendaForm() {
    // Estados para los campos del formulario
    const [nombreTienda, setNombreTienda] = useState('');
    const [correoTienda, setCorreoTienda] = useState('');
    const [claveTienda, setClaveTienda] = useState('');
    const [repetClaveTienda, setRepetClaveTienda] = useState('');
    const [tipoLocal, setTipoLocal] = useState('');
    const [telefonoLocal, setTelefonoLocal] = useState('');
    const [direccionTienda, setDireccionTienda] = useState('');

    // Estados para manejo de alertas
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [errorAlert, setErrorAlert] = useState({
        isOpen: false,
        message: ''
    });

    // Estado para el contador de ID
    const [contadorId, setContadorId] = useState(1);

    // Obtenemos la instancia centralizada de Storage desde el contexto
    const { storage } = useContext(StorageContext);

    // Cargar contador de ID cuando storage esté disponible
    useEffect(() => {
        const loadCounter = async () => {
            if (storage) {
                const idGuardado = (await storage.get(CONTADOR_ID)) || 1;
                setContadorId(idGuardado);
            }
        };
        loadCounter();
    }, [storage]);

    // Generar nuevo ID
    const generarNuevoId = async () => {
        const nuevoId = contadorId + 1;
        setContadorId(nuevoId);
        await storage?.set(CONTADOR_ID, nuevoId);
        return nuevoId;
    };

    // Validación centralizada
    const validarCampos = (): string | null => {
        if (!nombreTienda || !correoTienda || !claveTienda || !repetClaveTienda || !tipoLocal || !telefonoLocal || !direccionTienda) {
            return 'Por favor, complete todos los campos.';
        }
        if (claveTienda !== repetClaveTienda) {
            return 'Las contraseñas no coinciden.';
        }
        return null;
    };

    // Manejo de errores
    const handleError = (message: string) => {
        setErrorAlert({
            isOpen: true,
            message: message
        });
        console.error(message);
    };

    // Guardar local
    const guardarLocal = async () => {
        try {
            const errorValidacion = validarCampos();
            if (errorValidacion) {
                handleError(errorValidacion);
                return;
            }
            if (!storage) {
                handleError('Error de configuración del sistema');
                return;
            }
            const nuevoId = await generarNuevoId();
            const nuevoLocal: Local = {
                id: nuevoId,
                nombreTienda,
                correoTienda,
                claveTienda,
                tipoLocal: tipoLocal as 'barberia' | 'manicure' | 'tatto',
                telefonoLocal,
                direccion: direccionTienda
            };

            // Guardar en Storage
            const localesGuardados = (await storage.get(CLAVE_LOCALES)) || [];
            const actualizados = [...localesGuardados, nuevoLocal];
            await storage.set(CLAVE_LOCALES, actualizados);

            // Resetear formulario y mostrar éxito
            resetFormulario();
            setShowSuccessAlert(true);
        } catch (error) {
            handleError('Error al guardar el local: ' + error);
        }
    };

    // Reiniciar formulario
    const resetFormulario = () => {
        setNombreTienda('');
        setCorreoTienda('');
        setClaveTienda('');
        setRepetClaveTienda('');
        setTipoLocal('');
        setTelefonoLocal('');
        setDireccionTienda('');
    };

    return (
        <IonGrid fixed={true}>
            <IonRow>
                <IonCol size="2"></IonCol>
                <IonCol size="8" className="columap">
                    {/* Campos del formulario */}
                    <IonItem>
                        <IonInput
                            label="Nombre del Local"
                            placeholder="Ej: Bella's Barber Shop"
                            value={nombreTienda}
                            onIonChange={e => setNombreTienda(e.detail.value!)}
                        />
                    </IonItem>
                    <IonItem>
                        <IonInput
                            label="Correo"
                            type="email"
                            placeholder="contacto@tulocal.com"
                            value={correoTienda}
                            onIonChange={e => setCorreoTienda(e.detail.value!)}
                        />
                    </IonItem>
                    <IonItem>
                        <IonInput
                            label="Contraseña"
                            type="password"
                            value={claveTienda}
                            onIonChange={e => setClaveTienda(e.detail.value!)}
                        >
                            <IonInputPasswordToggle slot="end" />
                        </IonInput>
                    </IonItem>
                    <IonItem>
                        <IonInput
                            label="Repetir Contraseña"
                            type="password"
                            value={repetClaveTienda}
                            onIonChange={e => setRepetClaveTienda(e.detail.value!)}
                        >
                            <IonInputPasswordToggle slot="end" />
                        </IonInput>
                    </IonItem>
                    <IonItem>
                        <IonSelect
                            label="Tipo de Local"
                            value={tipoLocal}
                            onIonChange={e => setTipoLocal(e.detail.value)}
                        >
                            <IonSelectOption value="barberia">Barbería</IonSelectOption>
                            <IonSelectOption value="manicure">Manicure</IonSelectOption>
                            <IonSelectOption value="tatto">Estudio de Tatuajes</IonSelectOption>
                        </IonSelect>
                    </IonItem>
                    <IonItem>
                        <IonInput
                            label="Teléfono"
                            placeholder="Ej: +569 1234 5678"
                            value={telefonoLocal}
                            onIonChange={e => setTelefonoLocal(e.detail.value!)}
                        />
                    </IonItem>
                    <IonItem>
                        <IonInput
                            label="Dirección"
                            placeholder="Ej: avenida 123"
                            value={direccionTienda}
                            onIonChange={e => setDireccionTienda(e.detail.value!)}
                        />
                    </IonItem>
                    {/* Botón de Registro */}
                    <IonButton
                        expand="block"
                        onClick={guardarLocal}
                        className="ion-margin-top"
                    >
                        Registrar Local
                    </IonButton>
                </IonCol>
                <IonCol size="2"></IonCol>
            </IonRow>

            {/* Alertas */}
            <IonAlert
                isOpen={showSuccessAlert}
                onDidDismiss={() => setShowSuccessAlert(false)}
                header="¡Local Registrado! 🎉"
                message="El local se ha registrado exitosamente"
                buttons={['Continuar']}
                cssClass="custom-alert"
            />
            <IonAlert
                isOpen={errorAlert.isOpen}
                onDidDismiss={() => setErrorAlert({ isOpen: false, message: '' })}
                header="Error en Registro ⚠️"
                message={errorAlert.message}
                buttons={['Entendido']}
                cssClass="error-alert"
            />
        </IonGrid>
    );
}

export default RegistroTiendaForm;
