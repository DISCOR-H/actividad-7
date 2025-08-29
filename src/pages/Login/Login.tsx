import React, { useContext, useState, useEffect } from "react";
import {
  IonContent,
  IonPage,
  IonInput,
  IonItem,
  IonLabel,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  IonInputPasswordToggle,
  useIonRouter,
  IonText,
  IonLoading,
  IonIcon
} from '@ionic/react';
import { useLogin } from "../../components/useLogin/useLogin";
import './Login.css';
import { StorageContext } from "../../components/contexts/storageContexts";
import { lockClosedOutline, mailOutline, logoGoogle, logoFacebook, logoX } from 'ionicons/icons';

function Login() {
  const { storage } = useContext(StorageContext);
  const [isActive, setIsActive] = useState(false);
  const [shake, setShake] = useState(false);
  
  const {
    login,
    setLogin,
    clavePass,
    setClavePass,
    error,
    formLogin,
  } = useLogin();

  const router = useIonRouter();

  useEffect(() => {
    // Animación de entrada
    const timer = setTimeout(() => setIsActive(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const resultado = await formLogin(e);
      
      if (resultado) {
        console.log('Inicio de sesión exitoso, tipo:', resultado.tipo);
        
        switch(resultado.tipo) {
          case 'profesional':
            router.push('/menuBmt', 'root', 'replace');
            break;
          case 'local':
            const localResult = resultado as { tipo: 'local', id: number, tipoLocal: string };
            switch(localResult.tipoLocal) {
              case 'manicure':
                router.push('/LocalManicurista', 'root', 'replace');
                break;
              case 'tatto':
                router.push('/LocalTatuador', 'root', 'replace');
                break;
              case 'barberia':
                router.push('/LocalBarberia', 'root', 'replace');
                break;
              default:
                router.push('/home', 'root', 'replace');
            }
            break;
          default:
            router.push('/home', 'root', 'replace');
        }
      }
    } catch (err) {
      console.error('Error during login:', err);
      // Animación de error
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding login-content">
        <div className="background-gradients">
          <div className="gradient-circle top-left"></div>
          <div className="gradient-circle bottom-right"></div>
        </div>
        
        <IonGrid className={`ion-justify-content-center ion-align-items-center ${isActive ? 'active' : ''}`} style={{ height: '100%' }}>
          <IonRow>
            <IonCol size="12" sizeMd="8" sizeLg="6" offsetMd="2" offsetLg="3">
              <IonCard className={`login-card ${shake ? 'shake' : ''}`}>
                <IonCardContent>
                  <div className="login-header">
                    <h2>Bienvenido</h2>
                    <p>Inicia sesión para continuar</p>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="login-form">
                    <IonItem className="ion-margin-bottom input-item">
                      <IonIcon icon={mailOutline} slot="start" className="input-icon" />
                      <IonInput
                        label="Correo Electrónico"
                        labelPlacement="floating"
                        placeholder="Ingresa tu correo"
                        type="email"
                        required
                        clearInput={true}
                        value={login}
                        onIonChange={(e) => setLogin(e.detail.value!)}
                        className="animated-input"
                      />
                    </IonItem>

                    <IonItem className="ion-margin-bottom input-item">
                      <IonIcon icon={lockClosedOutline} slot="start" className="input-icon" />
                      <IonInput
                        label="Contraseña"
                        labelPlacement="floating"
                        placeholder="Ingresa tu contraseña"
                        type="password"
                        required
                        value={clavePass}
                        onIonChange={(e) => setClavePass(e.detail.value!)}
                        className="animated-input"
                      >
                        <IonInputPasswordToggle slot="end" />
                      </IonInput>
                    </IonItem>

                    <div className="forgot-password">
                      <a href="/forgot-password">¿Olvidaste tu contraseña?</a>
                    </div>

                    {error && (
                      <IonText color="danger" className="ion-text-center ion-margin-bottom error-message">
                        {error}
                      </IonText>
                    )}

                    <IonButton
                      expand="block"
                      type="submit"
                      className="login-button"
                    >
                      Iniciar Sesión
                    </IonButton>

                    <div className="divider">
                      <span>o continua con</span>
                    </div>

                    <div className="social-login">
                      <IonButton fill="clear" className="social-button google">
                        <IonIcon icon={logoGoogle} slot="start" />
                        Google
                      </IonButton><tr></tr>
                      <IonButton fill="clear" className="social-button facebook">
                        <IonIcon icon={logoFacebook} slot="start" />
                        Facebook
                      </IonButton><tr></tr>
                      <IonButton fill="clear" className="social-button x">
                        <IonIcon icon={logoX} slot="start" />
                        
                      </IonButton>
                    </div>

                    <IonText className="ion-text-center register-text">
                      <p>¿No tienes una cuenta? <a href="/Register">Regístrate</a></p>
                    </IonText>
                  </form>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
}

export default Login;