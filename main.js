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
const db = firebase.firestore();
//Selectores
const pregunta = document.getElementById("pregunta");
const opcion1label = document.getElementById("opcion1label");
const opcion2label = document.getElementById("opcion2label");
const opcion3label = document.getElementById("opcion3label");
const opcion4label = document.getElementById("opcion4label");
const opcion1 = document.getElementById("opcion1");
const opcion2 = document.getElementById("opcion2");
const opcion3 = document.getElementById("opcion3");
const opcion4 = document.getElementById("opcion4");
const questionCounter = document.getElementById("questionNumber");
const botonNext = document.getElementById("next");
const botonresults = document.getElementById("send-results");
const botonLogin = document.getElementById("botonLogin");
const botonSignOut = document.getElementById("botonSignOut");
const botonComenzar = document.getElementById("comenzar");
const h1home = document.getElementById("h1Home");
const userBox = document.getElementById("displayUser");
const grafica = document.getElementById("grafica");
const puntuaciones = [];
const fecha = [];
//********* VARIABLES GLOBALES */
let preguntas;
let k = 0; //contador del array de preguntas
let numPregunta = 1; //contador de número de pregunta mostrada
const partida = []; //resultado de las respuestas
//**************** LOGIN CON GOOGLE ***************** */
//login con google (pop up)
const loginWithGoogle = function () {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase
    .auth()
    .signInWithPopup(provider)
    .then((result) => {
      /** @type {firebase.auth.OAuthCredential} */
      const credential = result.credential;
      const token = credential.accessToken;
      const user = result.user.displayName;
      console.log(user, "on login");
      localStorage.setItem("usuario", user);
      console.log("login con google de ", user);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.email;
      const credential = error.credential;
      console.log(errorMessage);
    });
};
//Escuchador de eventos del usuario
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    ocultar(botonLogin);
    mostrar(botonSignOut);
    mostrar(botonComenzar);
    pintarGrafica();
    mostrar(grafica);
    h1home.innerHTML = "Bienvenido " + usuarioActivo;
    //meter función pintar gráfica
    //boton acceder al quiz
    const uid = user.uid;
  } else {
  }
});
// Log out
function signOut() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      
      mostrar(botonLogin);
      ocultar(botonSignOut);
      ocultar(botonComenzar);
      ocultar(grafica);
      h1Home.innerHTML = "¡Bienvenido a nuestro nuevo Quiz!";
      localStorage.setItem("usuario", "");
      console.log("El usuario ha abandonado la sesión");
    })
    .catch((error) => {
      console.log("No se pudo  cerrar sesión correctamente");
    });
}
/********) funciones auxiliares ******** */ 
//funciones para mostrar y ocultar botones
function ocultar(element) {
  element.classList.add("display");
}
function esconder(element) {
  //Refactorizar para todos los botones
  element.classList.add("hidden");
}
function mostrar(element) {
  element.classList.remove("display");
}
// *************** QUIZ ***********************
/*leer 10 preguntas random de la api*/
async function buscarPreguntas() {
  try {
    let response = await fetch(
      `https://opentdb.com/api.php?amount=10&difficulty=easy&type=multiple`
    );
    let data = await response.json();
    let resultadosData = data.results;
    preguntas = resultadosData;
  } catch (error) {
    console.log(`ERROR: ${error.stack}`);
  }
}
function barajarOpciones(array) {
  let currentIndex = array.length,
    randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
}
async function ejecucionAsincrona() {
  await buscarPreguntas();
  await pintarPreguntas();
  await getUserProfile();
}
ejecucionAsincrona();
function pintarNumPregunta() {
  questionNumber.innerHTML = "question number " + numPregunta;
}
async function pintarPreguntas() {
  pregunta.innerHTML = preguntas[k].question;
  let opciones = [
    preguntas[k].incorrect_answers[0],
    preguntas[k].incorrect_answers[1],
    preguntas[k].incorrect_answers[2],
    preguntas[k].correct_answer,
  ];
  opciones = barajarOpciones(opciones);
  opcion1label.innerHTML = opciones[0];
  opcion1.setAttribute("value", opciones[0]);
  opcion2label.innerHTML = opciones[1];
  opcion2.setAttribute("value", opciones[1]);
  opcion3label.innerHTML = opciones[2];
  opcion3.setAttribute("value", opciones[2]);
  opcion4label.innerHTML = opciones[3];
  opcion4.setAttribute("value", opciones[3]);
  pintarNumPregunta();
}
function unCheckOptions() {
  opcion1.checked = false;
  opcion2.checked = false;
  opcion3.checked = false;
  opcion4.checked = false;
}
function checkAnswers() {
  if (opcion1.checked) {
    if (opcion1.value == preguntas[k].correct_answer) {
      partida.push(true);
    } else {
      partida.push(false);
    }
  } else if (opcion2.checked) {
    if (opcion2.value == preguntas[k].correct_answer) {
      partida.push(true);
    } else {
      partida.push(false);
    }
  } else if (opcion3.checked) {
    if (opcion3.value == preguntas[k].correct_answer) {
      partida.push(true);
    } else {
      partida.push(false);
    }
  } else if (opcion4.checked) {
    if (opcion4.value == preguntas[k].correct_answer) {
      partida.push(true);
    } else {
      partida.push(false);
    }
  }
}
async function guardarPartida() {
  db.collection("juegos")
    .add({
      usuario: localStorage.getItem("usuario"), //acceder a valor de usuario logado
      fecha: Date().slice(),
      dia:Date().slice(4,7),
      mes:Date().slice(4,7),
      anio:Date().slice(16,24),
      hora: Date().slice(),
      puntuacion: partida.filter((pregunta) => pregunta).length,
    })
    .then((docRef) => {
      console.log("Document written with ID: ", docRef.id);
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
}
//********** BOTON NEXT  ************/
botonNext.addEventListener("click", () => {
  if (
    !opcion1.checked &&
    !opcion2.checked &&
    !opcion3.checked &&
    !opcion4.checked
  ) {
    alert("Debes seleccionar al menos una opción");
  } else {
    if (k < 10) {
      checkAnswers();
      unCheckOptions();
      k++;
      numPregunta++;
      pintarPreguntas();
      if (numPregunta < 10) {
        pintarNumPregunta();
      }
      console.log("valor k " + k);
      console.log("partida", partida);
      //console.log(preguntas.results);
    }
    if (k === 9) {
      mostrar(botonFinalizar);
      esconder(botonNext);
    }
  }
});
/*************** BOTON FINALIZAR ******************/
const botonFinalizar = document.createElement("button");
botonFinalizar.type = "button";
botonFinalizar.setAttribute("id", "botonSend");
botonFinalizar.innerText = "Finalizar";
botonresults.appendChild(botonFinalizar);
ocultar(botonFinalizar);
botonFinalizar.addEventListener("click", () => {
  if (
    !opcion1.checked &&
    !opcion2.checked &&
    !opcion3.checked &&
    !opcion4.checked
  ) {
    alert("Debes seleccionar al menos una opción");
  } else {
  checkAnswers();
  unCheckOptions();
  console.log(partida);
  guardarPartida();
  ocultar(botonFinalizar);
}});
//******** RECUPERAR DATOS PARA GRAFICA ******** */
function getDatosGrafica(){
  db.collection("juegos").where("usuario", "==", localStorage.getItem("usuario"))
  .get()
  .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          console.log(doc.id, " => ", doc.data());
      });
  })
  .catch((error) => {
      console.log("Error getting documents: ", error);
  });
}
//************GRAFICA ************ */
function pintarGrafica() {
  const games = {
    // A labels array that can contain any sort of values
    labels: fechasJuegosUsuario,
    series: [[5, 2, 4, 2, 0, 6]],
  };
  const settings = {
    width: 300,
    height: 200,
  };
  // Create a new line chart object where as first parameter we pass in a selector
  // that is resolving to our chart container element. The Second parameter
  // is the actual data object.
  new Chartist.Line(".ct-chart", games, settings);
}