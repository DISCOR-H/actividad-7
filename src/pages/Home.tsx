import React from "react";
import {
  IonPage,
  IonTabs,
  IonTab,
  IonTabBar,
  IonTabButton,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonButton,
  IonImg
} from "@ionic/react";
import {
  cut,
  person,
  rose,
  home,
  colorPalette,
  calendar,
  arrowForward
} from "ionicons/icons";
import "./Home.css";

// Importaciones de tus vistas (sin modificar)
import UsuarioView from "../components/vistas/vistaUsuario/usuarioView";
import TattoView from "../components/vistas/vistaTatto/tattoView";
import ManicureView from "../components/vistas/vistaManicure/ManicureView";
import BarberiaView from "../components/vistas/vistaBarberia/barberiaView"; 
// Ajusta la ruta si es diferente en tu proyecto

function Home() {
  // Arreglo con los servicios (ícono, nombre, color, ruta)
  const services = [
    { icon: cut,          name: "Barbería",    color: "primary",   route: "/barberias" },
    { icon: rose,         name: "Manicure",    color: "secondary", route: "/manicure" },
    { icon: colorPalette, name: "Tatto",       color: "tertiary",  route: "/tatto" },
    { icon: calendar,     name: "Promociones", color: "success",   route: "/promociones" },
  ];

  return (
    // IonPage como contenedor principal
    <IonPage>
      {/* IonTabs para organizar las pestañas */}
      <IonTabs>
        {/* ----------------------- PESTAÑA HOME ----------------------- */}
        <IonTab tab="home">
          {/* IonPage interno para la pantalla Home */}
          <IonPage>
            <IonHeader className="custom-header">
              <IonToolbar>
                <IonTitle>App de agenda de citas</IonTitle>
              </IonToolbar>
            </IonHeader>

            <IonContent className="content-grid">
              <IonGrid className="home-grid">
                {/* Fila 1: Encabezado / Bienvenida */}
                <IonRow>
                  <IonCol size="12">
                    <IonCard className="welcome-card">
                      {/* Ajusta la ruta del logo según tu carpeta de assets */}
                      <IonImg src="/assets/logo.png" alt="Logo" className="logo" />
                      <IonCardHeader>
                        <IonCardTitle>¡Bienvenidos!</IonCardTitle>
                        <IonCardSubtitle>Agenda tus citas fácilmente</IonCardSubtitle>
                      </IonCardHeader>
                    </IonCard>
                  </IonCol>
                </IonRow>

                {/* Fila 2: Servicios (Barbería, Manicure, Tatto, Promociones) */}
                <IonRow>
                  {services.map((service, index) => (
                    <IonCol key={index} sizeXs="6" sizeMd="3">
                      <IonCard
                        className="service-card"
                        button
                        routerLink={service.route}
                      >
                        <IonCardContent>
                          <IonIcon
                            icon={service.icon}
                            size="large"
                            color={service.color}
                            className="service-icon"
                          />
                          <h2>{service.name}</h2>
                          <IonButton
                            fill="outline"
                            size="small"
                            color={service.color}
                            className="service-button"
                          >
                            Ver más
                            <IonIcon icon={arrowForward} slot="end" />
                          </IonButton>
                        </IonCardContent>
                      </IonCard>
                    </IonCol>
                  ))}
                </IonRow>

                {/* Fila 3: Llamada a la acción (Reservar cita) */}
                <IonRow>
                  <IonCol size="12">
                    <IonCard className="cta-card">
                      <IonCardHeader>
                        <IonCardTitle>Ver tu cita</IonCardTitle>
                        <IonCardSubtitle>Fácil, rápido y seguro</IonCardSubtitle>
                      </IonCardHeader>
                      <IonCardContent>
                        <IonButton expand="block" color="primary" routerLink="/mis-citas">
                          Ver Mis Citas
                        </IonButton>
                      </IonCardContent>
                    </IonCard>
                  </IonCol>
                </IonRow>

                {/* Fila 4: Contacto o ayuda */}
                <IonRow>
                  <IonCol size="12">
                    <IonCard className="contact-card">
                      <IonCardHeader>
                        <IonCardTitle>¿Necesitas ayuda?</IonCardTitle>
                      </IonCardHeader>
                      <IonCardContent>
                        <IonButton expand="block" fill="outline" color="secondary" >
                          Contáctanos
                        </IonButton>
                      </IonCardContent>
                    </IonCard>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonContent>
          </IonPage>
        </IonTab>

        {/* -------------------- PESTAÑA BARBERÍA --------------------- */}
        <IonTab tab="barberia">
          <IonPage>
            <IonHeader className="custom-header">
              <IonToolbar>
                <IonTitle>Barberías</IonTitle>
              </IonToolbar>
            </IonHeader>
            <IonContent>
              <BarberiaView />
            </IonContent>
          </IonPage>
        </IonTab>

        {/* -------------------- PESTAÑA MANICURE --------------------- */}
        <IonTab tab="manicure">
          <IonPage>
            <IonHeader className="custom-header">
              <IonToolbar>
                <IonTitle>Manicures</IonTitle>
              </IonToolbar>
            </IonHeader>
            <IonContent>
              <ManicureView />
            </IonContent>
          </IonPage>
        </IonTab>

        {/* ---------------------- PESTAÑA USUARIO ---------------------- */}
        <IonTab tab="usuario">
          <IonPage>
            <IonHeader className="custom-header">
              <IonToolbar>
                <IonTitle>Usuario</IonTitle>
              </IonToolbar>
            </IonHeader>
            <IonContent>
              <UsuarioView />
            </IonContent>
          </IonPage>
        </IonTab>

        {/* ---------------------- PESTAÑA TATTO ---------------------- */}
        <IonTab tab="tatto">
          <IonPage>
            <IonHeader className="custom-header">
              <IonToolbar>
                <IonTitle>Tatto</IonTitle>
              </IonToolbar>
            </IonHeader>
            <IonContent>
              <TattoView />
            </IonContent>
          </IonPage>
        </IonTab>

        {/* Barra de navegación (TabBar) en la parte inferior */}
        <IonTabBar slot="bottom">
          <IonTabButton tab="home">
            <IonIcon icon={home} />
            Home
          </IonTabButton>
          <IonTabButton tab="barberia">
            <IonIcon icon={cut} />
            Barbería
          </IonTabButton>
          <IonTabButton tab="manicure">
            <IonIcon icon={rose} />
            Manicure
          </IonTabButton>
          <IonTabButton tab="tatto">
            <IonIcon icon={colorPalette} />
            Tatto
          </IonTabButton>
          <IonTabButton tab="usuario">
            <IonIcon icon={person} />
            Usuario
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonPage>
  );
}

export default Home;
