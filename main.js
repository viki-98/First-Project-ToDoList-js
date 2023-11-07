//Constant for storage
const STORAGE_KEY = 'todos'
//Constant key for storage to save ID of editing ToDo
const EDIT_TODO_KEY = 'todoId'
//Cteating default value 
localStorage.setItem(EDIT_TODO_KEY, '')
//Getting button for event listener
const addButton = document.getElementById('add-todo')
//Displaying all existing ToDos from storage. On loading page
displayAllToDos()

//Doing validation
function validation() {
  const content = document.getElementById('content').value
  const dateBox = document.getElementById('dateBox').value
  const timeBox = document.getElementById('timeBox').value
  const contentErr = document.getElementById('contentErr')
  const dateErr = document.getElementById('dateErr')
  const timeErr = document.getElementById('timeErr')

  contentErr.innerText = ''
  dateErr.innerText = ''
  timeErr.innerText = ''

  if (content === '') {
    contentErr.innerText = 'enter the task!'
    content.focus()
    return false
  }
  if (dateBox === '') {
    dateErr.innerText = 'missing the date!'
    dateBox.focus()
    return false
  }
  if (timeBox === '') {
    timeErr.innerText = 'missing the time!'
    timeBox.focus()
    return false
  }
  return true
}

//Refreshing form with default values
function clearValues() {
  document.getElementById('content').value = ''
  document.getElementById('dateBox').value = ''
  document.getElementById('timeBox').value = ''
  document.getElementById('category1').checked = true
  document.getElementById('content').focus
}

//Validating form
//Creating new ToDo and save to storage. In case of new ToDo
//Cteating new ToDo with existing Id and save to storage. In case of edit flow.
function createTodo() {
  if (!validation()) {
    return
  }
  const content = document.getElementById('content').value
  const dateBox = document.getElementById('dateBox').value
  const timeBox = document.getElementById('timeBox').value
  const categoryBusiness = document.getElementById('category1')
  const currentId = localStorage.getItem(EDIT_TODO_KEY)
  let todoId
  if (currentId.length === 0) {
    todoId = Math.ceil(Math.random() * 1000000) + ''
  } else {
    todoId = currentId
  }

  const toDo = {
    id: todoId,
    content: content,
    date: dateBox,
    time: timeBox,
    category: categoryBusiness.checked ? 'Business' : 'Personal',
  }
  saveToDoToStorage(toDo)
  displayAllToDos()
  clearValues()
}

//Save ToDo to storage 
function saveToDoToStorage(toDo) {
  const existingTodosStr = localStorage.getItem(STORAGE_KEY)

  const existingTodos =
    existingTodosStr === null ? [] : JSON.parse(existingTodosStr)

  existingTodos.push(toDo)
  const JSONToDos = JSON.stringify(existingTodos)
  localStorage.setItem('todos', JSONToDos)
}

//Getting all ToDos from storage
function getAllToDosFromStorage() {
  const toDosListStr = localStorage.getItem(STORAGE_KEY)

  const toDoList = toDosListStr === null ? [] : JSON.parse(toDosListStr)

  return toDoList
}

//Displaying all ToDos from storage
//Calculating deadLines for each ToDos
function displayAllToDos() {
  const toDos = getAllToDosFromStorage()
  const toDoList = document.getElementById('todo-list')
  toDoList.innerHTML = ''
  toDos.forEach((element) => {
    const isDeadLine = parseInt(daysBetween(Date.now(), element.date))
    const deadLineClass = `${isDeadLine <= 1 ? 'deadline' : 'full-time'}`
    const businessClass = `${
      element.category === 'Business' ? 'business' : 'personal'
    }`

    const newToDo = `
    <div class='todo-list-item ${businessClass}'>
          <div class="date-time-wrapper">
            <div class="list-item-date ${deadLineClass} ">${element.date}</div>
            <div class="${deadLineClass}" >/</div>
            <div class="list-item-time ${deadLineClass} ">${element.time}</div>
          </div>
          <button class="remove-button" onclick="deleteToDoById(${element.id})">&times;</button>
          <h2 class="list-item-title">${element.content}</h2>
          <div class="list-item-category">${element.category}</div>

          <button class="edit-button" onclick="editForm(${element.id})">Edit</button>
        </div>`
    toDoList.innerHTML += newToDo
  })
}

//Delete ToDo from storage by Id
function deleteToDoById(id) {
  const toDos = getAllToDosFromStorage()
  const filteredToDos = toDos.filter((item) => item.id != id)
  console.log(filteredToDos)
  console.log(id)

  const filteredToDosToJSON = JSON.stringify(filteredToDos)
  localStorage.setItem(STORAGE_KEY, filteredToDosToJSON)
  displayAllToDos()
}

//Function getting ToDo from storage by Id
//Loading form from founded ToDo
//Saving Id of ToDo in LocalStorage - reason: do not cteate new ToDo Id in case of edit.
//Edit - mean update existing Todo, not remove old one and create new one with new id.
//Deleting old ToDo
function editForm(toDoId) {
  const allToDos = getAllToDosFromStorage()
  console.log(allToDos)
  const currentTodo = allToDos.find((item) => item.id == toDoId)
  localStorage.setItem(EDIT_TODO_KEY, toDoId)
  console.log(currentTodo)

  document.getElementById('content').value = currentTodo.content
  document.getElementById('dateBox').value = currentTodo.date
  document.getElementById('timeBox').value = currentTodo.time

  if (currentTodo.category === 'Personal') {
    document.getElementById('category2').checked = true
  } else {
    document.getElementById('category1').checked = true
  }
  document.getElementById('add-todo').value = 'Save'
  window.scroll(0, 0)
  deleteToDoById(toDoId)
}

// Calculating date in minutes
function treatAsUTC(date) {
  const result = new Date(date)
  result.setMinutes(result.getMinutes() - result.getTimezoneOffset())
  return result
}

//Comparing 2 dates, need to check dedlines for each toDos
function daysBetween(startDate, endDate) {
  const millisecondsPerDay = 24 * 60 * 60 * 1000
  return (treatAsUTC(endDate) - treatAsUTC(startDate)) / millisecondsPerDay
}

//Adding event listener for 'add new todo' or 'Save' in case of update button 
addButton.addEventListener('click', () => {
  createTodo()
  if (addButton.value === 'Save') {
    localStorage.setItem(EDIT_TODO_KEY, '')
    addButton.value = 'Add todo'
  }
})
