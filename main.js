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
const botonFinalizar = document.getElementById("buttonSend");


//********* VARIABLES GLOBALES */
let preguntas;
let k = 0; //contador del array de preguntas
let numPregunta = 1; //contador de número de pregunta mostrada
const partida = []; //resultado de las respuestas
const results = "./results.html";



/********) funciones auxiliares ******** */
//funciones para mostrar y ocultar botones
function ocultar(element) {
  if (element != null) {
    element.classList.add("display");
  }
}
function esconder(element) {
  if (element != null) {
    //Refactorizar para todos los botones
    element.classList.add("hidden");
  }
}
function mostrar(element) {
  if (element != null) {
    element.classList.remove("display");
  }
}
function meter(element) {
  if (element != null) {
    element.classList.remove("hidden");
  }
}

function mesLetraANumero(mes) {
  switch (mes) {
    case "Jan":
      mes = "01";
      break;
    case "Feb":
      mes = "02";
      break;
    case "Mar":
      mes = "03";
      break;
    case "Apr":
      mes = "04";
      break;
    case "May":
      mes = "05";
      break;
    case "Jun":
      mes = "06";
      break;
    case "Jul":
      mes = "07";
      break;
    case "Aug":
      mes = "08";
      break;
    case "Sep":
      mes = "09";
      break;
    case "Oct":
      mes = "10";
      break;
    case "Nov":
      mes = "11";
      break;
    case "Dec":
      mes = "12";
      break;
    default:
      console.log(`Mes incorrecto`);
  }
  return mes;
}

function fechasBonitas(arr) {
  const arr2 = [];
  const fechasgrafica = arr.map((fecha) => {
    let mes = fecha.slice(4, 6);
    let dia = fecha.slice(6, 8);
    let hora = fecha.slice(8, 10);
    let min = fecha.slice(10, 12);
    fecha = dia + "/" + mes + "-" + hora + ":" + min;
    arr2.push(fecha);
  });
  return arr2;
}

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
      pintarGrafica();
      mostrar(grafica);
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
    window.onload = pintarGrafica();

    //h1home.innerHTML = "Bienvenido " + usuarioActivo;
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
      console.log(error);
      console.log("No se pudo  cerrar sesión correctamente");
    });
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

/********** EJECUCION ASINCRONA *********** */

if (pregunta != null) {
  async function ejecucionAsincrona() {
    await buscarPreguntas();
    await pintarPreguntas();
  }
  ejecucionAsincrona();
}
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
if (botonNext != null) {
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
        botonFinalizar.classList.remove("hidden");
        esconder(botonNext);
      }
    }
  });
}
/*************** BOTON FINALIZAR ******************/
/* const botonFinalizar = document.createElement("button");
botonFinalizar.type = "button";
botonFinalizar.setAttribute("id", "botonSend");
botonFinalizar.innerText = "Finalizar";
botonresults.appendChild(botonFinalizar); */
// mostrar(butonSend)
// ocultar(botonFinalizar);
if (botonFinalizar != null) {
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
      sessionStorage.setItem("partida", JSON.stringify(partida));
      //sessionStorage.setITem("correctas",JSON.stringify(partida))
      window.location = results;
    }
  });
}
//******** RECUPERAR DATOS PARA GRAFICA ******** */
async function pintarGrafica() {
  let puntuaciones = []; //puntuaciones del usuario para la gráfica
  let fechas = []; //fechas de juegos para la gráfica

  db.collection("juegos")
    .where("usuario", "==", localStorage.getItem("usuario"))
    .get()
    .then(async function (querySnapshot) {
      querySnapshot.forEach(async function (doc) {
        puntuaciones.push(doc.data().puntuacion);
        fechas.push(doc.data().fecha);
      });
    })

    .then(() => {
      let datos = [];
      let arr = [];
      let fechasString = fechas.map((fecha) => {
        let anio = fecha.slice(11, 15);
        let mes = mesLetraANumero(fecha.slice(4, 7));
        let dia = fecha.slice(8, 10);
        let hora = fecha.slice(16, 18);
        let minutos = fecha.slice(19, 21);
        let segundos = fecha.slice(22, 24);
        fecha = anio + mes + dia + hora + minutos + segundos;
        arr.push(fecha);
      });

      for (let i = 0; i < fechasString.length; i++) {
        let juego = [];
        juego.push(arr[i]);
        juego.push(puntuaciones[i]);
        datos.push(juego);
      }
      datos = datos.sort();
      console.log(datos);
      return datos;
    })

    .then((datos) => {
      let fechasgrafica = [];
      for (let i = 0; i < datos.length; i++) {
        fechasgrafica.push(datos[i][0]);
      }

      let puntosgrafica = [];
      for (let i = 0; i < datos.length; i++) {
        puntosgrafica.push(datos[i][1]);
      }
      console.log(fechasBonitas(fechasgrafica));

      console.log(puntosgrafica);

      const games = {
        // A labels array that can contain any sort of values

        labels: fechasBonitas(fechasgrafica),
        series: [puntosgrafica],
      };

      const game2 = {
        lineSmooth: Chartist.Interpolation.simple({
          divisor: 2,
          fillHoles: false,
        }),
      };

      const settings = {
        axisY: {
          high: 10,
          low: 0,
          onlyInteger: true,
        },
        axisX: {
          seriesBarDistance: 1,
          scaleMinSpace: 10,
          offset: 45,
        },
      };

      new Chartist.Line(".ct-chart", games, settings, game2);
    })

    .catch((error) => {
      console.log("Error getting documents: ", error);
    });
}

//************* RESULTS ************/

if (contenedorPuntuacion != null) {
  function pintarPuntuacionFinal() {
    const jugada = JSON.parse(sessionStorage.getItem("partida"));
    const contenedorPuntuacion = document.getElementById(
      "contenedorPuntuacion"
    );
    let puntuacionFinal = jugada.filter((pregunta) => pregunta).length;
    contenedorPuntuacion.innerHTML = `Tu puntuacion final es ${puntuacionFinal}/10`;
  }
}

pintarPuntuacionFinal();

function pintarResultados() {
  const resultados = sessionStorage.getItem("correctas")
  for (k = 0; k < partida.length; k++) {
    let respuesta = document.getElementsByTagName("p")[k];
    let correcta = preguntas[k].correct_answer;
    if (partida[k] == true) {
      respuesta.innerHTML = "Pregunta" + k + "acertada";
    } else {
      respuesta.innerHTML = "La respuesta correcta era " + correcta;
    }
  }
}
