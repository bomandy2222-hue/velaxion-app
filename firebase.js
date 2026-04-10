import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "여기에 너 API KEY",
  authDomain: "velaxion-web.firebaseapp.com",
  projectId: "velaxion-web",
  storageBucket: "velaxion-web.appspot.com",
  messagingSenderId: "945728456758",
  appId: "1:945728456758:web:f9004c4747fe49fdbc7097"
};

const app = initializeApp(firebaseConfig);

export default app;
