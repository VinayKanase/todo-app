
    let Projects = [];
    let tasks = [];
    let notes = [];

    // Project = [
    //     {
    //         projectName:"",
    //         tasks:"",
    //         completedTasks:"",
    //         notes:""
    //     }
    // ]
    // tasks = [
    //     {
    //         title:"",
    //         details:"",            
    //         priority:"",
    //         dueDate: ""
    //     }
    // ]
    // completedTasks = [
    //     {
    //         title:"",
    //         details:"",            
    //         priority:"",
    //         dueDate: ""
    //     }
    // ]
    // notes = [
    //     {
    //         title:"",
    //         note:"",
    //         dateOfCreation:""
    //     }
    // ]
    // calender = [
    //     {
    //         date:"",
    //         class:"",
    //         tasks:[],
    //         completedTasks:[],
    //         notes:[]
    //     }
    // ]
export function getsetProjects(projectObject) {
    if(projectObject != undefined && projectObject.projectName !== undefined) Projects.push(projectObject);
    return Projects;
}

export function getsetTasks(taskObject) {
    if(taskObject != undefined && taskObject.task.title !== undefined && taskObject.task.details !== undefined && taskObject.task.priority !== undefined) {
        tasks.push(taskObject);
    };
    return tasks;
}

export function getsetNotes(noteObject) {
    if(noteObject != undefined && noteObject.note.title !== undefined && noteObject.note !== undefined) notes.push(noteObject);
    return notes;    
}
let taskCount = 0;
export class Task {
    constructor({title,details,dueDate,priority,isCompleted}){
        this.task = {
            id:++taskCount,
            title,
            details,
            dueDate,
            priority,
            isCompleted
        };
    }
    editTask({title,details,dueDate = null,priority = null,isCompleted= false}){
        this.task = {id:this.task.id,title,details,dueDate,priority,isCompleted};
    }
    getTask(){
        return this.task;
    }
    toggleComplete(){
        this.task.isCompleted = !this.task.isCompleted;
    }
}
let noteCount = 0;
export class Note{
    constructor({title,note,dateOfCreation}){
        this.note = {id:++noteCount,title,note,dateOfCreation};
    }
    editNote({title,note}){
        this.note = {title,note,dateOfCreation: this.note.dateOfCreation};
    }
    getTask(){
        return this.note;
    }
}

let projectCount = 0;
export class ProjectsList{
    constructor(projectName){
      this.id = ++projectCount;
      this.projectName = projectName;
      this.tasks = [];
      this.notes = [];
    }
    addTask(obj){
      this.tasks.push(obj);
    }
    addNote(obj){
      this.notes.push(obj);
    }
}

export class Calender{
    constructor(year,month,calenderMonth){
        this.year = year;
        this.month = month;
        this.rawCalender = calenderMonth;
        this.calender = this.createCalender();
    }
    createCalender(){
        let array = [];
        let thismonthTasks = tasks.filter(task=>{
            return +task.task.dueDate.split("-")[1] === this.month + 1;
        });
        let thismonthNotes = notes.filter(note=>{
            return +note.note.dateOfCreation.split("-")[1] === this.month + 1;
        });
        this.rawCalender.forEach(date => {
            let classString = "";
            let temp1 = thismonthTasks.filter(task=>{
                return +task.task.dueDate.split("-")[2] === date.date;
            });
            let temp2 = thismonthNotes.filter(note=>{
                return +note.note.dateOfCreation.split("-")[2] === date.date;
            });
            if(!date.class.includes("dull")){
                if(temp1.length > 0) classString = " task";
                if(temp2.length > 0) classString += " note"; 
            }
            array.push({
                date:date.date,
                class: (date.class ? date.class : "") + classString,
                tasks:temp1,
                notes:temp2
            });
        });
        return array;
    }

}

export function cleanall(){
    Projects = [];
    tasks = [];
    notes = [];
}