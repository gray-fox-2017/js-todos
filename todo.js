"use strict"

let fs = require('fs')

class Model {
  constructor() {
    this.file = "./data.json"
  }

  read() {
    return JSON.parse(fs.readFileSync(this.file, 'utf-8'))
  }

  write(data) {
    fs.writeFileSync(this.file, JSON.stringify(data))
  }

  add(task) {
    let data = this.read()
    let obj = {
      "id" : 0,
      "task" : task,
      "completed" : false,
      "created_at" : new Date(),
      "tags" : []
    }
    data.push(obj)
    //data = this.
    this.write(data)
    console.log(`${obj.task} Added to your list..`);
  }

  addTag(id, tags) {
    let data = this.read();
    for (let i = 0; i < data.length; i++) {
      if (data[i].id == id) {
        data[i].tags = tags;
        console.log(`Tagged task ${data[i].task} with tags: ${data[i].tags}`);
        break;
      }
    }
    this.write(data);
  }

  delete(id) {
    let data = this.read()
    for (var i = 0; i < data.length; i++) {
      if(data[i].id == id) {
        data.splice(i, 1)
        break;
      }
    }
    //data
    this.write(data)
    console.log(` Your data ID : ${id} was deleted from your list..`);
  }

  complete(id) {
    let data = this.read()
    for (var i = 0; i < data.length; i++) {
      if (data[i].id == id) {
        data[i].completed = true
        break
      }
    }
    this.write(data)
    console.log(`Your data ID : ${id} is completed!!`);
  }

  uncomplete(id) {
    let data = this.read()
    for (var i = 0; i < data.length; i++) {
      if (data[i].id == id) {
        data[i].completed = false
        break
      }
    }
    this.write(data)
    console.log(`Your data ID : ${id} is uncompleted!!`);
  }


}

class View {
  constructor() {

  }

  help() {
    console.log('0. Melihat teks bantuan dengan : help');
    console.log('1. Melihat daftar TODO dengan : list');
    console.log('2. Menambahkan TODO ke dalam list dengan : add <todo>');
    console.log('3. Melihat detail TODO dengan : task <id>');
    console.log('4. Menghapus TODO dengan : delete <id>');
    console.log('5. Menandai bahwa TODO selesai dengan dengan : complete <id>');
    console.log('6. Menandai bahwa TODO belum selesai dengan : uncomplete <id>');
  }

  list(data) {
    if (data.length > 0) {
      for (var i = 0; i < data.length; i++) {
        console.log(`${data[i].id}. [${data[i].completed ? "X" : " "}] ${data[i].task}`);
      }
    } else {
      console.log("No task!");
    }
  }

  filter() {
    let data = this.read()
    for (var i = 0; i < data.length; i++) {
      for (var j = 0; j < data[i].tags.length; j++) {
        if (data[i].tags[j] === tags) {
          console.log(`${data[i].id}. ${data[i].task} [${data[i].tags}]`);
          //break;
        }
      }
    }
  }

  readTask() {
    let data = this.read()
    if (data.length > 0) {
      for (var i = 0; i < data.length; i++) {
        if(data[i].id == id) {
          console.log(`${data[i].id}. ${data[i].task}`);
        }
      }
    }
  }

  // sorting(data, sortType) {
  //   if (sortType == "asc") {
  //     let tamp = this.sortAsc(data)
  //     return tamp
  //   } else {
  //     let tamp2 = this.sortDesc(data)
  //     return tamp2
  //   }
  // }

  listOutstanding(sortType) {
    let data = this.read();
    if (data.length > 0) {
      let data2 = this.sortBy(data, sortType);
      for (let i = 0; i < data.length; i++) {
        console.log(`${data2[i].id}. [${data2[i].completed ? "X" : " "}] ${data2[i].task} Date created: ${data2[i].created_at}`);
      }
    } else {
      console.log("Empty tasks");
      }
  }

 listCompleted(sortType) {
    let data = this.read();
    if (data.length > 0) {
      let data2 = this.sortBy(data, sortType);
      for (let i = 0; i < data.length; i++) {
        if (data2[i].completed === true) {
          console.log(`${data2[i].id}. [${data2[i].completed ? "X" : " "}] ${data2[i].task} Date completed: ${data2[i].completed_at}`);
        }
      }
    } else {
      console.log("Empty tasks");
    }
  }
}

class Controller {
  constructor() {
    this.model = new Model()
    this.view = new View()

  }

  run(cek) {
    switch (cek[0]) {
      case "help":
        this.view.help();
        break;
      case "list":
        this.view.list(this.model.read());
        break;
      case "list:outstanding":
        this.view.listOutstanding(cek[1]);
        break;
      case "list:completed":
        this.view.listCompleted(cek[1]);
        break;
      case "add":
        cek.shift();
        this.model.add(cek.join(" "));
        break;
      case "task":
        this.readTask(cek[1]);
        break;
      case "delete":
        this.model.deleting(cek[1]);
        break;
      case "complete":
        this.model.Complete(cek[1]);
        break;
      case "uncomplete":
        this.model.uncomplete(cek[1]);
        break;
      case "tag":
        let cekCopy = cek.slice("");
        cek1.shift();
        cek1.shift();
        this.model.addTag(cek[1], cek1);
        break;
      case "filter:":
        this.filter(cek[1]);
        break;
      default:
        console.log("Please input correct command.");
        break;
    }
  }
}

let arg = process.argv.slice(2, process.argv.length);
let controller = new Controller();
controller.run(arg);
