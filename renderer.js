//needed global variables
let current_tasks = [];
let completed_tasks = 0;
let num_tasks = 0;
const listContainer = document.querySelector(".list-container");

//show the specific screen
function showScreen(screenId) {
  // hide all screens
  document.querySelectorAll("body > div").forEach(div => {
    div.style.display = "none";
  });

  // show the one we want
  document.getElementById(screenId).style.display = "block";
}

//set progress ring
function setProgress(percent) {
  const circle = document.querySelector(".progress-bar");
  const radius = 90;
  const circumference = 2 * Math.PI * radius;

  // set values dynamically (avoids mismatch!)
  circle.style.strokeDasharray = circumference;
  circle.style.strokeDashoffset = circumference - (percent / 100) * circumference;

  //set number text to percent
  document.getElementById("number").textContent = Math.round(percent) + "%";
}

function calculatePercent(){
  if(num_tasks > 0){
    const percent = (completed_tasks/num_tasks)*100;
    setProgress(percent);
  }
  else{
    setProgress(0);
  }
}

//add task to to-do list
function addTask(){
  const input = document.getElementById("task-text")
  const task = input.value.trim();

  if (task === "") return;

  const newIndivList = document.createElement("div");
  newIndivList.classList.add("indiv-list");

  const newItem = document.createElement("div");
  newItem.classList.add("list-item");
  newItem.textContent = "★ " + task;

  const newDelete = document.createElement("div");
  newDelete.classList.add("delete-item");
  newDelete.textContent = "X";
  newDelete.style.marginLeft = "auto";

  newDelete.addEventListener("click", function () {
    newIndivList.remove(); // removes the whole task row

    if (num_tasks > 5){
      let height = parseInt(getComputedStyle(listContainer).height);
      let newHeight = height - 61;

      listContainer.style.height = newHeight + "px";
    }
    num_tasks--;
    
    // if task was completed, reduce completed count too
    if (newItem.classList.contains("completed")) {
      completed_tasks = Math.max(completed_tasks - 1, 0);
    }

    calculatePercent();
    adjustListSize();
  });

  listContainer.appendChild(newIndivList);
  newIndivList.appendChild(newItem);
  newIndivList.appendChild(newDelete);

  current_tasks[num_tasks] = "★ " + task;
  num_tasks++;

  calculatePercent();
  adjustListSize();

  input.value = "";
}

function adjustListSize(){
  if (num_tasks >5){
    let height = parseInt(getComputedStyle(listContainer).height);
    let newHeight = height + 61;

    listContainer.style.height = newHeight + "px";
  }
}


//make text today's date
window.onload = () => {
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }; 
    document.getElementById("date").textContent = today.toLocaleDateString(undefined, options).toLowerCase();
}

// listen for clicks on any list-item
listContainer.addEventListener("click", function(e) {
  if (e.target.classList.contains("list-item")) {
    e.target.classList.toggle("completed"); // add/remove strike-through
    
    if (e.target.classList.contains("completed")) {
      completed_tasks = Math.min(completed_tasks + 1, num_tasks);
    } else {
      completed_tasks = Math.max(completed_tasks - 1, 0);
    }

    calculatePercent();
  }
});
