
class Model {
  constructor(filename) {
    this.filename = filename
    this.tasks = jsonfile.readFileSync(this.filename)
  }

  added(option) {
    if(option !== undefined) {
      let objectAdded = {task: option, completed: ' '}
      this.tasks.push(objectAdded);
      jsonfile.writeFileSync(this.filename, this.tasks);
    }
  }

  deleted(option) {
    if(option !== undefined) {
      this.tasks.splice(option-1, 1);
      jsonfile.writeFileSync(this.filename, this.tasks);
    } else return this.tasks;
  }

  completed(option) {
    if(option !== undefined) {
      this.tasks[option-1].completed = "V"
      jsonfile.writeFileSync(this.filename, this.tasks);
    } else return this.tasks;
  }

  uncompleted(option) {
    if(option !== undefined) {
      this.tasks[option-1].completed = " "
      jsonfile.writeFileSync(this.filename, this.tasks);
    } else return this.tasks;
  }
}

class Controller {
  constructor() {
    this.model = new Model("./data.json");
    this.view = new View();
  }

  inputProcessor(option) {
    let value = cli[3];
    switch(option) {
      case "help":
        this.view.help();
        break;
      case "list":
        this.view.list();
        break;
      case "add":
        this.view.added(value);
        this.model.added(value);
        break;
      case "delete":
        this.view.deleted(value);
        this.model.deleted(value);
        break;
      case "complete":
        this.view.completed(value);
        this.model.completed(value);
        break;
      case "uncomplete":
        this.view.uncompleted(value);
        this.model.uncompleted(value);
        break;
      }
  }
}

class View {
  constructor() {
    this.model = new Model("./data.json");
    this.tasks = this.model.tasks;
  }

  help() {
    console.log("Use <list> to view your current list")
    console.log("Use <add> to add a task to your list")
    console.log("Use <task> with a specific task id to view the task")
    console.log("Use <delete> with a specific task id to delete the task")
    console.log("Use <complete> with a specific task id to mark it done")
    console.log("Use <uncomplete> with a specific task id to mark it undone")
  }

  list() {
    for(let i = 0; i < this.tasks.length; i++) {
      console.log(`${i+1}. [${this.tasks[i].completed}] ${this.tasks[i].task}`)
    }
  }

  added(option) {
    if(option !== undefined) {
      console.log(`Added "${option}" to your TODO list...`)
    }
  }

  deleted(option) {
    if(option !== undefined) {
      console.log(`Deleted "${this.tasks[option-1].task}" from your TODO list...`)
    } else console.log("Specify your deleted task! (delete 'task ID')");
  }

  completed(option) {
    if(option !== undefined) {
      console.log(`"${this.tasks[option-1].task}" has been marked completed from your TODO list...`);
    } else console.log("Specify your completed task! (complete 'task ID')")
  }

  uncompleted(option) {
    if(option !== undefined) {
      console.log(`"${this.tasks[option-1].task}" has been marked uncomplete from your TODO list...`);
    } else console.log("Specify your uncompleted task! (complete 'task ID')")
  }
}

var jsonfile = require('jsonfile')

let cli = process.argv;
let ctrl = new Controller();

ctrl.inputProcessor(cli[2])

// console.log(cli)