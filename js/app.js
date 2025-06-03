const createBtn = document.querySelector("#createBtn")
const board = document.querySelector("#board")

const createForm = document.querySelector("#createForm")
const cancelCreate = document.querySelector("#cancelCreate")
const addBtn = document.querySelector("#addBtn")
const taskNameIn = document.querySelector("#taskNameIn")
const descriptionIn = document.querySelector("#descriptionIn")

const updateForm = document.querySelector("#updateForm")
const cancelUpdate = document.querySelector("#cancelUpdate")
const updateSaveBtn = document.querySelector("#updateSaveBtn")
const updateNameIn = document.querySelector("#updateTaskNameIn")
const updateDescriptionIn = document.querySelector("#updateDescriptionIn")

const deleteForm = document.querySelector("#deleteForm")
const cancelDelete = document.querySelector("#cancelDelete")
const deleteBtn = document.querySelector("#deleteBtn")

const aLine = document.querySelector('.aLine')
const bLine = document.querySelector('.bLine')

const settingsBtn = document.querySelector('.settingsIcon')
const settings = document.querySelector('.settings')
const backSettingsBtn = document.querySelector('#backSettingsBtn')

const themeChangeInp = document.querySelector('#changeThemeInp')

let count = 0
let tempTaskObj
let tempKey
let taskList = new Map()
let editDisplayed = false
let theme='dark'

taskList.set('1', {
    taskName: "Read for 20 minutes",
    description: "Read a book, article and feed your brain",
    status: true
})
taskList.set('2', {
    taskName: "Take a power nap",
    description: "Taking a power nap will boost your creativity",
    status: false
})
taskList.set('3', {
    taskName: "Work on project",
    description: "Work on your projects",
    status: false
})
//EventListeners
window.addEventListener('load', updateData)
window.addEventListener('popstate',goBack)
createBtn.addEventListener('click', showTaskForm)
cancelCreate.addEventListener('click', hideTaskCreate)
addBtn.addEventListener('click', addTask)
cancelUpdate.addEventListener('click', hideUpdateTask)
updateSaveBtn.addEventListener('click', updateTask)
cancelDelete.addEventListener('click', hideDeleteTask)
deleteBtn.addEventListener('click', deleteTask)
document.addEventListener('click', clearEdits)
settingsBtn.addEventListener('click', openSettings)
backSettingsBtn.addEventListener('click', closeSettings)
themeChangeInp.addEventListener('change', changeTheme)

//Functions
function showTaskForm() {
    taskNameIn.value = ''
    descriptionIn.value = ''
    createForm.classList.remove("hide")
    createForm.classList.add("flex")
}
function hideTaskCreate() {
    createForm.classList.add("hide")
    createForm.classList.remove("flex")
}
function addTask() {
    if (taskNameIn.value != '') {
        taskList.set(++count, {
            taskName: taskNameIn.value,
            description: descriptionIn.value,
            status: false
        })
        hideTaskCreate();
        updateBoard();
    }
}
function updateData() {
    loadTheme()
    const taskArray = localStorage.getItem('taskList')
    if (taskArray != null) {
        taskList = new Map(JSON.parse(taskArray))
    }
    updateBoard()
    let a = [...taskList]
    if (a.length != 0) {
        count = a[a.length - 1][0]
    }
}
function updateStorage() {
    localStorage.setItem('taskList', JSON.stringify(Array.from(taskList)));
}
function updateBoard() {
    board.innerHTML = ''
    if (taskList.size == 0) {
        const noTaskMsg = document.createElement('div');
        noTaskMsg.textContent = "No tasks?"
        noTaskMsg.className = "noTaskMsg text-center w-100"
        board.appendChild(noTaskMsg)
    }
    taskList.forEach((task, key) => {
        const record = document.createElement('div')
        const tName = document.createElement('div')
        const tDescription = document.createElement('div')
        const tNameDesc = document.createElement('div')
        const miniRec = document.createElement('div')
        const checkboxContainer = document.createElement('div')
        const checkbox = document.createElement('input')
        const tUpdate = document.createElement('div')
        const tDelete = document.createElement('div')
        const tEdit = document.createElement('div')
        const tUpdateIcon = document.createElement('img')
        const tDeleteIcon = document.createElement('img')

        record.className = "record flex flex-col"
        tName.className = "tName"
        tDescription.className = "tDescription"
        tNameDesc.className = "tName-Desc"
        miniRec.classList = "miniRec flex"
        checkboxContainer.className = "checkboxContainer flex justify-end items-center"
        checkbox.className = "tcheckbox"
        tEdit.className = "tEdit w-100 hide justify-center"
        tUpdate.className = "tUpdate flex justify-center items-center"
        tDelete.className = "tDelete flex justify-center items-center"
        tUpdateIcon.className = "tUpdateIcon"
        tDeleteIcon.className = "tDeleteIcon"

        tName.textContent = task.taskName
        tDescription.textContent = task.description
        tUpdateIcon.src = 'icons/update.svg'
        tDeleteIcon.src = 'icons/trash.svg'

        checkbox.type = "checkbox"

        if (task.status == true) {
            checkbox.checked = true
        }
        else {
            checkbox.checked = false
        }
        record.addEventListener('click', (ev) => {
            if (ev.target != checkbox) {
                editDisplayed = true
                ev.stopPropagation()
                tEdit.classList.toggle('flex')
                tEdit.classList.toggle('hide')
            }
        })
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                task.status = true
            }
            else {
                task.status = false
            }
            updateStorage()
            updateProgressBar()
        })

        tUpdate.addEventListener('click', () => {
            tempTaskObj = task
            updateNameIn.value = tempTaskObj.taskName
            updateDescriptionIn.value = tempTaskObj.description
            updateForm.classList.remove("hide")
            updateForm.classList.add("flex")
        })
        tDelete.addEventListener('click', () => {
            tempKey = key
            deleteForm.classList.add("flex")
            deleteForm.classList.remove("hide")
        })

        tNameDesc.appendChild(tName)
        tNameDesc.appendChild(tDescription)
        checkboxContainer.appendChild(checkbox)
        tUpdate.appendChild(tUpdateIcon)
        tDelete.appendChild(tDeleteIcon)
        tEdit.appendChild(tUpdate)
        tEdit.appendChild(tDelete)

        miniRec.appendChild(tNameDesc)
        miniRec.appendChild(checkboxContainer)
        record.appendChild(miniRec)
        record.appendChild(tEdit)
        board.appendChild(record)
    })
    updateStorage();
    updateProgressBar()
}

function hideUpdateTask() {
    updateForm.classList.add("hide")
    updateForm.classList.remove("flex")
}
function updateTask() {
    tempTaskObj.taskName = updateNameIn.value
    tempTaskObj.description = updateDescriptionIn.value
    tempTaskObj = null
    hideUpdateTask()
    updateBoard()
}
function deleteTask() {
    taskList.delete(tempKey)
    hideDeleteTask()
    updateBoard()
}
function hideDeleteTask() {
    deleteForm.classList.add("hide")
    deleteForm.classList.remove("flex")
}
function clearEdits() {
    if (editDisplayed) {
        document.querySelectorAll('.tEdit').forEach((edit) => {
            if (edit.classList.contains('flex')) {
                edit.classList.add('hide')
                edit.classList.remove('flex')
            }
        })
        editDisplayed = false
    }
}
function updateProgressBar() {
    let ct = 0
    let size = taskList.size;
    taskList.forEach((task) => {
        if (task.status == true) {
            ct++
        }
    })
    if (size != 0) {
        let perc = Math.trunc((ct / size) * 100)
        aLine.style.flex = perc
        bLine.style.flex = 100 - perc
    }
    else {
        aLine.style.flex = 99
        bLine.style.flex = 0
    }
}
function openSettings(){
    history.pushState(null,'',location.href)
    toggleSettings()
}
function closeSettings(){
    history.back()
}
function toggleSettings() {
    settings.classList.toggle('flex')
    settings.classList.toggle('hide')
}

function loadTheme() {
    theme=localStorage.getItem('savedtheme')
    document.documentElement.setAttribute('theme', theme)
    theme=='dark'?themeChangeInp.checked=false:themeChangeInp.checked=true
}

function changeTheme() {
    theme = themeChangeInp.checked ? 'light' : 'dark';
    document.documentElement.setAttribute('theme', theme)
    localStorage.setItem('savedtheme', theme)
}

function goBack(){
    if(settings.classList.contains('flex')){
        toggleSettings()
    }
}