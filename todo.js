
class Model {
  constructor(filename) {
    this.filename = filename
    this.tasks = jsonfile.readFileSync(this.filename)
  }

  added(option) {
    if(option !== undefined) {
      let objectAdded = {task: option, completed: ' ', tag: []}
      let tanggal = new Date();
      objectAdded.dateAdded = tanggal.getTime();
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
      let complete = new Date();
      this.tasks[option-1].dateCompleted = complete.getTime();
      jsonfile.writeFileSync(this.filename, this.tasks);
    } else return this.tasks;
  }

  uncompleted(option) {
    if(option !== undefined) {
      this.tasks[option-1].completed = " "
      jsonfile.writeFileSync(this.filename, this.tasks);
    } else return this.tasks;
  }

  sortedComplete(option) {
    let arrSorted = [];
    if(option === "asc") {
      for(let i = 0; i < this.tasks.length; i++) {
        if(this.tasks[i].completed == "V") arrSorted.push(this.tasks[i]);
      }
    } else {
      for(let i = this.tasks.length - 1; i >= 0; i--) {
        if(this.tasks[i].completed == "V") arrSorted.push(this.tasks[i]);
      }
    }
    return arrSorted;
  }

  sortedOutstanding(option) {
    let arrUncomplete = [];
    for(let i = 0; i < this.tasks.length; i++) {
      if(this.tasks[i].completed == " ") arrUncomplete.push(this.tasks[i]);
    }
    if(option === "asc") {
      arrUncomplete.reverse();
    }
    return arrUncomplete;
  }

  addedTag(option, array) {
    for(let i = 0; i < array.length; i++) {
      this.tasks[option-1].tag.push(array[i]);
    }
    jsonfile.writeFileSync(this.filename, this.tasks);
  }

  filtered(option) {
    let arrFiltered = [];
    for(let i = 0; i < this.tasks.length; i++) {
      if(this.tasks[i].tag.includes(option)) arrFiltered.push(this.tasks[i]);
    }
    return arrFiltered;
  }
}

class Controller {
  constructor() {
    this.model = new Model("./data.json");
    this.view = new View();
  }

  inputProcessor(option) {
    let value = cli[3];
    let tagValue = [];
    for(let i = 4; i < cli.length; i++) {
      tagValue.push(cli[i]);
    }
    switch(option) {
      case "help":
        this.view.help();
        break;
      case "list":
        this.view.list();
        break;
      case "task":
        this.view.task(value);
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
      case "list:completed":
        this.view.sortedComplete(value);
        break;
      case "list:outstanding":
        this.view.sortedOutstanding(value);
        break;
      case "tag":
        this.view.addedTag(value, tagValue);
        this.model.addedTag(value, tagValue);
        break;
      case "filter":
        this.view.filtered(value);
        this.model.filtered(value);
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
    console.log("Your to do lists:")
    for(let i = 0; i < this.tasks.length; i++) {
      console.log(`${i+1}. [${this.tasks[i].completed}] ${this.tasks[i].task}`)
    }
  }

  task(option) {
    if(option !== undefined) {
      console.log(`Task number ${option} is:`)
      console.log(`[${this.tasks[option-1].completed}] ${this.tasks[option-1].task}`)
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

  sortedComplete(option) {
    console.log(`Your completed tasks are...`)
    let arrCompleted = this.model.sortedComplete(option);
    for(let i = 0; i < arrCompleted.length; i++) {
      console.log(`${i+1}. [${arrCompleted[i].completed}] ${arrCompleted[i].task}`)
    }
  }

  sortedOutstanding(option) {
    let arrUncomplete = this.model.sortedOutstanding(option);
    console.log(`Your incomplete tasks are...`)
    for(let i = 0; i < arrUncomplete.length; i++) {
      console.log(`${i+1}. [${arrUncomplete[i].completed}] ${arrUncomplete[i].task}`)
    }
  }

  addedTag(option, array) {
    if(option !== undefined) {
      console.log(`"${array}" tag has been added to "${this.tasks[option-1].task}"`);
    } else console.log("Specify your tagged task! (tag 'task ID' 'tag name')")
  }

  filtered(option) {
    console.log(`Your lists based on "${option}" tag(s)`)
    let arrFiltered = this.model.filtered(option);
    for(let i = 0; i < arrFiltered.length; i++) {
      console.log(`${i+1}. [${arrFiltered[i].completed}] ${arrFiltered[i].task} [${arrFiltered[i].tag}]`)
    }
  }
}

var jsonfile = require('jsonfile')

let cli = process.argv;
let ctrl = new Controller();

ctrl.inputProcessor(cli[2])
// let tanggal = new Date();
// console.log(tanggal.getTime())
// console.log(cli[3])

// let arr = ['a', 'b']
//
// console.log(arr.includes('b'))