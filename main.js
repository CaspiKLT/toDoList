const newTaskBtn = document.querySelector('.newTaskItem');
const taskInput = document.querySelector('.taskInput');
const cancelTask = document.querySelector('.cancelTask');
const addTask = document.querySelector('.addTask');
const template = document.getElementsByTagName("template")[0];
const displayNote = document.querySelector('.noteDisplay');
const archiveDisplay = document.querySelector('.archiveDisplay');
const InputBg = document.querySelector('.InputBg');
const note = document.querySelector('.note');
const body = document.body;
const username = document.querySelector('.username');
const archiveBtn = document.querySelector('#archive');
const search = document.querySelector('#search');

render();

// available after render ONLY!
const notesOpen = document.querySelectorAll('.noteOpenBg');
const notes = document.querySelectorAll('.note');

// OPEN-CLOSE NOTES
for (let i = 0; i < notes.length; i++) {
    notes.item(i).addEventListener('click', function(e){
        notes.item(i).nextElementSibling.style.visibility = 'visible';
        notes.item(i).style.visibility = 'hidden';
        body.style.overflow = 'hidden';
        e.preventDefault();
    })  
}


// DONE - REMOVE 

for (let i = 0; i < notesOpen.length; i++) {
    let markDoneBtn = notesOpen[i].children.item(0).children.item(2).children.item(0);
    let deleteBtn = notesOpen[i].children.item(0).children.item(2).children.item(1);

    markDoneBtn.addEventListener('click', function(e){
        notes[i].children.item(1).innerHTML = notesOpen[i].children.item(0).children.item(1).value;
        notesOpen[i].children.item(0).children.item(1).innerHTML = notesOpen[i].children.item(0).children.item(1).value ;

        if (notesOpen.item(i).style.visibility === 'visible') {
            notesOpen.item(i).style.visibility = 'hidden';
            notes.item(i).style.visibility = 'visible';
            body.style.overflow = 'visible';
        }

        localStorage.setItem(`task ${notes[i].id}`, notes[i].outerHTML + notesOpen[i].outerHTML);
        e.preventDefault();
    })


    deleteBtn.addEventListener('click', function(e){
        if (notesOpen.item(i).style.visibility === 'visible') {
            notesOpen.item(i).style.visibility = 'hidden';
            body.style.overflow = 'visible';
        }

        notes[i].className = 'archiveNote';
        notes[i].style.visibility = 'visible';

        localStorage.removeItem(`task ${notes.item(i).id}`);
        localStorage.setItem(`Archive ${notes.item(i).id}`, notes[i].outerHTML + notesOpen[i].outerHTML);

        notes.item(i).nextElementSibling.remove();
        notes.item(i).remove();

        location.reload();
        e.preventDefault();
    })
}


// NEW TASK pop-up

newTaskBtn.addEventListener('click', function (e) {
    e.preventDefault();
    if (taskInput.style.visibility === 'visible') {
        taskInput.style.visibility = 'hidden'
        InputBg.style.visibility = 'hidden';
        body.style.overflow = 'visible';
    } else {
        taskInput.style.visibility = 'visible';
        InputBg.style.visibility = 'visible';
        body.style.overflow = 'hidden';
    }
})


// SEARCH 
search.children.item(0).addEventListener('click', function(e){
    if (search.children.item(1).style.display === 'none') {
        search.children.item(1).style.display = 'block';
        search.children.item(2).style.display = 'none';
    } else {
        search.children.item(1).style.display = 'none';
        search.children.item(2).style.display = 'block';
    }
    e.preventDefault();
})

// CANCEL TASK

cancelTask.addEventListener('click', function(e){
    taskInput.style.visibility = 'hidden';
    InputBg.style.visibility = 'hidden';

    taskInput.children.item(0).value = '';
    taskInput.children.item(1).value = '';
    e.preventDefault();
})


// ADD TASK

addTask.addEventListener('click', function(e){
    let newNote = template.content.children[0].cloneNode(true);
    let newNoteOpen = template.content.children[1].cloneNode(true);
    let id_Num = Math.floor(Math.random() * 100);

    if (taskInput.children.item(0).value === '' || taskInput.children.item(1).value === '') {
        alert('Dont leave empty fields.');
    } else {
        newNote.children.item(0).innerHTML = taskInput.children.item(0).value;
        newNote.children.item(1).innerHTML = taskInput.children.item(1).value;

        newNoteOpen.children.item(0).children.item(0).innerHTML = taskInput.children.item(0).value;
        newNoteOpen.children.item(0).children.item(1).innerHTML = taskInput.children.item(1).value;

        newNote.id = id_Num;
        newNoteOpen.id = id_Num;
        
        localStorage.setItem(`task ${id_Num}`, newNote.outerHTML + newNoteOpen.outerHTML);
        displayNote.append(newNote);
        displayNote.append(newNoteOpen);

        taskInput.children.item(0).value = '';
        taskInput.children.item(1).value = '';

        taskInput.style.visibility = 'hidden';
        InputBg.style.visibility = 'hidden';
        body.style.overflow = 'visible';
    }
    location.reload();
    e.preventDefault();
})

// ARCHIVE

archiveBtn.addEventListener('click', function(e) {
    if (displayNote.style.visibility !== 'hidden') {
        displayNote.style.visibility = 'hidden';
        archiveDisplay.style.display = 'flex';
    } 
    e.preventDefault();
})

archiveDisplay.children.item(0).addEventListener('click', function(e){
    if (displayNote.style.visibility === 'hidden') {
        displayNote.style.visibility = 'visible';
        archiveDisplay.style.display = 'none';
    }
    e.preventDefault();
})

for (let i = 0; i < archiveDisplay.children.length; i++) {
    if (archiveDisplay.children.item(i).className === 'archiveNote') {
        archiveDisplay.children.item(i).addEventListener('click', function(e){
            archiveDisplay.children.item(i).className = 'note';

            localStorage.removeItem(`Archive ${archiveDisplay.children.item(i).id}`);
            localStorage.setItem(`task ${archiveDisplay.children.item(i).id}`, archiveDisplay.children.item(i).outerHTML + archiveDisplay.children.item(i).nextElementSibling.outerHTML);
    
            archiveDisplay.children.item(i).nextElementSibling.remove();
            archiveDisplay.children.item(i).remove();

            location.reload();
            e.preventDefault();
        })
    }
}


//SHOW FILTER TASKS

search.children.item(2).addEventListener('input', function(){
    for (let i = 0; i < displayNote.children.length; i++) {
        if (displayNote.children.item(i).className === 'note') {
            let notes = displayNote.children.item(i);
            let input = String(search.children.item(2).value);
            console.log(input, notes.children.item(0).innerHTML);
            if (notes.children.item(0).innerHTML.includes(input)) {
                notes.style.display = 'block';
            } else {
                notes.style.display = 'none';
            }
        }
    }
});

// RENDER

function render() {
    if (!localStorage.getItem('username')) {
        username.innerHTML = prompt('USERNAME:', '');
        if (username.innerHTML === '') {
            username.innerHTML = 'User'
        }
        if (username.innerHTML.length > 12) {
            alert('Max length is 12 symbols')
            username.innerHTML = prompt('USERNAME:', '');
        }
        localStorage.setItem('username', username.innerHTML)
    } else {
        username.innerHTML = localStorage.getItem('username');
    }

    if (localStorage.length > 1) {
        for (let i = 0; i < localStorage.length; i++) {   
            if (localStorage.key(i).includes('task')) {
                displayNote.innerHTML += localStorage.getItem(localStorage.key(i));
            }  
        }
    }
    if (localStorage.length > 1) {
        for (let i = 0; i < localStorage.length; i++) {   
            if (localStorage.key(i).includes('Archive')) {
                archiveDisplay.innerHTML += localStorage.getItem(localStorage.key(i));
            }
        }
    }
}
