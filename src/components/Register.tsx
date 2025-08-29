import React, { useState, useRef } from "react";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon,
  IonRippleEffect,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react";
import { cut, person, rose, colorPalette, cube } from "ionicons/icons";
import { useHistory } from "react-router-dom"; // Importa useHistory
import "./register.css";
function register() {

  const history = useHistory(); // Obtén la función de history

  // Función para manejar el clic en la tarjeta de Usuario/a
  const envioaUsuario = () => {
    history.push("/registroUser"); // Redirige a la ruta /usuario
  };

  const envioaLocalTienda = () => {
    history.push("/registroLocal"); // Redirige a la ruta /usuario
  };


  return (
    <>
      <IonGrid>
        <IonRow>
          <IonCol size="2"></IonCol>
          <IonCol size="8">
            <IonCard color="primary" onClick={envioaLocalTienda}>
              <IonRippleEffect></IonRippleEffect>
              <IonCardHeader>
                <IonCardTitle>
                  <IonIcon icon={cube} /> Local
                </IonCardTitle>
                <IonCardSubtitle>
                  Inscribe tu Local/Tienda para poder inscribir:
                </IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent>
                <p>Barberos(as)</p>
                <p>Manicuristas</p>
                <p>Tatuadores(as)</p>
              </IonCardContent>
            </IonCard>
            <IonCard
              color="success"
              onClick={envioaUsuario}>
              <IonRippleEffect></IonRippleEffect>
              <IonCardHeader>
                <IonCardTitle>
                  <IonIcon icon={person} /> Usuario/a
                </IonCardTitle>
                <IonCardSubtitle>
                  Usuario que utilizara los distintos servicios:
                </IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent>
                <p>Barberia</p>
                <p>Manicure</p>
                <p>Tatto</p>
              </IonCardContent>
            </IonCard>
          </IonCol>
          <IonCol size="2"></IonCol>
        </IonRow>
      </IonGrid>
    </>
  );
}

export default register;
