import { Caplitalize } from "./Helper";

export function confirmModal(message){
    let data = `<div class="modal confirmModal">
    <h1>Are you sure ${message} ?</h1>
    <div class="btns">
      <button id="confirmYes">Yes</button>
      <button id="confirmNo">No</button>
    </div>
  </div>`;  
  return data;
}
export class DetailsNote{
  constructor(note){
    this.note = note;
    this.createDetailsModal();
  }
  createDetailsModal(){
    this.details = `<div class="modal notesWrapper">
    <div class="cross flex"><i class="fa fa-close"></i></div>
    <div class="title">Title: <span>${this.note.title}</span></div>
    <div class="details">
      Note:
      <span>
      ${this.note.note}
      </span>
    </div>
    <div class="dateofCreation">
      Date of creation:
      <span>${this.note.dateOfCreation}</span>
    </div>
    <div class="options flex center">
      <button id="editNote">Edit</button>
    </div>
  </div>`
  }
}
export class DetailsTask{
  constructor(task){
    this.task = task;
    this.createDetailsModal();
  }
  createDetailsModal(){
    this.details = `<div data-taskId="${this.task.id}" class="modal detailsWrapper">
    <div class="cross flex">
      <i class="fa fa-close"></i>
    </div>
    <div class="title">Title: <span>${this.task.title}</span></div>
    <div class="details">
      Details:
      <span>
        ${this.task.details}
      </span>
    </div>
    <div class="priority">Priority: <span class="${this.task.priority}">${Caplitalize(this.task.priority)}</span></div>
    <div class="dueDate">Due Date: <span>${this.task.dueDate}</span></div>
    <div class="options flex center">
      <button id="edit">Edit</button>
    </div>
  </div>`
  }
}
export class Form{
    constructor(formType,editObject = {title:"",details:"",priority:"",dueDate:"",note:"",dateOfCreation:""}){
        this.formType = formType;
        this.editObject = editObject;
        this.createForm(this.formType);
    }
    createForm(formType){
        let form = "";
        this.task = `<input id="title" type="text" placeholder="Title: " value="${this.editObject.title}" /><br>
        <textarea id="details" type="text" placeholder="Details: ">${this.editObject.details}</textarea>
        <div class="form-group">
          <label for="dueDate">Due Date: </label>
          <input id="dueDate" type="date" name="date" id="dueDate" value="${this.editObject.dueDate}" />
        </div>
        <div class="form-group">
          <div>Priority:</div>
          <br />
          <div class="flex align-center priority">
            <input type="radio" name="priority" id="priorityLow" ${this.editObject.priority === "low" ? `checked="checked"` : ""} />
            <label class="low" for="priorityLow">Low</label>
            <input type="radio" name="priority" id="priorityMedium"  ${this.editObject.priority === "medium" ? `checked="checked"` : ""}/>
            <label class="medium" for="priorityMedium">Medium</label>
            <input type="radio" name="priority" id="priorityHigh" ${this.editObject.priority === "high" ? `checked="checked"` : ""}/>
            <label class="high" for="priorityHigh">High</label>
          </div>
        </div>
        <div class="flex center">
          <button id="addNew" class="btn btn-normal">Add To do</button>
        </div>`;
        this.note = `<input id="title" type="text" placeholder="Title: " value="${this.editObject.title}" /><br>
        <textarea id="note" type="text" placeholder="Note: ">${this.editObject.note}</textarea>
        <div class="form-group">
          <label for="creationDate">Date of Creation: </label>
          <input type="date" name="date" id="dateofCreation" title="Today" value="${this.editObject.dateOfCreation === "" ? new Date().toJSON().slice(0,10) : this.editObject.dateOfCreation}" disabled/>
        </div>
        <div class="flex center">
          <button id="addNew" class="btn btn-normal">Add Note</button>
        </div>`;
            form = `
                <div class="modal addNewTodo">
            <div class="cross flex">
                <i class="fa fa-close"></i>
            </div>
            ${this.editObject.title === "" ? `
            <select name="formType" id="formType">
                <option value="task">Add New Task</option>
                <option value="note">Add New Note</option>
            </select>` : `<h1>Edit Page</h1>`}
            <div class="mainFormContainer">
            ${formType === "task" ? this.task : this.note}
            </div></div>`;
        this.form = form;
    }
    changeForm(){
      if(this.formType === "task"){
        this.formType = "note";
        this.form = `<div class="modal addNewTodo">
        <div class="cross flex">
            <i class="fa fa-close"></i>
        </div>
        <select name="formType" id="formType">
            <option value="note">Add New Note</option>
            <option value="task">Add New Task</option>
        </select> ${this.note}</div>`;
        return this.note;
      }
      else if(this.formType === "note"){
          this.formType = "task";

        this.form = `<div class="modal addNewTodo">
        <div class="cross flex">
            <i class="fa fa-close"></i>
        </div>
        <select name="formType" id="formType">
            <option value="note">Add New Note</option>
            <option value="task">Add New Task</option>
        </select> ${this.task}</div>`;
        return this.task;
      }
    }
}

export class DateInformation{
  constructor(dateObj,month,year){
    this.date = dateObj;
    this.monthnyear = {month,year};
    this.addHTML();
  }
  addHTML(){
    this.html = `
    <div class="calender-details">
      <div class="cross flex">
        <i class="fa fa-close"></i>
      </div>
      <h1>${this.date.date}-${this.monthnyear.month + 1}-${this.monthnyear.year}</h1>
      <div id="cont_wrapper_tasks" class="cont_wrapper">
        <h2>Tasks</h2>
        No Tasks Found.
        </div>
      <div id="cont_wrapper_notes" class="notesCont">
        <h2>Notes</h2>
        No Notes Found.
      </div>
      <div id="cont_wrapper_completedTask" class="completedTask">
        <h2>Completed Tasks</h2>
        No Taks are Completed.
      </div>
    </div>
    `;
  }
}