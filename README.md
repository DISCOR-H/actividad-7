# actividad-7

<img width="358" height="762" alt="image" src="https://github.com/user-attachments/assets/3778de1a-0c38-4db2-8fda-dc3a2a1f2236" />
<img width="358" height="762" alt="image" src="https://github.com/user-attachments/assets/ee03a7d1-45af-45b0-93a8-38f20df296f1" />
<img width="358" height="762" alt="image" src="https://github.com/user-attachments/assets/7ba5b7d8-0653-4a20-9ada-4b2faf56ffde" />
DISCOR-H – Sistema de Citas con Firebase

Aplicación móvil desarrollada en Ionic + React que permite gestionar citas en línea con autenticación de usuarios, integración con Firebase y un diseño moderno pensado para usabilidad y escalabilidad.

✨ Características principales

✅ Registro e inicio de sesión con Firebase Auth
✅ Gestión de citas en tiempo real con Firestore
✅ Notificaciones push con Firebase Cloud Messaging (FCM)
✅ Interfaz moderna y adaptable con Ionic Framework
✅ Arquitectura modular con React Hooks y Context API
✅ Compatible con Android, iOS y Web

🛠️ Tecnologías utilizadas

Ionic Framework
 – UI y componentes nativos

React
 – Lógica y vistas

Firebase
 – Backend as a Service

Authentication

Firestore Database

Cloud Messaging

Capacitor
 – Plugins nativos

Vite
 – Bundler y servidor de desarrollo

🚀 Instalación y configuración
1️⃣ Clonar el repositorio
git clone https://github.com/tu-usuario/DISCOR-H.git
cd DISCOR-H

2️⃣ Instalar dependencias
npm install

3️⃣ Configurar Firebase

Crea un proyecto en Firebase Console

Habilita Authentication (Email/Password o Google)

Crea una base de datos en Firestore

Copia tu configuración de Firebase y colócala en el archivo:

// src/firebaseConfig.ts
export const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROJECT_ID.firebaseapp.com",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_PROJECT_ID.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

4️⃣ Ejecutar la aplicación en desarrollo
ionic serve

5️⃣ Ejecutar en Android/iOS
ionic capacitor run android
ionic capacitor run ios

📂 Estructura del proyecto
📦 DISCOR-H
 ┣ 📂 src
 ┃ ┣ 📂 Citas
 ┃ ┣ 📂 HomeBMT
 ┃ ┣ 📂 LocalesTienda
 ┃ ┣ 📂 contexts
 ┃ ┣ 📂 interfaces/interfaceProfesional
 ┃ ┣ 📂 register
 ┃ ┣ 📂 useLogin
 ┃ ┣ 📂 vistas
 ┃ ┣ 📜 Register.tsx
 ┃ ┣ 📜 register.css
 ┃ ┗ 📜 main.tsx
 ┣ 📜 package.json
 ┣ 📜 ionic.config.json
 ┣ 📜 capacitor.config.ts
 ┣ 📜 vite.config.ts
 ┗ 📜 README.md
