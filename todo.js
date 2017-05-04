
class Model {
  constructor() {
    // taskList adalah array of object
    this.file = './data.json';
    this.command = process.argv[2];
    this.parameter = process.argv[3];
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
      case undefined:
        view.showHelp()
        break;
      default:
        view.showErrorCommand()
    }
  }

  addTaskList (paramObj) {
    model.taskList.push(paramObj);
    model.saveData()
  }

  deleteData (paramObjNum) {
    model.taskList.splice(paramObjNum - 1, 1);
    model.saveData()
  }

  complete (paramObjNum) {
    model.taskList[paramObjNum - 1].complete = true;
    model.saveData()
  }

  uncomplete (paramObjNum) {
    model.taskList[paramObjNum - 1].complete = false;
    model.saveData()
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
        console.log(`${i+1}. ${arrObjTask[i].task} [COMPLETED]`);
      } else {
        console.log(`${i+1}. ${arrObjTask[i].task}`);
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

}

class Task {
  constructor(taskDetail="no task yet", completeValue=false) {
    this.task = taskDetail;
    this.complete = completeValue;
  }
}

// Display
// let model = new Model()
// console.log(model);
// console.log(model.getData());
// model.taskList = [{"name":"JP"}, {"name":"adfasd"}, {"name":"ssssss"}];
// console.log(model.saveData());
// console.log(model);

let model = new Model();
let view = new View();
let control = new Controller();

control.run();
// console.log(model);
// console.log(view);
// console.log(control);







// "command" : ["help", "list", "add", "task", "delete", "complete", "uncomplete"],
