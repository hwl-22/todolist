const theme = document.querySelector("#theme");
const bgImg = document.querySelector(".bg-img");
const taskInput = document.querySelector(".wrapper-input input");
const taskBox = document.querySelector(".taskbox");
const filters = document.querySelectorAll(".filters p");
const itemLeft = document.querySelector("#item");
const taskLabel = document.querySelectorAll(".task");
const clearAll = document.querySelector("#clear");
const container = document.querySelector(".container")

let editId;
let isEdited = false;
let dataBase = JSON.parse(localStorage.getItem("todo-list"));

if(dataBase){
  itemLeft.innerText = dataBase.filter (({status}) => status === 'pending').length;
} else{
  itemLeft.innerText = 0;
}
render();

//Getting User's Input
taskInput.addEventListener("keyup", e => {
  
  //Validating the userInput isn't empty 
  if (e.key == "Enter" && !taskInput.value == ""){ 
    let userInput = taskInput.value;

    if (!isEdited){

      if(!dataBase) dataBase = []; // Checking if the previous data is empty or not
  
      let dataType  = {name: userInput , status: "pending"};
      dataBase.push(dataType);

    } else {

      isEdited = false;
      dataBase[editId].name = userInput;

    }

    taskInput.value = ""; // Resetting Input Form
    saveData(dataBase); // Saving Data
    render(); //Render upon user's input
    itemLeft.innerText = dataBase.filter (({status}) => status === 'pending').length; 

  }
})

//Filter View
filters.forEach(element => {
  element.addEventListener("click", () =>{ 
    if(window.innerWidth >= 1024){
      document.querySelector(".filters .active").classList.remove("active");
    } else{
      document.querySelector(".mobile-filters.filters .active").classList.remove("active");
    }
    element.classList.add("active");
    render(element.id);

    function render(filterId){
      if(dataBase) {
        let task = "";
        dataBase.forEach((element,id) => {
        let isCompleted = element.status == "completed" ? "checked" : "";
          if(filterId == element.status || filterId == "all"){
              task += `<li class="task">
              <label for="${id}">
                <input onclick="updateStatus(this)" type="checkbox" id =${id} ${isCompleted} >
                <p>${element.name}</p>
              </label>
                <div class="setting">
                  <i onclick="showSetting(this)" class="fa-solid fa-ellipsis"></i>
                  <ul class="setting-menu">
                    <li onclick="editTask(${id})"><i class="fa-solid fa-pen-to-square"></i><span>Edit</span></li>
                    <li onclick="deleteTask(${id})"><i  class="fa-solid fa-trash"></i><span>Delete</span></li>
                  </ul>
                </div>
            </li>`
          }
        });
      taskBox.innerHTML = task || `<li class ="task"><p>The list is empty </p></li>`;
      }
    }
  })
});

//Clear All
clearAll.addEventListener("click",()=>{
  
  dataBase.forEach(e => {
      
      let index = "";
      index = dataBase.findIndex( x => x.status == "completed");

      if(index !== -1){
        dataBase.splice(index,1);
        render();
        itemLeft.innerText = dataBase.filter (({status}) => status === 'pending').length;
      } 

  })
  saveData(dataBase)

})

//Functions

function saveData(dataBase){
  localStorage.setItem("todo-list", JSON.stringify(dataBase))
}

function render(){
  if(dataBase) {
    let task = "";
    dataBase.forEach((element,id) => {
    let isCompleted = element.status == "completed" ? "checked" : "";
    task += `<li class="task">
              <label for="${id}">
                <input onclick="updateStatus(this)" type="checkbox" id =${id} ${isCompleted} >
                <p>${element.name}</p>
              </label>
                <div class="setting">
                  <i onclick="showSetting(this)" class="fa-solid fa-ellipsis"></i>
                  <ul class="setting-menu">
                    <li onclick="editTask(${id})"><i class="fa-solid fa-pen-to-square"></i><span>Edit</span></li>
                    <li onclick="deleteTask(${id})"><i  class="fa-solid fa-trash"></i><span>Delete</span></li>
                  </ul>
                </div>
            </li>`
    });
  taskBox.innerHTML = task;
  }
  
}

function showSetting(e){
  e.parentElement.lastElementChild.classList.add("show") //Adding ".show" to ".setting-menu"
  window.addEventListener("click", x =>{
    if(x.target !== e|| x.target.tagName !== "I"){
      e.parentElement.lastElementChild.classList.remove("show") //Remove ".show" to ".setting-menu" when clicked
    }
  })
  

}

function updateStatus(e){
  if(e.checked == true){
    e.parentElement.lastElementChild.classList.add("checked")
    dataBase[e.id].status = "completed";
    itemLeft.innerText = dataBase.filter (({status}) => status === 'pending').length;
  } else {
    e.parentElement.lastElementChild.classList.remove("checked")
    dataBase[e.id].status = "pending";
    itemLeft.innerText = dataBase.filter (({status}) => status === 'pending').length;
  }
  saveData(dataBase);
}

function deleteTask(e){
  dataBase.splice(e,1);
  render();
  itemLeft.innerText = dataBase.filter (({status}) => status === 'pending').length;
  saveData(dataBase);
}

function editTask (e){

  editId = e;
  isEdited = true;
  taskInput.value = dataBase[e].name;
  
}

new Sortable (taskBox,{
  animation: 500
});

//Dark Mode Toggle
theme.onclick = () => {
  document.body.classList.toggle("dark-mode");
  
  if (document.body.classList.contains("dark-mode")){
    theme.src = "/images/icon-sun.svg";
    
      if(window.innerWidth >= 1024){
        bgImg.style.backgroundImage = "url(images/bg-desktop-dark.jpg)";
      } else{
        bgImg.style.backgroundImage = "url(images/bg-mobile-dark.jpg)";
      }
  } else if (!document.body.classList.contains("dark-mode")){
    theme.src = "/images/icon-moon.svg";
      
      if(window.innerWidth >= 1024){
        bgImg.style.backgroundImage = "url(images/bg-desktop-light.jpg)";
      } else{
        bgImg.style.backgroundImage = "url(images/bg-mobile-light.jpg)";
      }
  }
}

