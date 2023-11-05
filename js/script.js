const apiKey = ""; // API KEY AND HOST REMOVED FOR PRIVACY. SET YOUR OWN FOR IT TO WORK!
const apiHost = ""; // API KEY AND HOST REMOVED FOR PRIVACY. SET YOUR OWN FOR IT TO WORK!
const keys = { Authorization: apiKey };
const getHeader = {
	method: "GET",
	headers: keys,
  };

// Error message
function createError(buttonElem) {
	const pa = document.createElement("p");
	pa.setAttribute("id", "taskAddError");
	pa.innerText =
	  "Minimum 5 characters required for title and description";
	pa.style.fontSize = "12px";
	pa.style.padding = "20px";
	pa.style.color = "red";
	buttonElem.parentElement.appendChild(pa);
}

function apiListTasks() {
  const promise = fetch(apiHost + "/api/tasks", getHeader)
    .then((response) => response.json())
    .then((resp) => {
      if (!resp) {
        return alert("Problem connecting with API");
      } else return resp.data;
    });
  return promise;
}

// Deleting Tasks
function deleteTask() {
  const url = apiHost + "/api/tasks/" + this.dataset.taskId;
  const DelHeaders = {
    headers: { Authorization: apiKey },
    method: "DELETE",
  };
  return fetch(url, DelHeaders).then(function (resp) {
    if (!resp.ok) {
      alert("An error occurred while attempting to delete task!");
    } else return location.reload();
  });
}

// Deleting Task Operations
function deleteTaskOps() {
  const parentEl = this.parentElement.parentElement;
  const url = apiHost + "/api/operations/" + this.dataset.opId;
  const DelHeaders = {
    headers: { Authorization: apiKey },
    method: "DELETE",
  };
  return fetch(url, DelHeaders).then((resp) => {
    if (!resp.ok) {
      alert("An error occurred while attempting to delete task!");
    } else {
 
      return parentEl.parentElement.removeChild(parentEl);
    }
  });
}

// Add Time to Operation
function addTime() {
  const url = apiHost + "/api/operations/" + this.dataset.id;
  const PostHeaders = {
    headers: { Authorization: apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({
      timeSpent: this.dataset.time,
      description: this.dataset.desc,
    }),
    method: "PUT",
  };
 
  return fetch(url, PostHeaders).then(function (resp) {
    if (!resp.ok) {
      alert("An error occurred! Unable to add time");
    } else return location.reload();
  });
}

// Add operation helpers
function addOperationHelper(ul, element) {
  const li = document.createElement("li");
  li.className =
    "list-group-item d-flex justify-content-between align-items-center";
  ul.appendChild(li);

  const descDiv = document.createElement("div");
  descDiv.innerText = element.description;
  li.appendChild(descDiv);
  const time = document.createElement("span");
  formatTime(element.timeSpent, time);
  descDiv.appendChild(time);
  if (open) {
    const maindiv = document.createElement("div");
    maindiv.className = "js-task-open-only";
    const plus15 = document.createElement("button");
    plus15.innerText = "+15m";
    plus15.className = "btn btn-outline-success btn-sm mr-2";

    const plus60 = document.createElement("button");
    plus60.className = "btn btn-outline-success btn-sm mr-2";
    plus60.innerText = "+1h";

    const deleteButton = document.createElement("button");
    deleteButton.className = "btn btn-outline-danger btn-sm ml-2";
    deleteButton.innerText = "Delete";
    li.append(maindiv);
    maindiv.append(plus15);
    maindiv.append(plus60);
    maindiv.append(deleteButton);
    deleteButton.dataset.opId = element.id;
    deleteButton.dataset.liEl = li;
    plus15.dataset.time = element.timeSpent + 15;
    plus15.dataset.id = element.id;
    plus15.dataset.desc = element.description;
    plus60.dataset.desc = element.description;
    plus60.dataset.id = element.id;
    plus60.dataset.time = element.timeSpent + 60;
    deleteButton.addEventListener("click", deleteTaskOps);
    plus15.addEventListener("click", addTime);
    plus60.addEventListener("click", addTime);
  }
}

// For when adding new task without reloading page
function addOperationHelper2(ul, description, id) {
  const priorEl = ul.children[ul.children.length - 1];
  const descDiv = document.createElement("div");
  const li = document.createElement("li");
  li.className =
    "list-group-item d-flex justify-content-between align-items-center";
  ul.insertBefore(li, priorEl);
  descDiv.innerText = description;
  li.appendChild(descDiv);
  const time = document.createElement("span");
  formatTime(0, time);
  descDiv.appendChild(time);
  if (open) {
    const maindiv = document.createElement("div");
    maindiv.className = "js-task-open-only";
    const plus15 = document.createElement("button");
    plus15.innerText = "+15m";
    plus15.className = "btn btn-outline-success btn-sm mr-2";

    const plus60 = document.createElement("button");
    plus60.className = "btn btn-outline-success btn-sm mr-2";
    plus60.innerText = "+1h";

    const deleteButton = document.createElement("button");
    deleteButton.className = "btn btn-outline-danger btn-sm ml-2";
    deleteButton.innerText = "Delete";
    li.append(maindiv);
    maindiv.append(plus15);
    maindiv.append(plus60);
    maindiv.append(deleteButton);
    deleteButton.dataset.opId = id;
    deleteButton.dataset.liEl = li;
    plus15.dataset.time = 15;
    plus15.dataset.id = id;
    plus15.dataset.desc = description;
    plus60.dataset.desc = description;
    plus60.dataset.id = id;
    plus60.dataset.time = 60;
    deleteButton.addEventListener("click", deleteTaskOps);
    plus15.addEventListener("click", addTime);
    plus60.addEventListener("click", addTime);
  }
}

// Add operations
async function apiCreateOperationForTask(taskId, description, ul) {
  {
    if (description.length >= 5) {
      const PostOpsHeaders = {
        headers: { Authorization: apiKey, "Content-Type": "application/json" },
        body: JSON.stringify({ description: description, timespent: "0" }),
        method: "POST",
      };
      const promise = fetch(
        apiHost + "/api/tasks/" + taskId + "/operations",
        PostOpsHeaders
      ).then(function (resp) {
        if (!resp.ok) {
          alert(
            "An error occurred! Open devtools and the Network tab, and locate the cause"
          );
        } else {
          return resp.json();
        }
      });
      const data = await promise;
      addOperationHelper2(ul, description, data.data.id);
    }
  }
}

// Add form so as to add operations to task
function addOperationForm(taskId, ul) {
  const form = document.createElement("form");
  const inputGroup = document.createElement("div");
  inputGroup.className = "input-group";
  ul.appendChild(form);
  form.appendChild(inputGroup);

  const descInput = document.createElement("input");
  descInput.setAttribute("type", "text");
  descInput.setAttribute("placeholder", "Enter Operation Description");
  descInput.setAttribute("minlength", "5");
  descInput.className = "form-control";
  inputGroup.appendChild(descInput);

  const iGAppend = document.createElement("div");
  iGAppend.className = "input-group-append";
  inputGroup.appendChild(iGAppend);

  const addButton = document.createElement("button");
  addButton.className = "btn btn-info";
  addButton.innerText = "Add";
  inputGroup.appendChild(addButton);

  addButton.addEventListener("click", (event) => {
	if (document.querySelector("#taskAddError"))
		document.querySelector("#taskAddError").parentElement.remove(document.querySelector("#taskAddError"))
    event.preventDefault();
	if (descInput.value.length >= 5) {
    	apiCreateOperationForTask(taskId, descInput.value, ul);
		descInput.value = "";
	} else {
		if (!document.querySelector("#taskAddError"))
        	createError(addButton.parentElement);
	}
  });
}

// Get Operations
async function getOperations(taskId, ul) {
  const url = apiHost + "/api/tasks/" + taskId + "/operations";
  const promise = fetch(url, getHeader)
    .then((response) => response.json())
    .then((data) => data.data);
  const data = await promise;
  if (!data) alert("Error retrieving operations data!");

  data.forEach((element) => {
    addOperationHelper(ul, element);
  });
  addOperationForm(taskId, ul);
}

async function getClosedOperations(taskId, ul, title) {
  const url = apiHost + "/api/tasks/" + taskId + "/operations";
  const promise = fetch(url, getHeader)
    .then((response) => response.json())
    .then((data) => data.data);
  const data = await promise;
  if (!data) alert("Error retrieving operations data!");
  else {
    data.forEach((element) => (element) => {
      const descDiv = document.createElement("div");
      const li = document.createElement("li");
      li.className =
        "list-group-item d-flex justify-content-between align-items-center";
      ul.appendChild(li);
      descDiv.innerText = element.description;
      li.appendChild(descDiv);
    });
  }
}

// Format time
function formatTime(timeSpent, time) {
  time.className = "badge badge-success badge-pill ml-2";
  if (timeSpent >= 60) {
    const hours = Math.floor(timeSpent / 60);
    const minutes = timeSpent % 60;
    time.innerText = hours + "h";
    if (minutes != 0) time.innerText += (timeSpent % 60) + "m";
  } else time.innerText = timeSpent + "m";
}

// Mark project as finished
function finishProject() {
  const url =  apiHost + "/api/tasks/" + this.dataset.id;
  const _title = this.dataset.title;
  const FinishHeaders = {
    headers: { Authorization: apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({
      title: _title,
      description: "TASK FINISHED!",
      status: "Closed",
    }),
    method: "PUT",
  };
  return fetch(url, FinishHeaders).then((resp) => {
    if (!resp.ok) {
      alert("An error occurred while attempting to finish task!");
    } else {
      return location.reload();
    }
  });
}
