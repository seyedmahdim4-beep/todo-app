
const themeSwitcherBtn = document.getElementById("theme-switcher");
const bodyTag = document.querySelector("body");
const addBtn = document.getElementById("add-btn");
const todoInput = document.getElementById("addt");
const ul = document.querySelector(".todos");
const filter = document.querySelector(".filter");

function main() {
  // Theme Switcher
  themeSwitcherBtn.addEventListener("click", () => {
    bodyTag.classList.toggle("light");

    const themeImg = themeSwitcherBtn.querySelector("img");

    if (bodyTag.classList.contains("light")) {
      themeImg.src = "./assets/images/icon-moon.svg";
      themeImg.alt = "تغییر به حالت تاریک";
    } else {
      themeImg.src = "./assets/images/icon-sun.svg";
      themeImg.alt = "تغییر به حالت روشن";
    }
  });

  // Load Todos
  makeTodoElement(JSON.parse(localStorage.getItem("todos")));

  // Drag & Drop
  ul.addEventListener("dragover", (e) => {
    e.preventDefault();

    if (
      e.target.classList.contains("card") &&
      !e.target.classList.contains("dragging")
    ) {
      const draggingCard = document.querySelector(".dragging");

      if (!draggingCard) return;

      const cards = [...ul.querySelectorAll(".card")];
      const currentPos = cards.indexOf(draggingCard);
      const newPos = cards.indexOf(e.target);

      if (currentPos === -1 || newPos === -1) return;

      if (currentPos > newPos) {
        ul.insertBefore(draggingCard, e.target);
      } else {
        ul.insertBefore(draggingCard, e.target.nextSibling);
      }

      const todos = JSON.parse(localStorage.getItem("todos")) || [];
      const removed = todos.splice(currentPos, 1);

      if (removed.length) {
        todos.splice(newPos, 0, removed[0]);
        localStorage.setItem("todos", JSON.stringify(todos));
      }
    }
  });

  // Add Todo
  addBtn.addEventListener("click", () => {
    const item = todoInput.value.trim();

    if (item) {
      todoInput.value = "";

      const todos = localStorage.getItem("todos")
        ? JSON.parse(localStorage.getItem("todos"))
        : [];

      const currentTodo = {
        item: item,
        isCompleted: false,
      };

      todos.push(currentTodo);

      localStorage.setItem("todos", JSON.stringify(todos));

      makeTodoElement([currentTodo]);
    }
  });

  // Add Todo With Enter
  todoInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      addBtn.click();
    }
  });

  // Filters
  filter.addEventListener("click", (e) => {
    const id = e.target.id;

    if (id) {
      const currentActive = document.querySelector(".on");

      if (currentActive) {
        currentActive.classList.remove("on");
      }

      document.getElementById(id).classList.add("on");

      ul.className = `todos ${id}`;
    }
  });
}

// Remove Todo
function removeTodo(index) {
  const todos = JSON.parse(localStorage.getItem("todos")) || [];

  todos.splice(index, 1);

  localStorage.setItem("todos", JSON.stringify(todos));
}

// Remove Multiple Todos
function removeMultipleTodos(indexes) {
  let todos = JSON.parse(localStorage.getItem("todos")) || [];

  todos = todos.filter((todo, index) => {
    return !indexes.includes(index);
  });

  localStorage.setItem("todos", JSON.stringify(todos));
}

// Change Todo State
function stateTodo(index, isComplete) {
  const todos = JSON.parse(localStorage.getItem("todos")) || [];

  if (!todos[index]) return;

  todos[index].isCompleted = isComplete;

  localStorage.setItem("todos", JSON.stringify(todos));
}

// Create Todo
function makeTodoElement(todoArray) {
  if (!todoArray) {
    return null;
  }

  const ItemsLeft = document.querySelector("#items-left");

  todoArray.forEach((todoObject) => {
    // Create Elements
    const card = document.createElement("li");
    const cbContainer = document.createElement("div");
    const cbInput = document.createElement("input");
    const checkSpan = document.createElement("span");
    const item = document.createElement("p");
    const clearBtn = document.createElement("button");
    const img = document.createElement("img");

    // Classes
    card.classList.add("card");
    cbContainer.classList.add("cb-container");
    cbInput.classList.add("cb-input");
    checkSpan.classList.add("check");
    item.classList.add("item");
    clearBtn.classList.add("clear");

    // Attributes
    card.setAttribute("draggable", "true");
    cbInput.setAttribute("type", "checkbox");

    img.setAttribute("src", "./assets/images/icon-cross.svg");
    img.setAttribute("alt", "حذف وظیفه");

    item.textContent = todoObject.item;

    // Completed Todo
    if (todoObject.isCompleted) {
      card.classList.add("checked");
      cbInput.checked = true;
    }

    // Drag Start
    card.addEventListener("dragstart", () => {
      card.classList.add("dragging");
    });

    // Drag End
    card.addEventListener("dragend", () => {
      card.classList.remove("dragging");
    });

    // Checkbox
    cbInput.addEventListener("click", () => {
      const currentCard = cbInput.parentElement.parentElement;
      const checked = cbInput.checked;

      const currentCardIndex = [
        ...document.querySelectorAll(".todos .card"),
      ].indexOf(currentCard);

      stateTodo(currentCardIndex, checked);

      if (checked) {
        currentCard.classList.add("checked");
      } else {
        currentCard.classList.remove("checked");
      }

      ItemsLeft.textContent = document.querySelectorAll(
        ".todos .card:not(.checked)"
      ).length;
    });

    // Remove Todo
    clearBtn.addEventListener("click", () => {
      const currentCard = clearBtn.parentElement;

      currentCard.classList.add("fall");

      const indexOfCurrentCard = [
        ...document.querySelectorAll(".todos .card"),
      ].indexOf(currentCard);

      removeTodo(indexOfCurrentCard);

      currentCard.addEventListener("animationend", () => {
        setTimeout(() => {
          currentCard.remove();

          ItemsLeft.textContent = document.querySelectorAll(
            ".todos .card:not(.checked)"
          ).length;
        }, 100);
      });
    });

    // Build Todo
    clearBtn.appendChild(img);

    cbContainer.appendChild(cbInput);
    cbContainer.appendChild(checkSpan);

    card.appendChild(cbContainer);
    card.appendChild(item);
    card.appendChild(clearBtn);

    ul.appendChild(card);
  });

  ItemsLeft.textContent = document.querySelectorAll(
    ".todos .card:not(.checked)"
  ).length;
}

// Start App
document.addEventListener("DOMContentLoaded", main);

