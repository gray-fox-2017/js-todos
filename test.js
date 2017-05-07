class Model {
  constructor(file) {
    this.file = file;
    this.readfile = json.readFileSync(this.file);
  }

  addList(input) {
    if (input !== "" || input !== undefined) {
      let added = {task: input, completed: []};
      this.readfile.push(added);
      json.writeFileSync(this.file, this.readfile)
    }
  }

  deleteList(input) {
    for (let i=0; i<this.readfile.length;i++) {
      if (input === this.readfile[i].task) {
        this.readfile.splice(i,1);
        json.writeFileSync(this.file, this.readfile)
      }
    }
  }

  completeList(input) {
    for (let i=0; i<this.readfile.length;i++) {
      if (input === this.readfile[i].task) {
        this.readfile[i].completed = '[X]'
        json.writeFileSync(this.file, this.readfile)
      }
    }
  }

  uncompleteList(input) {
    for (let i=0; i<this.readfile.length;i++) {
      if (input === this.readfile[i].task) {
        this.readfile[i].completed = '[]'
        json.writeFileSync(this.file, this.readfile)
      }
    }
  }
}

class Controller {
  constructor(input) {
    this.model = new Model('./data.json')
    this.view = new View()
  }

  processing(input) {
  let value = argv[3];
    if (input === undefined || input === "help") {
      this.view.showHelp();
    } if (input === "list") {
      this.view.showList();
    } if (input === "add") {
      this.model.addList(value)
      this.view.viewAdded(value);
    } if (input === "delete") {
      this.model.deleteList(value);
      this.view.viewDeleted(value);
    } if (input === "complete") {
      this.model.completeList(value);
      this.view.viewCompleted(value);
    } if (input === "uncomplete") {
      this.model.uncompleteList(value);
      this.view.viewUncompleted(value);
    }
  }
}

class View {
  constructor() {
    this.model = new Model('./data.json');
  }

  showHelp() {
    console.log("============ Help ============");
    console.log("\"list\" to see your todo(s)");
    console.log("\"add\" to add a list");
    console.log("\"delete\"  to erase one of your todo");
    console.log("\"complete\" if you have completed one task");
    console.log("\"uncomplete\" if you want to undo the task");
  }

  showList() {
    if (this.model.readfile.length == 0) {
      console.log('You don\'t have anything to do');
    } else if(this.model.readfile.length == 1) {
      console.log('Your to do list:');
      console.log(`1. ${this.model.readfile[0].completed} ${this.model.readfile[0].task}`);
    } else {
      console.log('Your to do lists:');
      for (let i = 0; i < this.model.readfile.length; i++) {
        console.log(`${i+1}. ${this.model.readfile[i].completed} ${this.model.readfile[i].task}`);
      }
    }
  }

  viewAdded(input) {
    if (input === "" || input === undefined) {
      console.log("Insert the name of your list");
    } else {
      console.log(`"${input}" has been added to your list`);
    }
  }

  viewDeleted (input) {
    if (input === "" || input === undefined) {
      console.log("Specify the list name that you want to delete");
    } else {
      console.log(`"${input}" has been deleted from your list`);
    }
  }

  viewCompleted (input) {
    if (input === "" || input === undefined) {
      console.log("Specify the list name that has been completed");
    } else {
      console.log(`"${input}" has been marked completed`);
    }
  }

  viewUncompleted (input) {
    if (input === "" || input === undefined) {
      console.log("Specify the list name that you want to undo");
    } else {
      console.log(`"${input}" has been marked uncompleted again`);
    }
  }

}

let json = require('jsonfile');
let argv = process.argv;
let start = new Controller();
start.processing(argv[2]);