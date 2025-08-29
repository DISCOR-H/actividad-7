import React, { useContext, useEffect, useState } from "react";
import {
  IonContent,
  IonIcon,
  IonButton,
  IonRow,
  IonGrid,
  IonCol,
  IonItem,
  IonLabel,
  IonInput,
  useIonToast,
  IonLoading
} from "@ionic/react";
import { person, logOutOutline } from "ionicons/icons";
import { StorageContext } from "../../contexts/storageContexts";  // Ajusta la ruta según tu estructura
import { Usuario } from "../../interfaces/interfaceProfesional/interfacesProfesional";
import { useHistory } from "react-router";
import { AUTH_CONSTANTS } from "../../../constants/appConstants";

const { CLAVE_USUARIOS, CLAVE_SESION_ACTUAL } = AUTH_CONSTANTS;

function UsuarioView() {
  // Obtenemos la instancia centralizada de Storage desde el contexto
  const { storage } = useContext(StorageContext);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [present] = useIonToast();
  const history = useHistory();

  useEffect(() => {
    const init = async () => {
      // Espera a que el storage esté inicializado
      if (!storage) return;

      // Verifica autenticación (por ejemplo, comprobando un token)
      const token = await storage.get("token");
      if (!token) {
        history.push("/Login");
        return;
      }
      
      // Obtiene la sesión activa
      const sesion = await storage.get(CLAVE_SESION_ACTUAL);
      if (sesion?.tipo === "usuario") {
        // Obtiene la lista de usuarios almacenada
        const usuarios: Usuario[] = (await storage.get(CLAVE_USUARIOS)) || [];
        // Busca el usuario por ID
        const usuarioActual = usuarios.find(u => u.id === sesion.id);
        if (usuarioActual) {
          setUsuario(usuarioActual);
        } else {
          present({
            message: "Usuario no encontrado en registros",
            duration: 2000,
            color: "warning"
          });
        }
      }
      setLoading(false);
    };

    init();
  }, [storage, history, present]);

  const handleSave = async () => {
    if (!usuario || !storage) return;
    try {
      // Actualiza la lista de usuarios
      const usuarios: Usuario[] = (await storage.get(CLAVE_USUARIOS)) || [];
      const nuevosUsuarios = usuarios.map(u => u.id === usuario.id ? usuario : u);
      await storage.set(CLAVE_USUARIOS, nuevosUsuarios);

      // Actualiza la sesión activa
      await storage.set(CLAVE_SESION_ACTUAL, { 
        tipo: "usuario",
        id: usuario.id,
        correo: usuario.correo,
      });

      setEditMode(false);
      present({
        message: "Perfil actualizado con éxito ✅",
        duration: 2000,
        position: "top"
      });
    } catch (error) {
      present({
        message: "Error al guardar cambios ⚠️",
        duration: 2000,
        color: "danger"
      });
    }
  };

  const cerrarSesion = async () => {
    if (!storage) return;
    await storage.remove("token");
    await storage.remove(CLAVE_SESION_ACTUAL);
    history.push("/Login");
  };

  if (loading) {
    return (
      <IonContent className="ion-padding">
        <IonLoading isOpen={true} message="Cargando información del usuario..." />
      </IonContent>
    );
  }

  return (
    <IonContent className="ion-padding">
      <IonGrid>
        <IonRow>
          <IonCol size="12" sizeMd="6">
            <div className="ion-margin-bottom">
              <IonIcon icon={person} size="large" className="ion-margin-end" />
              <h2>{usuario ? `Bienvenido, ${usuario.nombre}!` : "Mi Perfil"}</h2>
            </div>

            {usuario && (
              <IonButton 
                color="danger" 
                onClick={cerrarSesion}
                fill="outline"
                className="ion-margin-top"
              >
                <IonIcon slot="start" icon={logOutOutline} />
                Cerrar Sesión
              </IonButton>
            )}

            {!usuario ? (
              <div className="ion-text-center">
                <p>No se encontró usuario registrado</p>
                <IonButton routerLink="/Login" className="ion-margin-top">
                  Iniciar Sesión
                </IonButton>
              </div>
            ) : (
              <>
                {/* Modo visualización */}
                {!editMode && (
                  <div className="ion-margin-bottom">
                    <IonItem>
                      <IonLabel>Nombre: {usuario.nombre}</IonLabel>
                    </IonItem>
                    <IonItem>
                      <IonLabel>Apellido: {usuario.apellido}</IonLabel>
                    </IonItem>
                    <IonItem>
                      <IonLabel>Correo: {usuario.correo}</IonLabel>
                    </IonItem>
                    <IonItem>
                      <IonLabel>Edad: {usuario.edad || "No especificada"}</IonLabel>
                    </IonItem>
                    <IonItem>
                      <IonLabel>Género: {usuario.genero}</IonLabel>
                    </IonItem>
                    <IonItem>
                      <IonLabel>Teléfono: {usuario.telefono}</IonLabel>
                    </IonItem>
                  </div>
                )}

                {/* Modo edición */}
                {editMode && (
                  <div className="ion-margin-bottom">
                    <IonItem>
                      <IonLabel position="stacked">Nombre</IonLabel>
                      <IonInput
                        value={usuario.nombre}
                        onIonChange={e => setUsuario({ ...usuario, nombre: e.detail.value! })}
                      />
                    </IonItem>
                    <IonItem>
                      <IonLabel position="stacked">Apellido</IonLabel>
                      <IonInput
                        value={usuario.apellido}
                        onIonChange={e => setUsuario({ ...usuario, apellido: e.detail.value! })}
                      />
                    </IonItem>
                    <IonItem>
                      <IonLabel position="stacked">Correo</IonLabel>
                      <IonInput
                        type="email"
                        value={usuario.correo}
                        onIonChange={e => setUsuario({ ...usuario, correo: e.detail.value! })}
                      />
                    </IonItem>
                    <IonItem>
                      <IonLabel position="stacked">Edad</IonLabel>
                      <IonInput
                        type="number"
                        value={usuario.edad?.toString() || ""}
                        onIonChange={e => setUsuario({ ...usuario, edad: parseInt(e.detail.value!) || null })}
                      />
                    </IonItem>
                    <IonItem>
                      <IonLabel position="stacked">Género</IonLabel>
                      <IonInput
                        value={usuario.genero}
                        onIonChange={e => setUsuario({ ...usuario, genero: e.detail.value! })}
                      />
                    </IonItem>
                    <IonItem>
                      <IonLabel position="stacked">Teléfono</IonLabel>
                      <IonInput
                        type="tel"
                        value={usuario.telefono}
                        onIonChange={e => setUsuario({ ...usuario, telefono: e.detail.value! })}
                      />
                    </IonItem>
                  </div>
                )}

                {/* Botones de acción */}
                <div className="ion-margin-top">
                  {!editMode ? (
                    <IonButton expand="block" onClick={() => setEditMode(true)}>
                      Editar Perfil
                    </IonButton>
                  ) : (
                    <div className="button-group">
                      <IonButton 
                        expand="block" 
                        color="success" 
                        onClick={handleSave}
                        className="ion-margin-bottom"
                      >
                        Guardar Cambios
                      </IonButton>
                      <IonButton 
                        expand="block" 
                        color="medium" 
                        onClick={() => setEditMode(false)}
                      >
                        Cancelar
                      </IonButton>
                    </div>
                  )}
                </div>
              </>
            )}
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonContent>
  );
}

export default UsuarioView;
