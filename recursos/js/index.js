const d = document;

/* Variables globales */

const $foodName = d.getElementById("foodName"),
  $foodWeight = d.getElementById("foodWeight"),
  $foodCals = d.getElementById("foodCals"),
  $btnName = d.querySelector(".btn-name"),
  $btnWeight = d.querySelector(".btn-weight"),
  $btnCals = d.querySelector(".btn-cals"),
  $foodCardsNames = d.querySelector(".food-name"),
  $classesFoodCardsNames = $foodCardsNames.classList,
  $foodCardsWeight = d.querySelector(".food-weight"),
  $classesFoodCardsWeight = $foodCardsWeight.classList,
  $foodCardsCals = d.querySelector(".food-cals"),
  $classesFoodCardsCals = $foodCardsCals.classList,
  $foodContainer = d.querySelector(".food-container"),
  $removeFoodBtn = d.querySelector(".remove-food-btn");


let contenedorGlobal;

let globalFoodName = "",
  globalFoodWeight = "";

/* Patrones para distinguir los datos en el localStorage y demás */

let appPattern = new RegExp(" note-calories",""),
    appMark = "note-calories",
    weightPattern = /\s[0-9]+\s([a-zA-Z]{2})/;

/* ---------------------------------------------------------------- */

const insertCards = (card) => {

  $foodContainer.insertAdjacentElement("afterbegin",card);

  $foodName.classList.remove("d-none");
  $foodCals.classList.add("d-none");
  $btnName.classList.remove("d-none");
  $btnCals.classList.add("d-none");

  gettingCals();
}

const creatFoodName = (name,card) => {
  let cardfoodName = d.createElement("article"),
    parraf = d.createElement("p");


  cardfoodName.classList.add(...$classesFoodCardsNames);
  parraf.classList.add("m-0");
  parraf.innerText = name;


  cardfoodName.insertAdjacentElement("afterbegin",parraf);
  card.insertAdjacentElement("afterbegin",cardfoodName);


  $foodName.classList.add("d-none");
  $foodWeight.classList.remove("d-none");
  $btnName.classList.add("d-none");
  $btnWeight.classList.remove("d-none");
  contenedorGlobal = card;
}

const addingWeight = () => {
  
  let cardfoodWeight = d.createElement("article"),
    parraf = d.createElement("p");
  cardfoodWeight.classList.add(...$classesFoodCardsWeight);
  parraf.classList.add("m-0");
  parraf.innerText = $foodWeight.value;

  if($foodWeight.value === "") return alert("Debes completar este campo")

  console.log(globalFoodName)
  console.log(appMark)

  localStorage.setItem(`${globalFoodName} ${appMark}`,`${$foodWeight.value} gm cals`)
  
  cardfoodWeight.insertAdjacentElement("afterbegin",parraf)
  contenedorGlobal.insertAdjacentElement("beforeend",cardfoodWeight);

  $foodWeight.classList.add("d-none");
  $btnWeight.classList.add("d-none");
  $foodCals.classList.remove("d-none");
  $btnCals.classList.remove("d-none");

  contenedorGlobal = contenedorGlobal;
  globalFoodName = `${globalFoodName} ${appMark}`;
  globalFoodWeight = `${$foodWeight.value} gm`
  console.log(globalFoodName)
}


const addingCals = (e) => {
  
  let cardfoodCals = d.createElement("article"),
  parraf = d.createElement("p");

  cardfoodCals.classList.add(...$classesFoodCardsCals);
  parraf.classList.add("m-0");
  parraf.innerText = $foodCals.value;

  if($foodCals.value === "") return alert("Debes completar este campo")

  localStorage.setItem(globalFoodName,`${globalFoodWeight} ${$foodCals.value} cals`);

  cardfoodCals.insertAdjacentElement("afterbegin",parraf)
  contenedorGlobal.insertAdjacentElement("beforeend",cardfoodCals);
  let $removeFoodBtnClon = d.importNode($removeFoodBtn,true);
  contenedorGlobal.insertAdjacentElement("beforeend",$removeFoodBtnClon);

  insertCards(contenedorGlobal);

}

const addingFoods = () => {

  let name = $foodName.value;

  if(name === "") return alert("Debes ingresar un nombre")

  name = name.toUpperCase();

  if(localStorage.getItem(`${name} ${appMark}`) === null){
    localStorage.setItem(`${name} ${appMark}`,`cals`);
    let $card = d.createElement("div");
    $card.classList.add("food-cards");
    globalFoodName = name;
    creatFoodName(name,$card);
  }else{
    alert("Ese alimento ya está registrado")
  }


  /* A la llave le agrego la palabra "note-calories" para diferenciar los alimentos de los demás datos registrados en el local storage. Asi evito listar o eliminar los datos que no son de la app */
}


/* Listando los alimentos */

const putMeter = (sum) => {

  let meter = d.querySelector("meter"),
    percent = 0,
    limit = localStorage.getItem("limit-note-calories");

  limit = Number.parseInt(limit)

  percent = (sum / limit) * 100;

  console.log(percent || 0)
  meter.value = percent || 0;
  
  let title = d.querySelector(".header > h1")
  if(percent >= 90){
    title.innerHTML =  `Note-calories <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="#f3cb60" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-alert-triangle">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>`
    d.body.style.animationName = "warning";
}else{
    d.body.style.animationName = "warnin";
    title.textContent = "Note-calories"
  }

  localStorage.setItem(`meter-value-${appMark}`,percent.toString())
  
} 

const gettingCals = () => {
  
  let info = "",
    acc = 0;

  for(let el in localStorage){
    if(appPattern.test(el)){

      info = weightPattern.exec(localStorage.getItem(el));
      info = info[0].replace(" ca","");
      info = Number.parseInt(info);

      acc+= info;

    }
  }

  return putMeter(acc);

}

/*--------- Eliminando un alimento */

const deletingFoodBySelect = (e) => {

  let confirmacion = confirm("¿Estás seguro con eliminar el alimento?");

  if(confirmacion){
    let toRemove = e.path[2];
    let alimento = toRemove.children[0].children[0].textContent;
    let key = `${alimento} ${appMark}`;
    localStorage.removeItem(key);
    $foodContainer.removeChild(toRemove);
  }else{
    alert("Su selección sigue almacenada");
  }

  gettingCals();

}

/* --------Eliminando todos los alimentos */

const deleteAllFood = (e) => {

  let deleteModal = d.querySelector(".food-delete-modal");

  deleteModal.classList.replace("d-none","botonera-modal");

  d.querySelector(".delete-modal-yes").addEventListener("click",() => {
    deleteModal.classList.replace("botonera-modal","d-none");
    let confirmacion = confirm(`¿Estás seguro en eliminar toda la lista de alimentos?`);
  
    if(confirmacion){
      let childs = d.querySelectorAll(".food-cards")
    
      childs.forEach(el => {
        $foodContainer.removeChild(el)
      })
    
      for(let el in localStorage){
        if(appPattern.test(el)){
          localStorage.removeItem(el)
        }
      }

      location.reload()

    }else{
      alert("Tu lista sigue intacta.")
    }
  })

  d.querySelector(".delete-modal-no").addEventListener("click",() => {
    deleteModal.classList.replace("botonera-modal","d-none");
  })

  gettingCals();

}

/* CARGAR ALIMENTOS AL INICIO */

const loadFoodName = (name) => {
  let cardfoodName = d.createElement("article"),
    parraf = d.createElement("p"),
    food = name.replace(appPattern,"");
    
  cardfoodName.classList.add(...$classesFoodCardsNames);
  parraf.classList.add("m-0");
  parraf.innerText = food;
  cardfoodName.insertAdjacentElement("afterbegin",parraf);
  
  return {
    card: cardfoodName,
    load: loadFoodWeight(name)
  }
}

const loadFoodWeight = (name) => {

  let cardfoodWeight = d.createElement("article"),
    parraf = d.createElement("p"),
    value = localStorage.getItem(name);

  cardfoodWeight.classList.add(...$classesFoodCardsWeight); 
  parraf.classList.add("m-0");
  let text = /[0-9]+\s([a-zA-Z]{2})/.exec(value)[0];
  text = text.replace("gm","");
  parraf.textContent = `${text} ${localStorage.getItem(`${appMark} placeholder`)}`
  cardfoodWeight.insertAdjacentElement("beforeend",parraf)

  loadFoodCals(name)
  
  return {
    card: cardfoodWeight,
    load: loadFoodCals(name)
  }
}

const loadFoodCals = (name) => {

  let cardfoodCals = d.createElement("article"),
    parraf = d.createElement("p"),
    value = localStorage.getItem(name);

  cardfoodCals.classList.add(...$classesFoodCardsCals); 
  parraf.classList.add("m-0");
  parraf.innerText = /[0-9]+\s([a-zA-Z]{4})/.exec(value)[0];

  cardfoodCals.insertAdjacentElement("beforeend",parraf)

  return cardfoodCals
}

const loadFood = () => {
  let fragment = d.createDocumentFragment();
  
  for(let el in localStorage){
    let food_cards = d.createElement("div");
    food_cards.classList.add("food-cards");

    let $removeFoodBtnClone = d.importNode($removeFoodBtn,true)
    
    if(appPattern.test(el)){
      let a = loadFoodName(el);
      let name = (a.card)
      //console.log(name)
      let b = a.load;
      let weight = b.card;
      //console.log(weight);
      let cals = b.load;

      food_cards.append(name);
      food_cards.append(weight);
      food_cards.append(cals);
      food_cards.append($removeFoodBtnClone)
      
      fragment.append(food_cards);
    }
  }

  $foodContainer.prepend(fragment);

}

/* --------------MENU */

const showMenu = () => {
  let $botonera = d.querySelector(".botonera-container");

/*   $botonera.style.animationName === "fromBottom"
  console.log($botonera.style.animationName) */

  if(!($botonera.style.animationName === "fromBottom")){
    $botonera.style.display = "grid";
    $botonera.style.animationName = "fromBottom"
  }else{
    $botonera.style.animationName = "toBottom";
    setTimeout(() => {
      $botonera.style.display = "none";
    }, 600);
  }
  
}

/* ----------------LOGIN */

const mensajeDeBienvenida = (e,container) => {
  let  name = e.target.previousSibling.value,
    title = d.createElement("h2"),
    p = d.createElement("p");

  localStorage.setItem("new-note-calories",`${name}loged`);

  title.textContent = `Hola ${name}`
  p.textContent = `Un poco más para iniciar`
  container.removeChild(container.children[0]);
  container.removeChild(container.children[0]);

  container.insertAdjacentElement("afterbegin",title)
  container.insertAdjacentElement("beforeend",p)

  forWeight(container);
}

const forWeight = (container) => {

  let weight = d.createElement("input"),
    label = d.createElement("label"),
    button = d.createElement("button");

  label.for = "weightPlaceholder";
  label.textContent = "Ingresa el sistema de medidas a utilizar";
  label.classList.add("mb-2");
  weight.id = "weightPlaceholder";
  weight.name = "weightPlaceholder";
  weight.placeholder = 'Ej: "gm", "kg", "lb"';
  weight.classList.add("p-1");
  weight.classList.add("mb-2");
  button.textContent = "INICIAR";
  button.classList.add(...["btn","btn-success","w-75","btn-name"]);

  container.insertAdjacentElement("beforeend",label);
  container.insertAdjacentElement("beforeend",weight);
  container.insertAdjacentElement("beforeend",button);

  button.addEventListener("click",() => {
    if(weight.value === ""){
      alert("Este campo no puede quedar vacío")
    }else{
      forPlaceholders(weight);
      d.body.removeChild(container)
      /* Animacion para indicar donde está el menú */
      d.querySelector(".menu-btn").style.animationName = "btnMenuWelcome";
    }
  })
}

const forPlaceholders = (weight) => {
  console.log(weight.value);

  let foodWeight = d.getElementById("foodWeight");
  let texto = foodWeight.placeholder;
  foodWeight.placeholder = `${texto} en ${weight.value}`;
  localStorage.setItem(`${appMark} placeholder`,`${weight.value}`)
}

const welcome = () => {
  let yourName = d.createElement("input"),
    messageContainer = d.createElement("div"),
    btnName = d.createElement("button");

  btnName.classList.add(...["btn","btn-success","w-75","btn-name"])
  btnName.textContent = "REGISTRAR"
  yourName.placeholder = "INGRESA TU NOMBRE"
  messageContainer.classList.add("message-container");
  messageContainer.insertAdjacentElement("afterbegin",yourName)
  messageContainer.insertAdjacentElement("beforeend",btnName)
  yourName.classList.add("yourName");
  document.body.insertAdjacentElement("afterbegin",messageContainer);

  btnName.addEventListener("click",(e) => {
    mensajeDeBienvenida(e,messageContainer)
  })
}

/* --------------------CONFIG RESET */

const configReset = (e) => {
  let msg = d.createElement("div"),
    p = d.createElement("p"),
    btn_yes = d.createElement("button"),
    btn_no = d.createElement("button"),
    name = localStorage.getItem("new-note-calories");

  e.target.disabled = true;
  name = name.replace("loged",""); 
  p.textContent = `Hola ${name} ¿Quieres borrar la configuración inicial?`;
  p.style.fontWeight = "bold"
  btn_yes.textContent = "Si";
  btn_yes.style.textAlign = "center";
  btn_yes.classList.add(...["btn","btn-success","w-75"])
  btn_no.textContent = "No";
  btn_no.style.textAlign = "center";
  btn_no.classList.add(...["btn","btn-danger","w-75"])
  msg.classList.add("botonera-modal");
  msg.insertAdjacentElement("afterbegin",p);
  msg.insertAdjacentElement("beforeend",btn_yes);
  msg.insertAdjacentElement("beforeend",btn_no);
  d.body.insertAdjacentElement("beforeend",msg)

  btn_yes.addEventListener("click",() => {
    d.body.removeChild(msg)
    localStorage.removeItem("new-note-calories");
    localStorage.removeItem(`${appMark} placeholder`);
    localStorage.removeItem(`limit-note-calories`);
    localStorage.removeItem(`meter-value-note-calories`);
    deleteAllFood();
    e.target.disabled = false;
    e.target.style.pointerEvents = "all";
  })
  
  btn_no.addEventListener("click",() => {
    d.body.removeChild(msg)
    e.target.disabled = false;
    e.target.style.pointerEvents = "all";
    alert("Su configuración se mantiene")
  })
}

/* Calories limit */

const insertLimit = (e) => {
  let limit = d.createElement("input"),
  messageContainer = d.createElement("div"),
  insertBtn = d.createElement("button"),
  p = d.createElement("p"),
  $btn = d.getElementById("caloriesLimit"),
  container = d.createElement("div");

  container.id = "containerCalsLimit"
  container.style.width = "100%";
  container.style.height = "100vh";
  container.style.background = "rgba(.5,.5,.5,.5)";
  container.style.position = "fixed";
  container.style.display = "flex";
  container.style.justifyContent = "center";
  container.style.alignContent = "center";
  container.style.zIndex = "9999";

  insertBtn.classList.add(...["btn","btn-success","w-75"]);
  insertBtn.textContent = "REGISTRAR";
  p.textContent = "INGRESA EL LIMITE DE CALORIAS DE HOY";
  p.textAlign = "center";
  p.classList.add("m-0");
  messageContainer.classList.add(...["botonera-modal","p-2"]);
  messageContainer.insertAdjacentElement("afterbegin",limit)
  messageContainer.insertAdjacentElement("afterbegin",p)
  messageContainer.insertAdjacentElement("beforeend",insertBtn);
  container.insertAdjacentElement("afterbegin",messageContainer)
  limit.type = "number";
  limit.classList.add("limitCalories");
  document.body.insertAdjacentElement("afterbegin",container);

  d.addEventListener("click",(e) => {

    if(e.target === insertBtn){
      limit = limit.value.toString();
      document.body.removeChild(container);
      alert("REGISTRO DE CALORIAS EXITOSO");
      localStorage.setItem(`limit-${appMark}`,limit);
      $btn.disabled = false;
      $btn.style.pointerEvents = "all";
      console.log(messageContainer)
      location.reload();
    }
    
    if(e.target.matches("#containerCalsLimit")){
      console.log(e)
      d.body.removeChild(e.target)
      $btn.style.pointerEvents = "all";
      $btn.disabled = false;
    }
  
  })
}

/* --------------------EVENTOS------------------ */

d.addEventListener("click",e => {
  if(e.target.matches(".food-add-form .btn-name")){
    e.preventDefault();
    addingFoods(e)
    e.path[1].reset()
  }
  
  if(e.target.matches(".food-add-form .btn-weight")){
    addingWeight(e)
    e.preventDefault()
    e.path[1].reset()
  }
  
  if(e.target.matches(".food-add-form .btn-cals")){
    e.preventDefault();
    addingCals(e)
    e.path[1].reset()
  }

  if(e.target.matches(".btn-close")){
    deletingFoodBySelect(e);
  }

  if(e.target.matches("#foodDelete")){
    deleteAllFood(e);
  }

  if(e.target.matches(".menuBtn")){
    showMenu();
  }

  if(e.target.matches(".botonera-config button")){
    e.target.style.pointerEvents = "none";
    configReset(e)
  }

  if(e.target.matches("#caloriesLimit")){
    e.target.disabled = true;
    e.target.style.pointerEvents = "none";
    insertLimit(e);
  }

})

d.addEventListener("DOMContentLoaded", () => {

  if(localStorage.getItem("new-note-calories") === "loged"){
    welcome();
  }

  if(localStorage.getItem("new-note-calories") === null){
    localStorage.setItem("new-note-calories","loged")
    welcome();
  }

  if(localStorage.getItem(`${appMark} placeholder`) !== null){
    let medida = localStorage.getItem(`${appMark} placeholder`);
    $foodWeight.placeholder = `Agregar peso en ${medida}`;
    $foodCardsWeight.children[0].textContent = `Peso del alimento en ${medida}`
  }

  if(localStorage.getItem(`meter-value-${appMark}`) !== null){
    let valor = localStorage.getItem(`meter-value-${appMark}`);
    valor = Number.parseInt(valor) || 0;
    d.querySelector("meter").value = valor;
  }

  loadFood();
  gettingCals();
})