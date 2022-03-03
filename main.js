
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

//********* VARIABLES GLOBALES */

let numPregunta = 0;
let preguntas;
let k = 0;




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
  questionNumber.innerHTML = "question number " + (k + 1);
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
      k++;
      pintarPreguntas();
      pintarNumPregunta();
      unCheckOptions();

      //console.log(preguntas.results);
    } else if (k == 10) {
      const button1 = document.createElement("button");
      button1.type = "button";
      button1.setAttribute("id", "butonsend");
      button1.innerText = "Finalizar";
      botonresults.appendChild(button1);
    }
  }
});


