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
let k=1
let arr=[]
/*leer 10 preguntas random de la api*/ // FUNCIONA NO BORRAR!!!
async function getUserAsync() { //DECLARA LA FUNCION 
  try {
    let response = await fetch(
      `https://opentdb.com/api.php?amount=10&difficulty=easy&type=multiple`
    );
    let data = await response.json();
    console.log(data.results)
    return data;
    
  } catch (error) {
    console.log(`ERROR: ${error.stack}`);
  }
}


async function pintarPreguntas(){
   let preguntas = await getUserAsync();
   let dat = preguntas.results[0]
   pregunta.innerHTML = dat.question;
   opcion1label.innerHTML = dat.incorrect_answers[0];
   opcion2label.innerHTML = dat.incorrect_answers[1];
   opcion3label.innerHTML = dat.incorrect_answers[2];
   opcion4label.innerHTML = dat.correct_answer;
   questionNumber.innerHTML = "question number 1";

   botonNext.addEventListener("click", () => {
    let otro = preguntas.results[k] 
    if (k < 10) {
      k++;
     questionNumber.innerHTML = "question number " + k;
     console.log(preguntas.results);
     pregunta.innerHTML = otro.question;
     opcion1label.innerHTML = otro.incorrect_answers[0];
     opcion2label.innerHTML = otro.incorrect_answers[1];
     opcion3label.innerHTML = otro.incorrect_answers[2];
     opcion4label.innerHTML = otro.correct_answer;
    } else if(k==10){
      const button1 = document.createElement('button'); 
      button1.type = 'button'; 
      button1.setAttribute("id", "butonsend")
      button1.innerText = 'Finalizar'; 
      botonresults.appendChild(button1); 
    }
  })

}
pintarPreguntas();
