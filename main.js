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
let k = 0;
let arr;
let j = 1;

/*leer 10 preguntas random de la api*/ // FUNCIONA NO BORRAR!!!
async function buscarPreguntas() {
  //DECLARA LA FUNCION
  try {
    let response = await fetch(
      `https://opentdb.com/api.php?amount=10&difficulty=easy&type=multiple`
    );
    let data = await response.json();
    let preguntas = data.results
    arr = preguntas;
    //return data;
  } catch (error) {
    console.log(`ERROR: ${error.stack}`);
  }
}


const partida = []; //resultado de las respuestas

function pintarNumPregunta() {
  questionNumber.innerHTML = "question number " + j;
}

async function pintarPreguntas() {
  
  pregunta.innerHTML = arr[k].question;
  
  opcion1label.innerHTML = arr[k].incorrect_answers[0];
  opcion2label.innerHTML = arr[k].incorrect_answers[1];
  opcion3label.innerHTML = arr[k].incorrect_answers[2];
  opcion4label.innerHTML = arr[k].correct_answer;
  
  pintarNumPregunta();
}

async function nombre (){
await buscarPreguntas();
await pintarPreguntas();
console.log(arr, "este es el bueno");

}
nombre();

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
      k++;
      j++;
      pintarPreguntas();
      pintarNumPregunta();

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


