# ePayco Wallet (Billetera Digital)

Este proyecto es una billetera digital completa desarrollada con las últimas tecnologías en Frontend y Backend. Permite a los usuarios registrarse, consultar saldo, recargar billetera y realizar pagos P2P (Peer-to-Peer) con confirmación segura mediante Token OTP enviado por correo electrónico.

---

## 🚀 Tecnologías Utilizadas

### Frontend (User Interface)
- **Framework:** React + TypeScript + Vite
- **Estilos:** Tailwind CSS v3
- **Estado Global:** Redux Toolkit
- **Data Fetching:** TanStack Query (React Query)
- **Formularios:** React Hook Form + Yup
- **Íconos:** React Icons (Heroicons v2)

### Backend (API REST)
- **Framework:** NestJS (Node.js)
- **Base de Datos:** MongoDB (Mongoose / Atlas)
- **Autenticación:** Passport JWT + BCrypt
- **Email:** Nodemailer (SMTP)
- **Validación:** Class Validator + Class Transformer

---

## 📋 Prerrequisitos

Asegúrate de tener instalado:
- **Node.js** (v18 o superior)
- **Git**
- Una cuenta de **MongoDB Atlas** (o una instancia local de MongoDB)
- Una cuenta de **Gmail** (para enviar correos con la contraseña de aplicación, ver abajo)

---

## 🛠️ Instalación y Configuración

El proyecto está dividido en dos carpetas principales: `backend` y `frontend`. Debes configurar ambas para que funcionen juntas.

### 1. Configuración del Backend

1.  Navega a la carpeta del backend:
    ```bash
    cd backend
    ```

2.  Instala las dependencias:
    ```bash
    npm install
    ```

3.  Crea un archivo `.env` en la raíz de `backend` basándote en el siguiente ejemplo:
    ```env
    # backend/.env

    # Conexión a MongoDB (Reemplaza con tu URI real)
    MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/epayco-wallet?appName=Cluster0
    
    # Puerto del servidor
    PORT=3000
    
    # Clave secreta para JWT (cámbiala por una segura)
    JWT_SECRET=tu_secreto_super_seguro
    
    # Configuración de Email (Gmail SMTP)
    # Genera contraseña de aplicación en: https://myaccount.google.com/apppasswords
    MAIL_HOST=smtp.gmail.com
    MAIL_PORT=587
    MAIL_USER=tu_email@gmail.com
    MAIL_PASS=tu_password_de_aplicacion
    MAIL_FROM="ePayco Wallet" <tu_email@gmail.com>
    ```

4.  Inicia el servidor en modo desarrollo:
    ```bash
    npm run start:dev
    ```
    El backend correrá en `http://localhost:3000`.

### 2. Configuración del Frontend

1.  Abre una **nueva terminal** y navega a la carpeta del frontend:
    ```bash
    cd frontend
    ```

2.  Instala las dependencias:
    ```bash
    npm install
    ```

3.  Crea un archivo `.env` en la raíz de `frontend`:
    ```env
    # frontend/.env
    
    # URL del Backend (Asegúrate de que coincida con el puerto del backend)
    VITE_API_URL=http://localhost:3000/api
    ```

4.  Inicia la aplicación en modo desarrollo:
    ```bash
    npm run dev
    ```
    El frontend correrá en `http://localhost:5173`.

---

## 🏦 Flujos Principales

### 1. Registro e Inicio de Sesión
- Ve a `http://localhost:5173`.
- Regístrate con tus datos.
- Inicia sesión para acceder al Dashboard.

### 2. Recargar Billetera
- En el menú lateral, ve a **"Recargar Billetera"**.
- Ingresa tu documento, celular y el monto.
- El saldo se actualizará inmediatamente.

### 3. Realizar Pagos (P2P)
- Ve a **"Realizar Pago"**.
- Ingresa el **Documento** y **Celular** de la persona a quien deseas enviar dinero (Beneficiario).
- Ingresa el monto.
- Recibirás un **Token de 6 dígitos** en tu correo electrónico (el correo con el que te registraste).
- Ingresa el Token para confirmar.
- El dinero se descontará de tu cuenta y se acreditará al beneficiario.

---

## ⚠️ Consideraciones Importantes

1.  **MongoDB:** Asegúrate de que tu IP esté permitida en MongoDB Atlas (Network Access).
2.  **Gmail SMTP:** Si usas Gmail para enviar correos, es obligatorio usar una **Contraseña de Aplicación**, no tu contraseña normal.
3.  **CORS:** El backend está configurado para permitir peticiones desde cualquier origen (`enableCors()`), lo cual es aceptable para desarrollo pero debería restringirse en producción.

## 📄 Scripts Disponibles

### Backend
- `npm run start:dev`: Inicia el servidor en modo watch.
- `npm run build`: Compila el proyecto para producción.
- `npm run test`: Ejecuta pruebas unitarias.

### Frontend
- `npm run dev`: Inicia el servidor de desarrollo.
- `npm run build`: Compila la aplicación para producción.
- `npm run preview`: Vista previa del build de producción.

---

Desarrollado para la Prueba Técnica Full Stack - ePayco.
