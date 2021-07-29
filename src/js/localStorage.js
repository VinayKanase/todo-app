import { page } from ".";
import { getsetNotes, getsetProjects, getsetTasks, Note, ProjectsList, Task } from "./TaskManager";
import { UpdatePage } from "./UIManager";

let localStorageData = {
    darkTheme:false,
    tasks:[],
    notes:[],
    projects:[]
};

export function updateAll(tasks,notes,projects){
    udtasks(tasks);
    udnotes(notes);
    udprojects(projects);
}
export function udtasks(tasksArr){
    localStorageData.tasks = tasksArr; 
    UpdateLocalStorageData();
}

export function udnotes(notesArr){
    localStorageData.notes = notesArr;
    UpdateLocalStorageData();
}
export function udprojects(projectsArr){
    localStorageData.projects = projectsArr;
    UpdateLocalStorageData();
}
export function toggleTheme(){
    localStorageData.darkTheme = !localStorageData.darkTheme;
    UpdateLocalStorageData();
}
//Check for Local Storage
function checkStorageAvailability(type){
    let storage;
    try {
        storage = window[type];
        storage.setItem("__storage_test__","__test__");
        storage.removeItem("__storage_test__");
        return true;
    } catch (error) {
      console.error("No LocalStorage Availability",error);
      return false;   
    }
}

export function checkLocalData(){
    if(checkStorageAvailability('localStorage')){
        let data = JSON.parse(localStorage.getItem("TODO"));
        if(!data) return;
        if(data.darkTheme){
            document.body.classList.toggle("dark");
            toggleTheme();
        }
        data.tasks.forEach(task => {
            let _task = new Task(task.task);
            getsetTasks(_task);
        });
        data.notes.forEach(note=>{
            let _note = new Note(note.note);
            getsetNotes(_note);
        })
        data.projects.forEach(project=>{
            let temp = project.projectName.trim().replaceAll(" ","");
            document.getElementById("projectsWrapper").innerHTML += `<li id="${project.id}" class="navItem ${temp}">${project.projectName.trim()}</li>`;
            let _project = new ProjectsList(temp);
            page.addPage(temp,`<section data-id="${_project.id}" id="project">
            <h2 class="heading">${project.projectName.trim()}</h2>
            <div class="cont_wrapper">
            </div>
            </section>`);
            _project.tasks.forEach(task=>{
                _project.addTask(new Task(task));
            });
            _project.notes.forEach(note=>{
                _project.addNote(new Note(note));
            });
            getsetProjects(_project);
        });
        UpdatePage();
        udtasks(getsetTasks());
        udnotes(getsetNotes());
        udprojects(getsetProjects());
    }   
    else{
        console.error("Data cannot be added to LocalStorage");
    }
}

function UpdateLocalStorageData(){
    localStorage.setItem("TODO",JSON.stringify(localStorageData));
}