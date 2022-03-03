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

//********* VARIABLES GLOBALES */

let preguntas;
let k = 0; //contador del array de preguntas
let numPregunta = 1; //contador de número de pregunta mostrada

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

async function ejecucionAsincrona() {
  await buscarPreguntas();
  await pintarPreguntas();
  console.log(preguntas, "este es el bueno");
}
ejecucionAsincrona();

const partida = []; //resultado de las respuestas

function pintarNumPregunta() {
  questionNumber.innerHTML = "question number " + numPregunta;
}

async function pintarPreguntas() {
  pregunta.innerHTML = preguntas[k].question;
  opcion1label.innerHTML = preguntas[k].incorrect_answers[0];
  opcion1.setAttribute("value", preguntas[k].incorrect_answers[0]);
  opcion2label.innerHTML = preguntas[k].incorrect_answers[1];
  opcion2.setAttribute("value", preguntas[k].incorrect_answers[1]);
  opcion3label.innerHTML = preguntas[k].incorrect_answers[2];
  opcion3.setAttribute("value", preguntas[k].incorrect_answers[2]);
  opcion4label.innerHTML = preguntas[k].correct_answer;
  opcion4.setAttribute("value", preguntas[k].correct_answer);
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



const user = firebase.auth().currentUser;

if (user !== null) {
  // The user object has basic properties such as display name, email, etc.
  //const displayName = user.displayName;
  const email = user.email;
  const photoURL = user.photoURL;
  const emailVerified = user.emailVerified;
  // The user's ID, unique to the Firebase project. Do NOT use
  // this value to authenticate with your backend server, if
  // you have one. Use User.getIdToken() instead.
  const uid = user.uid;
}

function guardarPartida() {
  db.collection("juegos")
    .add({
      usuario: user, //acceder a valor de usuario logado
      fecha: Date(),
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
      console.log("hola hola");
      mostrar(botonFinalizar);
      esconder(botonNext);
    }
  }
});

//*************** BOTON FINALIZAR ******************
const botonFinalizar = document.createElement("button");
botonFinalizar.type = "button";
botonFinalizar.setAttribute("id", "botonSend");
botonFinalizar.innerText = "Finalizar";
botonresults.appendChild(botonFinalizar);

botonFinalizar.addEventListener("click", () => {
  checkAnswers();
  unCheckOptions();
  console.log(partida);
  guardarPartida();
});
