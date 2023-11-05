import * as mainScript from "./script.js";

const addTaskElem = document.querySelector(".js-task-adding-form");
const button = document.querySelector(".btn.btn-info");


document.addEventListener("DOMContentLoaded", function () {
	const navBrand = document.querySelector("body > header > nav");
	navBrand.style.backgroundColor = "#17a2b8";
	navBrand.style.fontSize = "24px";
	navBrand.style.color = "black";
  });

// Render tasks to page
function renderTask(taskId, title, description, status) {
  const section = document.createElement("section");
  const div = document.createElement("div");
  div.className =
    "card-header d-flex justify-content-between align-items-center";
  section.className = "card mt-5 shadow-sm";
  document.querySelector("main").appendChild(section).appendChild(div);

  const leftdiv = document.createElement("div");
  div.appendChild(leftdiv);

  const h5 = document.createElement("h5");
  h5.innerText = title;
  leftdiv.appendChild(h5);

  const h6 = document.createElement("h6");
  h6.innerText = description;
  h6.className = "card-subtitle text-muted";
  leftdiv.appendChild(h6);

  const rightdiv = document.createElement("div");
  div.appendChild(rightdiv);
  if (status == "open") {
    const finishButton = document.createElement("button");
    finishButton.className = "btn btn-dark btn-sm js-task-open-only";
    finishButton.innerText = "Finish";
    rightdiv.appendChild(finishButton);
    finishButton.dataset.id = taskId;
    finishButton.dataset.title = title;
    finishButton.addEventListener("click", finishProject);
  }
  const deleteButton = document.createElement("button");
  deleteButton.className = "btn btn-outline-danger btn-sm ml-2";
  deleteButton.innerText = "Delete";
  rightdiv.appendChild(deleteButton);
  const opDiv = document.createElement("div");
  const ul = document.createElement("ul");
  div.parentElement.append(opDiv);
  opDiv.append(ul);
  if (status == "open") {
    const operations = getOperations(taskId, ul);
  }
  deleteButton.dataset.taskId = taskId;
  deleteButton.addEventListener("click", deleteTask);
  if (status == "closed") getClosedOperations(taskId, ul, title);
}

// Adding Tasks
function postTask(title, description) {
  const PostHeaders = {
    headers: { Authorization: apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({
      title: title,
      description: description,
      status: "open",
    }),
    method: "POST",
  };
  return fetch(apiHost + "/api/tasks", PostHeaders).then(function (resp) {
    if (!resp.ok) {
      alert(
        "An error occurred! Open devtools and the Network tab, and locate the cause"
      );
    } else return location.reload();
  });
}

function taskAdd(event) {
  event.preventDefault();
  const title = addTaskElem.elements.title.value;
  const description = addTaskElem.elements.description.value;
  const childrenNum = button.parentElement.children.length;

  if (!title.length || !description.length)
    alert("Both title and description fields must be completed");
  else {
    if (title.length >= 5 && description.length >= 5)
      postTask(title, description);
    else {
      if (!document.querySelector("#taskAddError"))
        createError(button);
    }
  }
}

async function getAllTasks() {
  const result = apiListTasks();
  const data = await result;
  data.forEach((task) =>
    renderTask(task.id, task.title, task.description, task.status)
  );
}

button.addEventListener("click", taskAdd);

getAllTasks();
