
class Model {
  constructor() {
    // taskList adalah array of object
    this.file = './data.json';
    this.command = process.argv[2];
    this.parameter = process.argv.slice(3).join(" ");
    this.taskList = this.getData();
  }

  getData() {
    let jsonfile = require('jsonfile')
    let jsonData = jsonfile.readFileSync(this.file)
    return jsonData;
  }

  // save data adanya di kontroller ??
  saveData () {
    let jsonfile = require('jsonfile')
    jsonfile.writeFileSync(this.file, this.taskList)
  }
}

class Task {
  constructor(taskDetail="no task yet",completeValue=false, dateCompleted="") {
    this.id = 0;
    this.task = taskDetail;
    this.complete = completeValue;
    this.dateCompleted = dateCompleted;
  }
}


class Controller {
  constructor() {
    this.model = new Model()
    this.view = new View()
  }

  run () {
    switch (model.command) {
      case "help":
        view.showHelp()
        break;
      case "list":
        view.showTaskList(model.taskList)
        break;
      case "add":
        this.addTaskList(new Task(model.parameter))
        view.confirmAddTask(model.parameter)
        break;
      case "delete":
        this.deleteData(model.parameter)
        view.confirmDeleteTask(model.parameter)
        break;
      case "check":
        this.complete(model.parameter)
        view.confirmCompleteTask(model.parameter)
        break;
      case "uncheck":
        this.uncomplete(model.parameter)
        view.confirmUncompleteTask(model.parameter)
        break;
      case "list:outstanding":
        if (model.parameter == "asc") {
          let sortedTaskList = this.ascOutStanding(model.taskList)
          view.showCompletedTask(sortedTaskList)
        } else if (model.parameter == "dsc") {
          let sortedTaskList = this.dscOutStanding(model.taskList)
          view.showCompletedTask(sortedTaskList)
        } else {
          view.showErrorParameter();
        }
        break;
      case "list:completed":
        if (model.parameter == "asc") {
          let sortedTaskList = this.ascComplete(model.taskList)
          view.showCompletedTask(sortedTaskList)
        } else if (model.parameter == "dsc") {
          let sortedTaskList = this.dscComplete(model.taskList)
          view.showCompletedTask(sortedTaskList)
        } else {
          view.showErrorParameter();
        }
        break;
      case undefined:
        view.showHelp()
        break;
      default:
        view.showErrorCommand()
    }
  }

  addTaskList (paramObj) {
    paramObj.id = model.taskList.length;
    model.taskList.push(paramObj);
    model.saveData()
  }

  deleteData (paramObjNum) {
    model.taskList.splice(paramObjNum - 1, 1);
    model.saveData()
  }

  complete (paramObjNum) {
    model.taskList[paramObjNum].complete = true;
    model.taskList[paramObjNum].dateCompleted = new Date();
    model.saveData()
  }

  uncomplete (paramObjNum) {
    model.taskList[paramObjNum].complete = false;
    model.taskList[paramObjNum].dateCompleted = ""
    model.saveData()
  }

  ascOutStanding (paramObj) {
    paramObj.sort(function(a,b){
      return new Date(a.dateCompleted) - new Date(b.dateCompleted);
    });
    return paramObj
  }

  dscOutStanding (paramObj) {
    paramObj.sort(function(a,b){
      return new Date(b.dateCompleted) - new Date(a.dateCompleted);
    });
    return paramObj
  }

  ascComplete (paramObj) {
    paramObj.sort(function(a,b){
      return a.id - b.id;
    });
    return paramObj;
  }

  dscComplete (paramObj) {
    paramObj.sort(function(a,b){
      return b.id - a.id;
    });
    return paramObj;
  }
}

class View {
  constructor() {}

  showHelp() {
    console.log("help > show help");
    console.log("list > show list task");
    console.log("add [task] > show task");
    console.log("delete [task] > delete task");
    console.log("complete [task] > check task");
    console.log("uncomplete [task] > uncheck task");
    return 0;
  }

  showTaskList(arrObjTask) {
    for (let i = 0; i < arrObjTask.length; i++) {
      if (arrObjTask[i].complete === true) {
        console.log(`${arrObjTask[i].id}. ${arrObjTask[i].task} [COMPLETED]`);
      } else {
        console.log(`${arrObjTask[i].id}. ${arrObjTask[i].task}`);
      }
    }
    return 0;
  }

  showCompletedTask(arrObjTask) {
    for (let i = 0; i < arrObjTask.length; i++) {
      if (arrObjTask[i].complete === true) {
        console.log(`${arrObjTask[i].id}. ${arrObjTask[i].task} [COMPLETED]`);
      }
    }
    return 0;
  }

  confirmAddTask(taskName) {
    console.log(`Task ${taskName} added`);
    return 0;
  }

  confirmDeleteTask(taskName) {
    console.log(`Task ${taskName} deleted`);
  }

  confirmCompleteTask(taskName) {
    console.log(`Task ${taskName} completed, Awesome !`);
  }

  confirmUncompleteTask(taskName) {
    console.log(`Task ${taskName} mark as uncomplete`);
  }


  showErrorCommand() {
    console.log("your command is not valid");
    return 0;
  }

  showErrorParameter() {
    console.log("your Parameter is not valid");
    return 0;
  }

}

let model = new Model();
let view = new View();
let control = new Controller();

control.run();







// "command" : ["help", "list", "add", "task", "delete", "complete", "uncomplete"],
