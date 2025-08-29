import React, { useState, useContext } from 'react';
import {
    IonInput, IonItem, IonButton, IonGrid, IonRow, IonCol, IonSelect,
    IonSelectOption, IonLabel, IonInputPasswordToggle, IonText, IonAlert
} from '@ionic/react';
import { Usuario } from '../../interfaces/interfaceProfesional/interfacesProfesional';
import { AUTH_CONSTANTS } from '../../../constants/appConstants';
import './registroUSer.css';
import { StorageContext } from '../../contexts/storageContexts'; 

const CONTADOR_ID = 'contador-id-usuarios';

function RegisterUserForm() {
    const { storage } = useContext(StorageContext);
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [edad, setEdad] = useState<number | null>(null);
    const [correo, setCorreo] = useState('');
    const [clave, setClave] = useState('');
    const [genero, setGenero] = useState('');
    const [telefono, setTelefono] = useState('');
    const [repiteClave, setRepiteClave] = useState('');
    const [contadorId, setContadorId] = useState(1);

    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [errorAlert, setErrorAlert] = useState({
        isOpen: false,
        message: ''
    });

    const generarNuevoId = async () => {
        const nuevoId = contadorId + 1;
        setContadorId(nuevoId);
        await storage?.set(CONTADOR_ID, nuevoId);
        return nuevoId;
    };

    const validarCampos = (): string | null => {
        if (!nombre || !apellido || !edad || !correo || !clave || !repiteClave || !genero || !telefono) {
            return 'Por favor, complete todos los campos.';
        }
        if (isNaN(edad) || edad < 1) {
            return 'Edad inválida';
        }
        if (clave !== repiteClave) {
            return 'Las contraseñas no coinciden.';
        }
        if (!/^\w+@\w+\.\w+$/.test(correo)) {
            return 'Formato de correo inválido';
        }
        return null;
    };

    const handleError = (message: string) => {
        setErrorAlert({
            isOpen: true,
            message: message
        });
        console.error(message);
    };

    const guardarUsuario = async () => {
        try {
            const errorValidacion = validarCampos();
            if (errorValidacion) return handleError(errorValidacion);
            
            if (!storage) return handleError('Error de configuración del sistema');

            const nuevoId = await generarNuevoId();
            const nuevoUsuario: Usuario = {
                id: nuevoId,
                nombre,
                apellido,
                edad: Number(edad),
                correo,
                clave,
                genero,
                telefono
            };

            const usuariosGuardados = await storage.get(AUTH_CONSTANTS.CLAVE_USUARIOS) || [];
            const actualizados = [...usuariosGuardados, nuevoUsuario];
            
            await storage.set(AUTH_CONSTANTS.CLAVE_USUARIOS, actualizados);
            
            setNombre('');
            setApellido('');
            setEdad(null);
            setCorreo('');
            setClave('');
            setRepiteClave('');
            setGenero('');
            setTelefono('');
            
            setShowSuccessAlert(true);

        } catch (error) {
            handleError('Error al guardar el registro: ' + error);
        }
    };

    return (
        <IonGrid fixed={true}>
            <IonRow>
                <IonCol size="2"></IonCol>
                <IonCol size="8" className="columap">
                    <IonItem>
                        <IonInput
                            label="Nombre"
                            placeholder="Escribe tu nombre"
                            value={nombre}
                            onIonChange={e => setNombre(e.detail.value!)}
                        />
                    </IonItem>

                    <IonItem>
                        <IonInput
                            label="Apellido"
                            placeholder="Escribe tu apellido"
                            value={apellido}
                            onIonChange={e => setApellido(e.detail.value!)}
                        />
                    </IonItem>

                    <IonItem>
                        <IonInput
                            label="Edad"
                            type="number"
                            min="1"
                            value={edad ?? ''}
                            onIonChange={e => setEdad(parseInt(e.detail.value!) || null)}
                        />
                    </IonItem>

                    <IonItem>
                        <IonSelect
                            label="Género"
                            value={genero}
                            onIonChange={e => setGenero(e.detail.value)}
                        >
                            <IonSelectOption value="femenino">Femenino</IonSelectOption>
                            <IonSelectOption value="masculino">Masculino</IonSelectOption>
                            <IonSelectOption value="otro">Otro</IonSelectOption>
                        </IonSelect>
                    </IonItem>

                    <IonItem>
                        <IonInput
                            label="Correo"
                            type="email"
                            placeholder="ejemplo@dominio.com"
                            value={correo}
                            onIonChange={e => setCorreo(e.detail.value!)}
                        />
                    </IonItem>

                    <IonItem>
                        <IonInput
                            label="Teléfono"
                            placeholder="+569 1234 5678"
                            type="tel"
                            value={telefono}
                            onIonChange={e => setTelefono(e.detail.value!)}
                        />
                    </IonItem>

                    <IonItem>
                        <IonInput
                            label="Contraseña"
                            type="password"
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
                            value={repiteClave}
                            onIonChange={e => setRepiteClave(e.detail.value!)}
                        >
                            <IonInputPasswordToggle slot="end" />
                        </IonInput>
                    </IonItem>

                    <IonButton 
                        expand="block" 
                        onClick={guardarUsuario}
                        className="ion-margin-top"
                    >
                        Registrarse
                    </IonButton>

                </IonCol>
                <IonCol size="2"></IonCol>
            </IonRow>

            <IonAlert
                isOpen={showSuccessAlert}
                onDidDismiss={() => setShowSuccessAlert(false)}
                header="¡Registro Exitoso! 🎉"
                message="El usuario se ha registrado correctamente"
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

export default RegisterUserForm;