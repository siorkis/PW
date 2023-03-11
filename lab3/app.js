"use strict";

// ADD YOUR CODE HERE
const input = document.querySelector(".todo-input");
const add_btn = document.querySelector(".todo-button");
const todo_list = document.querySelector(".todo-list");
const filter = document.querySelector(".filter-todo");

const btnCopy = document.getElementById("btnCopy");
const btnUpload = document.getElementById("btnUpload");

let rotationDirection = 1;

document.addEventListener("DOMContentLoaded", getLocalTodos); // load from local storage
document.addEventListener("DOMContentLoaded", getLocalComplete); // load from local storage 

add_btn.addEventListener("click", addTodo);
todo_list.addEventListener("click", deleteCheck);
filter.addEventListener("change", filterTodo);

btnCopy.addEventListener("click", copyTodo);
btnUpload.addEventListener("click", uploadTodo);


var audio = new Audio('reminder_sound.mp3');

// alert("Welcome back! Interesting, how many tasks will be completed today?");
setTimeout(function() {
   	audio.play();
}, 5000);


// setTimeout(function() {
//    	window.location.href = "still_here.html";
// }, 10000);

// onbeforeunload = (event) => { 
// 	todo_childrens = todo_list.getElementsByClassName("completed");

// 	for (i = 0; i < todo_childrens.length; ++i) {
// 		elem = todo_childrens[i];
// 		elem.remove();
// 	}
// 	return "Are you sure?"; 
// };



function addTodo(e) {
	rotateButton();
	if (input.value != "") {
	    todoContent(input.value);
	    //ADDING TO LOCAL STORAGE 
	    saveLocalTodos(input.value);
	    input.value = "";

	} else {
		alert("Please enter some task before.");
	}

	setTimeout(function() {
   		audio.play();
	}, 5000);
}

function deleteCheck(e) {
    const item = e.target;

    if(item.classList[0] === "trash-btn") {
        const todo = item.parentElement;
        todo.classList.add("slide");

        removeLocalTodos(todo);
        todo.addEventListener("transitionend", function() {
            todo.remove();
        });
    }

    if(item.classList[0] === "complete-btn") {
        const todo = item.parentElement;
        todo.classList.toggle("completed");
        console.log(todo);
        //saveLocalComplete(todo.outerText);
    }
}

function filterTodo(e) {
    const todos = todo_list.childNodes;
    todos.forEach(function(todo) {
        switch(e.target.value) {
            case "all": 
                todo.style.display = "flex";
                break;
            case "completed": 
                if(todo.classList.contains("completed")) {
                    todo.style.display = "flex";
                } else {
                    todo.style.display = "none";
                }
                break;
            case "incomplete":
                if(!todo.classList.contains("completed")) {
                    todo.style.display = "flex";
                } else {
                    todo.style.display = "none";
                }
                break;
        }
    });
}

function saveLocalTodos(todo) {
    let todos;
    if(localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    todos.push(todo);
    localStorage.setItem("todos", JSON.stringify(todos));
}

function getLocalTodos() {
    let todos;
    if(localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    todos.sort((a, b) => {
	  const countA = (a.match(/!/g) || []).length; // count the number of '!' characters in a
	  const countB = (b.match(/!/g) || []).length; // count the number of '!' characters in b
	  return countB - countA; // sort in descending order of '!' count
	});
    todos.forEach(function(todo) { todoContent(todo); });
}


function saveLocalComplete(todo) {
    let todoCompleted;
    if(localStorage.getItem("todoCompleted") === null) {
        todoCompleted = [];
    } else {
        todoCompleted = JSON.parse(localStorage.getItem("todoCompleted"));
    }
    todoCompleted.push(todo);
    localStorage.setItem("todoCompleted", JSON.stringify(todoCompleted));
}

function getLocalComplete() {
    let todoCompleted;
    if(localStorage.getItem("todoCompleted") === null) {
        todoCompleted = [];
    } else {
        todoCompleted = JSON.parse(localStorage.getItem("todoCompleted"));
    }
    todoCompleted.forEach(function(todo) { todoContent(todo, true); });
}


function copyTodo() {
	console.log("enter");
	let todoList;
	let copy_value;

	todoList = JSON.parse(localStorage.getItem("todos"));
	todoList = todoList.toString();
	// copy_value = window.btoa(todoList);
	copy_value = btoa(unescape(encodeURIComponent(todoList)));
	
	navigator.clipboard.writeText(copy_value);
	console.log(copy_value);
	console.log('Content copied to clipboard');
}

function uploadTodo() {
	let code = prompt("Please enter the code:");
	console.log(decodeURIComponent(escape(window.atob(code))));
	let todo_value = decodeURIComponent(escape(window.atob(code)));
	let todo_array = todo_value.split(",");
	console.log(todo_array);
	todo_array.forEach(saveLocalTodos);
	location.reload();
}


function todoContent(value, bool=false) {
	const todo_div = document.createElement("div");
    const new_todo = document.createElement("li");
    
    
    new_todo.innerText = value; 
    //console.log((value.match(/!/g) || []).length);
    let priority = (value.match(/!/g) || []).length;
    switch(priority) {
    	case 0:
    		todo_div.classList.add("todo");
    		break;
    	case 1:
    		todo_div.classList.add("todo1");
    		break;
    	case 2:
    		todo_div.classList.add("todo2");
    		break;
    	case 3:
    		todo_div.classList.add("todo3");
    		break;
    }
    

    new_todo.classList.add("todo-item");
    if (bool) {
    	new_todo.classList.add("completed");
    }
    todo_div.appendChild(new_todo);
    todoSideBtns(todo_div);
}

function todoSideBtns(new_div) {
	const completed_button = document.createElement("button");
	const trash_button = document.createElement("button");

    completed_button.innerHTML = '<i class="fas fa-check-circle"></li>';
    completed_button.classList.add("complete-btn");
    new_div.appendChild(completed_button);

    trash_button.innerHTML = '<i class="fas fa-trash"></li>';
    trash_button.classList.add("trash-btn");
    new_div.appendChild(trash_button);
    
    todo_list.appendChild(new_div);
}

function removeLocalTodos(todo) {
    let todos;
    if(localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }

    const todoIndex = todo.children[0].innerText;
    todos.splice(todos.indexOf(todoIndex), 1);
    localStorage.setItem("todos", JSON.stringify(todos));
}

function rotateButton() {
  var button = document.querySelector('.todo-button');
  if (button.classList.contains('rotate')) {
    button.classList.remove('rotate');
	setTimeout(function() {
    	button.classList.add('rotate');
    }, 50);
    rotationDirection = -rotationDirection; // switch the rotation direction
  } else {
    button.classList.add('rotate');
    rotationDirection = -rotationDirection; // switch the rotation direction
  }
}
