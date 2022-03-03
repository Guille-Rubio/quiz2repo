// Your web app's Firebase configuration
let firebaseConfig = {
  apiKey: "AIzaSyDz1tQjEXFCDEWnRm9J8MzHtzXkNPhjyfU",
  authDomain: "quiz2-ce40f.firebaseapp.com",
  projectId: "quiz2-ce40f",
  storageBucket: "quiz2-ce40f.appspot.com",
  messagingSenderId: "466936444764",
  appId: "1:466936444764:web:2e5376aa50a5d2d47fb399",
};

//const firebase = require("firebase");
// Required for side-effects
//require("firebase/firestore");

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

//************** FUNCIONES AUXILIARES **************** */

function ocultar(element) {
  element.classList.add("display");
}

function mostrar(element) {
  element.classList.remove("display");
}

//**** Selectores  *******/
const botonLogin = document.getElementById("botonLogin");
const botonSignOut = document.getElementById("botonSignOut");
const botonComenzar = document.getElementById("comenzar");

//******************* LOGIN CON GOOGLE******************** */
const loginWithGoogle = function () {
  const provider = new firebase.auth.GoogleAuthProvider();

  firebase
    .auth()
    .signInWithPopup(provider)
    .then((result) => {
      /** @type {firebase.auth.OAuthCredential} */
      const credential = result.credential;
      const token = credential.accessToken;
      const user = result.user;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.email;
      const credential = error.credential;
      console.log(errorMessage);
    });
};



firebase.auth().onAuthStateChanged((user) => {
  usuarioActivo = user.username;
  if (user) {
    ocultar(botonLogin);
    mostrar(botonSignOut);
    mostrar(botonComenzar);

    //meter función pintar gráfica
    //boton acceder al quiz

    const uid = user.uid;
    usuarioActivo = uid;
  } else {
  }
});

function signOut() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      console.log("El usuario ha abandonado la sesión");
      mostrar(botonLogin);
      ocultar(botonSignOut);
      ocultar(botonComenzar);
    })
    .catch((error) => {
      console.log("No se pudo cerrar sesión correctamente");
    });
}
