let todoArray = [];

const createAppTitle = function (title) {
  let appTitle = document.createElement("h1");
  appTitle.textContent = title;

  return appTitle;
};

const createAppForm = function () {
  const form = document.createElement("form");
  const input = document.createElement("input");
  const btn = document.createElement("button");
  form.classList.add("d-flex", "justify-content-center", "mb-2");
  input.classList.add("form-control");
  btn.classList.add("btn", "btn-primary");
  btn.textContent = "Добавить";
  form.append(input, btn);
  btn.disabled = true;

  input.addEventListener("input", () => {
    if (input !== "") {
      btn.disabled = false;
    } else {
      btn.disabled = true;
    }
  });

  return {
    form,
    input,
    btn,
  };
};

const createAppList = function () {
  const list = document.createElement("ul");
  list.classList.add("todo-list", "list-group");

  return list;
};

const createAppItem = function (name) {
  const item = document.createElement("li");
  const btnDone = document.createElement("button");
  const btnDelete = document.createElement("button");
  const btnGroup = document.createElement("div");

  let newItemId = (arr) => {
    let max = 0;
    for (const i of arr) {
      if (i.id > max) max = i.id;
    }
    return +max + 1;
  };
  item.id = newItemId(todoArray);

  btnGroup.classList.add("btn-group");
  btnDone.classList.add("btn", "btn-success");
  btnDelete.classList.add("btn", "btn-danger");
  item.classList.add(
    "d-flex",
    "list-group-item",
    "align-items-center",
    "justify-content-between"
  );

  btnDone.textContent = "Готово";
  btnDelete.textContent = "Удалить";
  item.textContent = name;

  btnGroup.append(btnDone, btnDelete);
  item.append(btnGroup);

  return {
    item,
    btnDone,
    btnDelete,
    btnGroup,
  };
};

const changeItemDone = function (arr, item) {
  arr.map((obj) => {
    if ((obj.id === item.id) & (obj.done === false)) {
      obj.done = true;
    } else if ((obj.id === item.id) & (obj.done === true)) {
      obj.done = false;
    }
  });
};

const changeTodoItem = function (item, btn) {
  btn.addEventListener("click", function () {
    todoArray = JSON.parse(localStorage.getItem(key));
    item.classList.toggle("list-group-item-success");

    changeItemDone(todoArray, item);
    localStorage.setItem(key, JSON.stringify(todoArray));
  });
};

const deleteTodoItem = function (item, btn) {
  btn.addEventListener("click", function () {
    todoArray = JSON.parse(localStorage.getItem(key));
    if (confirm("Вы уверены ?")) {
      const newList = todoArray.filter((obj) => obj.id !== item.id);
      localStorage.setItem(key, JSON.stringify(newList));
      item.remove();
    }
  });
};

const createTodoApp = (container, title, key) => {
  appTitle = createAppTitle(title);
  appForm = createAppForm();
  applist = createAppList();
  container.append(appTitle, appForm.form, applist);

  if (localStorage.getItem(key)) {
    todoArray = JSON.parse(localStorage.getItem(key));
    for (const obj of todoArray) {
      const todoItem = createAppItem(appForm.input.value);
      todoItem.item.textContent = obj.name;
      todoItem.item.id = obj.id;

      if (obj.done === true) {
        todoItem.item.classList.add("list-group-item-success");
      } else {
        todoItem.item.classList.remove("list-group-item-success");
      }
      changeTodoItem(todoItem.item, todoItem.btnDone);
      deleteTodoItem(todoItem.item, todoItem.btnDelete);

      applist.append(todoItem.item);
      todoItem.item.append(todoItem.btnGroup);
    }
  }

  appForm.form.addEventListener("submit", (e) => {
    e.preventDefault();
    const todoItem = createAppItem(appForm.input.value);
    if (!appForm.input.value) {
      return;
    }

    changeTodoItem(todoItem.item, todoItem.btnDone);
    deleteTodoItem(todoItem.item, todoItem.btnDelete);

    let localStorageData = localStorage.getItem(key);

    if (localStorageData === null) {
      todoArray = [];
    } else {
      todoArray = JSON.parse(localStorageData);
    }

    const createTodoObj = (arr) => {
      const itemObj = {};
      itemObj.name = appForm.input.value;
      itemObj.id = todoItem.item.id;
      itemObj.done = false;
      arr.push(itemObj);
    };

    createTodoObj(todoArray);

    localStorage.setItem(key, JSON.stringify(todoArray));
    applist.append(todoItem.item);

    appForm.input.value = "";
    const btn = document.querySelector(".btn-primary");
    btn.disabled = true;
  });
};
