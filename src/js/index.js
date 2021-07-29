import '../css/style.css';
import { getMonth, ValidateForm } from './Helper';
import { PageManager,CreateTaskToDOM, UpdatePage, closeModal } from './UIManager';
import { confirmModal, Form as ModalForm } from './modals'; 
import { getsetNotes, getsetProjects, getsetTasks, Note, Task, ProjectsList, cleanall } from './TaskManager';
import { checkLocalData, toggleTheme, udnotes, udprojects, udtasks, updateAll } from './localStorage';

let themeBtn = document.getElementById("theme");

themeBtn.addEventListener("click", () => {
 document.body.classList.toggle("dark");
 toggleTheme();
});

export let page = (function(){
    const today = `
    <section id="today">
      <h2 class="heading">Today Tasks</h2>
      <div class="cont_wrapper">
      </div>
      </section>`;
    const calender = `<section id="calender" class="flex direction-column">
    <div class="calender_head flex center">
      <div class="flex direction-column center">
        <h2>July</h2>
        <p>2021</p>
      </div>
    </div>
    <div class="days_date cont_wrapper">
    <div class="gridItem day">SUN</div>
    <div class="gridItem day">MON</div>
    <div class="gridItem day">TUE</div>
    <div class="gridItem day">WED</div>
    <div class="gridItem day">THU</div>
    <div class="gridItem day">FRI</div>
    <div class="gridItem day">SAT</div>
    </div>
  </section>`;
    const notes = `
    <section id="notes">
      <h2 class="heading">Notes</h2>
      <div class="cont_wrapper">
      </div></section>`; 
    let _page = new PageManager({today,calender,notes});
    function PageChangeEventListner(){
        document.querySelectorAll(".navItem").forEach(element=>{
            element.addEventListener("click",e=>{
                _page.changePage(e.target.classList[1].split("_")[0]);
                document.querySelector(".active").classList.remove("active");
                e.target.classList.add("active");
                UpdatePage();
            });
        });
        UpdatePage();
    }
    PageChangeEventListner();
   function addPage(pgName,page){
        _page.addPage(pgName,page);
        PageChangeEventListner();
    }
    return {addPage};
})();
checkLocalData();
UpdatePage();
let formManipulater = (function(){
    
    function AddForm(toggleformEvents,project){
        let form = new  ModalForm("task");
        document.getElementById("bg").classList.add("bg");
        document.getElementById("modal").innerHTML += form.form;
        document.getElementById("formType").addEventListener("change",(e)=>{
                // document.getElementById("modal").innerHTML = "";
                document.querySelector(".mainFormContainer").innerHTML = form.changeForm(); 
                AddEventsToForm(toggleformEvents,project);
        });
    }
    function NewProjectListAdd(){
        let projectsWrapper = document.getElementById("projectsWrapper");
        let inputNewProject = projectsWrapper.querySelector("input");
        if(inputNewProject) {
            if(inputNewProject.value.trim().length <= 0){
                return alert("Project Name Cannot be Empty");
            }
            let temp = inputNewProject.value.trim().replaceAll(" ","");
            let project = new ProjectsList(temp);
            projectsWrapper.innerHTML += `<li id="${project.id}" class="navItem ${temp}">${inputNewProject.value.trim()}</li>`;
            getsetProjects(project);
            getsetProjects();
            page.addPage(temp,`<section data-id="${project.id}" id="project">
            <h2 class="heading">${inputNewProject.value.trim()}</h2>
            <div class="cont_wrapper">
            </div>
            </section>`);
            projectsWrapper.querySelector("input").remove();
            udprojects(getsetProjects());
            return;
        }
        
        projectsWrapper.innerHTML += `<input class="newProjectAdd" type=text placeholder="Enter New Project" />`;
    } 
    function AddEventsToForm(isUpdate = false,project) {
        document.querySelector(".cross i").addEventListener("click",closeModal);
        document.getElementById("addNew").addEventListener("click",()=>{
            let title = document.getElementById("title");
            let textarea = document.getElementById("details") || document.getElementById("note");
            let date = document.getElementById("dueDate") || new Date().toJSON().slice(0,10);
            let priority = document.querySelector(".priority input[type=radio]:checked + label");
            let result;
            if(textarea.id === "details"){
                let obj = {
                    title:title.value,
                    details:textarea.value,
                    dueDate:date.value,
                    isCompleted:false,
                    priority:priority ? priority.textContent.toLowerCase() : undefined
                };
                result = ValidateForm("task",obj);
                                            
                if(result){
                    if(isUpdate) {
                        project.addTask(new Task(obj));
                    }else{
                        let task = new Task(obj);
                        getsetTasks(task);
                    }
                    udtasks(getsetTasks());
                    UpdatePage();
                    closeModal();
                }
            }
            else if(textarea.id === "note"){
                let obj = {
                    title:title.value,
                    note:textarea.value,
                    dateOfCreation:date
                };
                result = ValidateForm("note",obj);                   
                if(result){
                    if(isUpdate){
                        project.addNote(new Note(obj));
                    }else{
                        let note = new Note(obj);
                        getsetNotes(note);
                    }
                    udnotes(getsetNotes());
                    UpdatePage();
                    closeModal();
                }
            }
        });
    }
    return {AddForm,NewProjectListAdd,AddEventsToForm}
})();
document.getElementById("add").addEventListener("click",()=>{
    let ProjectsList = getsetProjects();
    let check = false;
    let active = document.querySelector(".active");
    ProjectsList.forEach(project=>{
        if(active.classList.contains(project.projectName.replaceAll(" ",""))){
            check = true;
        }
    });
    let project = ProjectsList[+active.getAttribute("id") - 1];
    formManipulater.AddForm(check,project);
    if(check){
        formManipulater.AddEventsToForm(true,project);        
    }else{
      formManipulater.AddEventsToForm();
    }
});
document.getElementById("AddNewProjectBtn").addEventListener("click",()=>{
    return formManipulater.NewProjectListAdd();
});

document.getElementById("clearLocalStorage").addEventListener("click",()=>{
    let _confirmModal = confirmModal(" want to clear everthing ");
    document.getElementById("bg").classList.add("bg");
    document.getElementById("modal").innerHTML = _confirmModal;
    document.getElementById("confirmNo").addEventListener("click",closeModal);
    document.getElementById("confirmYes").addEventListener("click",()=>{
        localStorage.clear();
        cleanall();
        UpdatePage();
        closeModal();
    })
});