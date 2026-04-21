document.addEventListener("DOMContentLoaded", () => {
function createProfileManager() { //creates profile template to be filled by input received
  let profileData = {
    name: "",
    email: "",
    color: ""
  }; // private (closure)

  function validate(name, email) {// validates that there are no empty boxes and that the email pattern of x@x.x is followed.
    const errors = {};

    if (!name.trim()) {
      errors.name = "Please enter your name.";
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      errors.email = "Please enter a valid email address.";
    }

    return errors;
  }

  function updateProfile(name, email, color) {//pulls input if valid inputs are given and returns them
    const errors = validate(name, email);

    if (Object.keys(errors).length > 0) {
      return { success: false, errors };
    }

    profileData = { name, email, color };
    return { success: true, data: profileData };
  }

  function getProfile() {
    return profileData;
  }

  return {
    updateProfile,
    getProfile
  };
}

const profileManager = createProfileManager();

document.getElementById("updateBtn").addEventListener("click", function () { //after update button is used, it pulls the data for updating name email and fav color
  const name = document.getElementById("name").value; //calls on the ids input in the boxes
  const email = document.getElementById("email").value;
  const color = document.getElementById("color").value;

  const result = profileManager.updateProfile(name, email, color); //result is an updated profile

  if (!result.success) {
    alert(Object.values(result.errors).join("\n"));
    return;
  }

  const profile = result.data;

  document.getElementById("displayName").textContent = profile.name;
  document.getElementById("displayEmail").textContent = profile.email;
  document.getElementById("displayColor").textContent = profile.color;
  // updates profile card border with favorite color
  if (profile.color) {
  const card = document.getElementById("profileCard");
  card.style.border = `10px solid ${profile.color}`;
  card.style.boxShadow = `0 0 15px ${profile.color}`;
  // Update top title border color
  const title = document.querySelector(".top-title");
  title.style.border = `4px solid ${profile.color}`;
  title.style.boxShadow = `0 0 15px ${profile.color}`;
  // Updates the update profile section border
  const updateBox = document.getElementById("updateProfileSec");
  updateBox.style.border = `10px solid ${profile.color}`;
  updateBox.style.boxShadow = `0 0 15px ${profile.color}`;
}

  alert("Profile updated successfully!"); //validates correct input
  document.getElementById("gif").style.display = "block"; // pops up gif on successful profile update
});

// To-Do List
let todos = [];

// Simulate external storage
function saveTodosExternally() {
  // Convert array to JSON string
  const jsonString = JSON.stringify(todos);
  // Here we simulate sending to server by saving to localStorage
  localStorage.setItem("myTodos", jsonString);
}

function loadTodosExternally() {
  // Simulate fetching from server
  const jsonString = localStorage.getItem("myTodos");
  if (jsonString) {
    todos = JSON.parse(jsonString); // convert back to array
  }
}

// Add task
document.getElementById("addToDoBtn").addEventListener("click", function () {
  const input = document.getElementById("toDoInput");
  const text = input.value.trim();
  if (!text) return;

  todos.push({ text: text, done: false }); // push()
  saveTodosExternally(); // save after adding
  renderTodos();
});

function renderTodos() {
  const list = document.getElementById("toDoList");
  list.innerHTML = "";

  const filter = document.getElementById("filterSelect").value;

  // filter()
  let filtered = todos.filter(todo => {
    if (filter === "active") return !todo.done;
    if (filter === "done") return todo.done;
    return true;
  });

  filtered.forEach((todo, index) => { // forEach()
    const li = document.createElement("li");
    li.textContent = todo.text;

    if (todo.done) li.style.textDecoration = "line-through";

    li.addEventListener("click", function () {
      todos[index].done = !todos[index].done;
      saveTodosExternally(); // save after update
      renderTodos();
    });

    list.appendChild(li); //list is appended
  });
}
document.getElementById("clearBtn").addEventListener("click", function () { //clear tasks 
  if (todos.length === 0) { 
    alert("No tasks to clear!"); //if no tasks, alert there are no tasks to clear
    return;
  }

  const confirmClear = confirm("Are you sure you want to clear all tasks?"); //verifies the action of clearing the list 
  if (!confirmClear) return;

  todos = []; // empty the array
  localStorage.removeItem("myTodos"); // clear saved data
  renderTodos(); // re-render empty list
});

// Re-render when filter changes
document.getElementById("filterSelect").addEventListener("change", renderTodos);

// Load to dos on page load
loadTodosExternally();
renderTodos();
});

// Users loading
const status = document.getElementById("status");
const dataList = document.getElementById("dataList");

document.getElementById("loadUsersBtn").addEventListener("click", async () => {
  status.textContent = "Loading..."; // loading message
  dataList.innerHTML = "";

  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    const users = await response.json();

    if (users.length === 0) {
      status.textContent = "No results found";
      return;
    }

    status.textContent = "Users loaded!";

    users.forEach(user => {
      const li = document.createElement("li");
      li.textContent = user.name;

      // click to show email (simple interaction)
      li.addEventListener("click", () => {
        alert(`Email: ${user.email}`);
      });

      dataList.appendChild(li);
    });

  } catch (error) {
    status.textContent = "Error loading data";
  }
});