import { Caplitalize, getMonth, ValidateForm } from "./Helper";
import { updateAll } from "./localStorage";
import { DetailsTask, Form, DetailsNote, confirmModal, DateInformation } from "./modals";
import { Calender, getsetNotes, getsetProjects, getsetTasks } from "./TaskManager";
function CreateElement(elementName,elementclassList,textContent,attributes){
  let temp = document.createElement(elementName);
  if(elementclassList){
    elementclassList.forEach(className => {
      if(className.trim() !== "") 
      temp.classList.add(className);
    });
  }
  if(attributes) {
    attributes.forEach(attr=>{
      temp.setAttribute(attr[0],attr[1]);
    });
  }
  if(textContent) temp.textContent = textContent;
  return temp;
}
export class PageManager{
    constructor(PagesObj){
        this.pages = PagesObj;
        this.mainPageContainer = document.getElementById("content");
        this.mainPageContainer.innerHTML = this.pages["today"];
    }
    changePage(pageName){
      this.mainPageContainer.innerHTML = this.pages[pageName];  
    }
    addPage(pageName,page){
      this.pages[pageName] = page; 
    }
}
export function CreateTaskToDOM(task,functionName = getsetTasks){
  //element Creation
  let div_box = CreateElement("div",["box","flex","align-center",`${task.isCompleted ? `check` : ``}`]);
  let div_circle = CreateElement("div",["circle","flex","center",task.priority]);
  let div_flex = CreateElement("div",["flex","direction-column"]);
  let h3$div_flex = CreateElement("h3",null,task.title);
  let div_dueDate = CreateElement("div",["dueDate"]);
  let i_calender = CreateElement("i",["fa","fa-calender"]);
  let div_btns = CreateElement("div",["btns"]);
  let button_btnNormal = CreateElement("button",["btn","btn-normal"],"Details");
  let button_removeTask = CreateElement("button",["removeTask"]);
  let i_trash = CreateElement("i",["fa","fa-trash"]);
  let i_check = CreateElement("i",["fa","fa-check"]);
  //Adding attributes
  div_box.setAttribute("data-taskId",task.id);
  //apending Children 
  div_dueDate.append(i_calender);
  div_dueDate.textContent = task.dueDate;
  div_flex.append(h3$div_flex,div_dueDate);
  button_removeTask.append(i_trash);
  div_btns.append(button_btnNormal,button_removeTask);
  div_box.append(div_circle,div_flex,div_btns);
  let taskList = functionName();
  div_circle.addEventListener("click",()=>{
    let [_task] = taskList.filter(tsk=>tsk.task.id === task.id);
    _task.toggleComplete();
    div_box.classList.toggle("check");
  task.isCompleted ? div_circle.append(i_check) : div_circle.removeChild(i_check);
  });
  button_btnNormal.addEventListener("click",()=>{
    let [_task] = taskList.filter(tsk=>tsk.task.id === task.id);
    let detailsModal = new DetailsTask(task);
    document.getElementById("bg").classList.add("bg");
    document.getElementById("modal").innerHTML = detailsModal.details;
    document.querySelector(".cross i").addEventListener("click",closeModal);
    document.getElementById("edit").addEventListener("click",()=>{
      let editModal = new Form("task",task);
      document.getElementById("modal").innerHTML = editModal.form;
      document.querySelector(".cross i").addEventListener("click",closeModal);
      document.getElementById("addNew").addEventListener("click",()=>{
        const title = document.getElementById("title").value;
        const details = document.getElementById("details").value;
        const dueDate = document.getElementById("dueDate").value;
        const priority = document.querySelector(".priority input[type=radio]:checked + label").textContent;

        const result = ValidateForm("task",{
          title,
          details,
          priority
        });
        if(result && (task.title !== title || task.details !== details || priority !== task.priority || dueDate !== task.dueDate)){
          _task.editTask({title,details,priority:priority.toLowerCase(),dueDate,isCompleted:task.isCompleted});
          UpdatePage();
          closeModal();
        }
      });
    });
  });
  i_trash.addEventListener("click",()=>{
    let _confirmModal = confirmModal(" want to delete task");
    document.getElementById("bg").classList.add("bg");
    document.getElementById("modal").innerHTML = _confirmModal;
    document.getElementById("confirmNo").addEventListener("click",closeModal);
    document.getElementById("confirmYes").addEventListener("click",()=>{
      let taskList = functionName();
      let [_task] = taskList.filter(tsk=>tsk.task.id === task.id);
      taskList.splice(_task.id - 1,1);
      UpdatePage();
      closeModal();
    });
  });
   // return `<div class="box flex align-center ${task.isCompleted ? "check" : ""}"><div class="circle flex center ${task.priority}"></div><div class="flex direction-column"><h3>${task.title}</h3><div class="dueDate"><i class="fa fa-calendar"></i>${task.dueDate}</div></div><div class="btns"><button class="btn btn-normal">Details</button><button class="removeTask"><i class="fa fa-trash"></i></button></div></div>`;
  return div_box;
}
export function closeModal(){
  document.getElementById("bg").classList.remove("bg");
  document.getElementById("modal").innerHTML = "";
}
export function CreateNoteToDOM(note,functionName = getsetNotes){
  let div_box = CreateElement("div",["box","flex","align-center"]);
  let div_flex = CreateElement("div",["flex","direction-column"]);
  let h3$div_flex = CreateElement("h3",null,note.title);
  let div_btns = CreateElement("div",["btns"]);
  let button_clipboard = CreateElement("button",["fa","fa-clipboard","copy"],null,[["title","Copy to Clipboard"]]);
  let button_btnNormal = CreateElement("button",["btn","btn-normal"],"Details");
  let button_removeTask = CreateElement("button",["removeTask"]);
  let i_trash = CreateElement("i",["fa","fa-trash"]);

  //apending children
  div_box.append(div_flex,div_btns);
  div_flex.append(h3$div_flex);
  div_btns.append(button_clipboard,button_btnNormal,button_removeTask);
  button_removeTask.append(i_trash);
  button_clipboard.addEventListener("click",()=>{
    let copy = CreateElement("input",["copyElement"],null,[["type","text"]]);
    document.body.append(copy);
    copy.setAttribute("value",`Title:${note.title} \n Note:${note.note} \n Date of Creation: ${note.dateOfCreation}`);
    copy.select();
    copy.setSelectionRange(0,999999999);
    document.execCommand("copy");
    document.querySelector(".copyElement").remove();
    alert("Note Copied to clipboard");
  });
  let noteList = functionName();
  button_btnNormal.addEventListener("click",()=>{
    let noteModal = new DetailsNote(note);
    document.getElementById("bg").classList.add("bg");
    document.getElementById("modal").innerHTML = noteModal.details;
    document.querySelector(".cross i").addEventListener("click",closeModal);
    document.getElementById("editNote").addEventListener("click",()=>{
      let form = new Form("note",note);
      let [_note] = noteList.filter(nte=>nte.note.id === note.id);
      document.getElementById("modal").innerHTML = form.form;
      document.querySelector(".cross i").addEventListener("click",closeModal);
      document.getElementById("addNew").addEventListener("click",()=>{
        const title = document.getElementById("title").value;
        const notes = document.getElementById("note").value;
        let result =  ValidateForm("note",{title,note:notes});
        if(result && (title !== note.title || note.note !== note)){
          _note.editNote({title,note:notes});
          UpdatePage();
          closeModal();
        }
      });
    });
  });
  i_trash.addEventListener("click",()=>{
    let _confirmModal = confirmModal(" want to delete this note");
    document.getElementById("bg").classList.add("bg");
    document.getElementById("modal").innerHTML = _confirmModal;
    document.getElementById("confirmNo").addEventListener("click",closeModal);
    document.getElementById("confirmYes").addEventListener("click",()=>{
      let [_note] = noteList.filter(nte=>nte.note.id === note.id);
      noteList.splice(_note.id - 1,1);
      UpdatePage();
      closeModal();
    });

  });
  return div_box;
  // return `<div class="box flex align-center"><div class="flex direction-column"><h3>${note.title}</h3></div><div class="btns"><button title="Copy to Clipboard" class="fa fa-clipboard copy"></button><button class="btn btn-normal">Details</button><button class="removeTask"><i class="fa fa-trash"></i></button></div></div>`;
}

function CreateDatesToDom(Calender) {
  let dates = [
    CreateElement("div",["gridItem","day"],"SUN"),
    CreateElement("div",["gridItem","day"],"MON"),
    CreateElement("div",["gridItem","day"],"TUE"),
    CreateElement("div",["gridItem","day"],"WED"),
    CreateElement("div",["gridItem","day"],"THU"),
    CreateElement("div",["gridItem","day"],"FRI"),
    CreateElement("div",["gridItem","day"],"SAT")
  ];

  Calender.calender.forEach(date=>{
    let div_gridItem = CreateElement("div",["gridItem","date"]);
    date.class.split(" ").forEach(className=>{
      if(className !== "")
      div_gridItem.classList.add(className);
    })
    let div_date_cont = CreateElement("div",["date_cont"],date.date);
    div_gridItem.append(div_date_cont);
    div_date_cont.addEventListener("click",()=>{
      let dateInfo = new DateInformation(date,Calender.month,Calender.year);
      let completedTasks = date.tasks.filter(task=>{
        return task.task.isCompleted;
      });
      let incompletedTasks = date.tasks.filter(task=>{
        return !task.task.isCompleted;
      });
      document.getElementById("bg").classList.add("bg");
      document.getElementById("modal").innerHTML = dateInfo.html;
      document.querySelector(".cross i").addEventListener("click",()=>{
        closeModal();
      });
      if(date.tasks.length > 0){
        incompletedTasks.forEach(task=>{
          document.getElementById("cont_wrapper_tasks").append(CreateTaskToDOM(task.task));
        });
        completedTasks.forEach(task=>{
          document.getElementById("cont_wrapper_completedTask").append(CreateTaskToDOM(task.task));
        });
      }
      if(date.notes.length > 0){
        date.notes.forEach(note=>{
          document.getElementById("cont_wrapper_notes").append(CreateNoteToDOM(note.note));
        });
      }
    });
    dates.push(div_gridItem);
  });

  return dates;
}

export function UpdatePage(){
  let cont_wrapper = document.querySelector(".cont_wrapper");
  cont_wrapper.innerHTML = "";
  let section = document.querySelector("section");
  if(section.id === "today"){
    let tasks = getsetTasks();
    tasks.forEach(task=>{
      cont_wrapper.append(new CreateTaskToDOM(task.task));    
    });
    if(tasks.length <= 0) cont_wrapper.innerHTML = `<h2>No Tasks Found</h2>`; 
  } else if(section.id === "notes"){
    let notes = getsetNotes();
    notes.forEach(note=>{
      cont_wrapper.append(new CreateNoteToDOM(note.note));
    });
    if(notes.length <= 0) cont_wrapper.innerHTML = `<h2>No Notes Found</h2>`; 
  }
  else if(section.id === "project"){
    let ProjectsList = getsetProjects();
    let project = ProjectsList[+section.getAttribute("data-id") - 1];
    if(!project.tasks.length <= 0) {
      let h3 = CreateElement("h3",null,"Tasks");
      cont_wrapper.append(h3);
      let completedTasks = [];
      project.tasks.forEach(task=>{
        if(task.isCompleted) return completedTasks.push(task); 
      cont_wrapper.append(new CreateTaskToDOM(task.task,()=>project.tasks));
      });
      completedTasks.forEach(task=>{
        cont_wrapper.append(new CreateTaskToDOM(task.task,()=>project.tasks));
      });
    }
    if(!project.notes.length <= 0){
      let h3 = CreateElement("h3",null,"Notes");
      cont_wrapper.append(h3);
      project.notes.forEach(note=>{
        cont_wrapper.append(new CreateNoteToDOM(note.note,()=>project.notes));
      });
    }
  } else if(section.id === "calender"){
    const Months = [ "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December" ];
    let currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth();
    let calender_month = document.querySelector(".calender_head h2");
    let calender_year = document.querySelector(".calender_head p");
    calender_month.textContent = Months[currentMonth];
    calender_year.textContent = currentYear;
    let calender = new Calender(currentYear,currentMonth,getMonth(currentYear,currentMonth + 1).monthDates);
    let dates = CreateDatesToDom(calender);
    dates.forEach(date=>{
      cont_wrapper.append(date);
    });
  }
}