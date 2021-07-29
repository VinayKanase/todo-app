
export function Caplitalize(string){
    return string.slice(0,1).toUpperCase() + string.slice(1);
}
/**
 * 
 * @param {number} year - Year of which month is required
 * @param {number} month - Month of which all dates are required
 * @returns Array of objects with date in order.
 */
export function getMonth(year,month){
    let arrayofMonth = [];
    let thisMonthFirstDate = new Date(year, month - 1);
    let oneMonthagoLastDate = new Date(year, month - 1, 0);
    let lastMonthLastDay = oneMonthagoLastDate.getDay();
    let date = oneMonthagoLastDate.getDate();
    while(lastMonthLastDay >= 0){
        arrayofMonth.push({
            date,
            class: "dull"
        });
        date--;   
        lastMonthLastDay--;
    }
    arrayofMonth.reverse();

    let thisMonthLastDate = new Date(year,month,0);
    thisMonthFirstDate = thisMonthFirstDate.getDate();
    while(thisMonthLastDate.getDate() >= thisMonthFirstDate){
        arrayofMonth.push({
            date: thisMonthFirstDate,
            class:""
        });
        thisMonthFirstDate++;
    }
    if(arrayofMonth.length !== 42){
        let temp = 1;
        while(arrayofMonth.length < 42){
            arrayofMonth.push({
                date:temp,
                class: "dull"
            });
            temp++;
        }
    }
    let today = new Date();
    if(today.getMonth() === month - 1 && today.getFullYear() === year){
        const temp = arrayofMonth.findIndex((elem)=>{
            if(elem.class.includes("dull")) return;
            return today.getDate() === elem.date;
        });
        arrayofMonth[temp] = {
            date: arrayofMonth[temp].date,
            class: "today"
        };
    }
    month = thisMonthLastDate.toDateString().slice(4,7);
    return {monthDates:arrayofMonth,month,year};
}

export function ValidateForm(formType,obj){
    if(obj.title.length <= 0){
        return alert("Title cannot be Empty");
    }
    if(formType === "task"){
        if(obj.details.trim().length <=0 )
            return alert("Details Cannot be Empty");
        else if(obj.priority == undefined)
            return alert("Please set priority");
    }else if(formType === "note"){
        if(obj.note.trim().length <= 0)
            return alert("Note cannot be empty");
    }

    return true;
}