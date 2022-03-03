// Your web app's Firebase configuration
let firebaseConfig = {
  apiKey: "AIzaSyDz1tQjEXFCDEWnRm9J8MzHtzXkNPhjyfU",
  authDomain: "quiz2-ce40f.firebaseapp.com",
  projectId: "quiz2-ce40f",
  storageBucket: "quiz2-ce40f.appspot.com",
  messagingSenderId: "466936444764",
  appId: "1:466936444764:web:2e5376aa50a5d2d47fb399",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const loginWithGoogle = function () {
  const provider = new firebase.auth.GoogleAuthProvider();

  firebase
    .auth()
    .signInWithPopup(provider)
    .then((result) => {
      /** @type {firebase.auth.OAuthCredential} */
      const credential = result.credential;

      // This gives you a Google Access Token. You can use it to access the Google API.
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      // ...
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      const credential = error.credential;
      // ...

      console.log(errorMessage);
    });
};

function ocultar(element) {
  element.classList.add("display");
}

function mostrar(element) {
  element.classList.remove("display");
}

const botonLogin = document.getElementById("botonLogin");
const botonSignOut = document.getElementById("botonSignOut");
const botonComenzar = document.getElementById("comenzar");

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    ocultar(botonLogin);
    mostrar(botonSignOut);
    mostrar(botonComenzar);
    
    //meter función pintar gráfica
    //boton acceder al quiz

    const uid = user.uid;
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
