import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent
} from '@ionic/react';
import {
  logIn,
  cut,
  colorPalette,
  body,
  sparkles,
  arrowForward,
  time,
  checkmarkCircle,
  people
} from 'ionicons/icons';
import './index.css';

const WelcomePage: React.FC = () => {
  const [activeService, setActiveService] = useState(0);

  const services = [
    { icon: cut, name: 'Barbería', color: '#FF9E44' },
    { icon: colorPalette, name: 'Manicure', color: '#FF6B8B' },
    { icon: body, name: 'Tatuajes', color: '#4CD97B' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveService((prev) => (prev + 1) % services.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <IonPage>
      <IonHeader className="main-header">
        <IonToolbar className="toolbar-custom">
          <div className="header-container">
            {/* Logo */}
            <div className="logo">
              <img src="/assets/logo.png" alt="StyleReserve Logo" className="logo-img" />
              <span className="logo-text">StyleReserve</span>
            </div>

            {/* Nav */}
            <div className="nav-links">
              <a href="#inicio" className="nav-link">Inicio</a>
              <a href="#quienes-somos" className="nav-link">Quiénes Somos</a>
              <a href="#contacto" className="nav-link">Contacto</a>
              <a href="/profesionales" className="nav-link">Profesionales</a>
            </div>

            {/* Login */}
            <div className="login-area">
              <IonButton routerLink="/login" className="login-button">
                <IonIcon slot="start" icon={logIn} />
                Iniciar Sesión
              </IonButton>
            </div>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        {/* HERO */}
        <div className="hero-section" id="inicio">
          <div className="hero-content">
            <h1 className="hero-title">
              Transforma tu estilo <br />
              <span className="highlight">con un solo click</span>
            </h1>
            <p className="hero-subtitle">
              Reserva con los mejores profesionales de belleza y body art
            </p>
            <div className="service-display">
              <IonIcon
                icon={services[activeService].icon}
                style={{ color: services[activeService].color }}
                className="service-icon"
              />
              <p className="service-name">{services[activeService].name}</p>
            </div>
            <IonButton routerLink="/register" className="main-cta">
              Reserva ahora
              <IonIcon icon={arrowForward} slot="end" />
            </IonButton>
          </div>
        </div>

        {/* FEATURES */}
        <div className="features-section" id="quienes-somos">
          <h2 className="section-title">¿Por qué elegirnos?</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <IonCard className="feature-card" key={index}>
                <IonCardContent>
                  <div className="feature-icon-container">
                    <IonIcon icon={feature.icon} className="feature-icon" />
                  </div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </IonCardContent>
              </IonCard>
            ))}
          </div>
        </div>

        {/* SERVICIOS */}
        <div className="services-section" id="contacto">
          <h2 className="section-title">Nuestros servicios</h2>
          <div className="services-grid">
            {services.map((service, index) => (
              <div className="service-card" key={index}>
                <div
                  className="service-icon-container"
                  style={{ backgroundColor: `${service.color}20` }}
                >
                  <IonIcon
                    icon={service.icon}
                    style={{ color: service.color }}
                    className="service-card-icon"
                  />
                </div>
                <h3 className="service-card-title">{service.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

const features = [
  {
    icon: time,
    title: 'Reserva instantánea',
    description: 'Agenda en segundos, disponible 24/7',
  },
  {
    icon: checkmarkCircle,
    title: 'Profesionales verificados',
    description: 'Expertos certificados',
  },
  {
    icon: sparkles,
    title: 'Resultados garantizados',
    description: 'Calidad premium',
  },
  {
    icon: people,
    title: 'Comunidad exclusiva',
    description: 'Eventos y promociones',
  },
];

export default WelcomePage;
