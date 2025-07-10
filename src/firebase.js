// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB9tnYV0gVIBFi-EneumlZqvrc1Jj12Uos",
  authDomain: "auth-980d8.firebaseapp.com",
  projectId: "auth-980d8",
  storageBucket: "auth-980d8.firebasestorage.app",
  messagingSenderId: "770740947353",
  appId: "1:770740947353:web:470144fa435c2ff6dfab08",
  measurementId: "G-0EB4YW65HY"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// ✅ Lo que faltaba
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// 🔁 Exportá lo que necesita tu Login.jsx
export { auth, googleProvider };
