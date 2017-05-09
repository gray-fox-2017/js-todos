
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
    this.tag = [];
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
      case "task":
        view.showTaskDetail(model.taskList, model.parameter);
        break;
      case "tag":
        let paramArr = model.parameter.split(" ");
        let objId = paramArr[0];
        let taskName = model.taskList[objId].task
        let tagsArr = paramArr.slice(1);
        this.tag(objId, tagsArr);
        view.confirmAddedTag(taskName, tagsArr)
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
          view.showUncompletedTask(sortedTaskList)
        } else if (model.parameter == "dsc") {
          let sortedTaskList = this.dscOutStanding(model.taskList)
          view.showUncompletedTask(sortedTaskList)
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
      case "filter":
        let filteredTaskObj = this.filterByTag(model.taskList ,model.parameter);
        view.showTaskByTag(filteredTaskObj, model.parameter)
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
    model.taskList.splice(paramObjNum, 1);
    model.saveData()
  }

  tag (paramObjNum, tagArr) {
    model.taskList[paramObjNum].tag = tagArr
    model.saveData()
  }

  filterByTag(paramObj, tag) {
    let filteredArr = []
    for (let i = 0; i < paramObj.length; i++) {
      let tagArr = paramObj[i].tag;
      if (tagArr == undefined) {
        continue;
      } else {
        if (tagArr.indexOf(tag) != -1) {
          filteredArr.push(paramObj[i]);
        }
      }

    }
    return filteredArr;
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
      return a.id - b.id;
    });
    return paramObj;
  }

  dscOutStanding (paramObj) {
    paramObj.sort(function(a,b){
      return b.id - a.id;
    });
    return paramObj;
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
    console.log("tag [task number] [new tag] > add tags");
    console.log("task [task number] > task detail");
    console.log("delete [task number] > delete task");
    console.log("check [task number] > check task");
    console.log("uncheck [task number] > uncheck task");
    console.log("list:outstanding asc | dsc > sort based on date completed");
    console.log("list:completed asc | dsc > sort based on task id");
    console.log("filter [tag name] > sorted by tag");
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

  showUncompletedTask(arrObjTask) {
    for (let i = 0; i < arrObjTask.length; i++) {
      if (arrObjTask[i].complete === false) {
        console.log(`${arrObjTask[i].id}. ${arrObjTask[i].task}`);
      }
    }
    return 0;
  }

  showTaskDetail(arrObjTask, taskNum) {
    console.log(`Detail Task :\n`);
    console.log("id : ", arrObjTask[taskNum].id);
    console.log("Completed status : ", arrObjTask[taskNum].complete);
    console.log("isi Task : ", arrObjTask[taskNum].task);
  }

  showTaskByTag(arrObjTask, tag) {
    console.log(`Task with ${tag} tag :`);
    for (let i = 0; i < arrObjTask.length; i++) {
      console.log(`${arrObjTask[i].id}. ${arrObjTask[i].task}`);
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

  confirmAddedTag(taskName, tagsArr) {
    console.log(`Tagged Task ${taskName} with tags: ${tagsArr.join(",")}`);
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
