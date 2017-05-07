'use strict'

var fs = require('fs');

class Model {
  constructor(){
    this.file = JSON.parse(fs.readFileSync('data.json', 'utf8'));
  }

  write(data) {
    fs.writeFileSync('data.json', JSON.stringify(data));
  }
}

class Controller {
  constructor() {
    this.model = new Model();
    this.view = new View();
  }

  process () {


    switch(process.argv[2]) {
      case "help" :
      this.view.help();
        break;
      case "list" :
      this.view.list(this.model.file);
        break;
      case "add" :
      this.addTask(process.argv[3]);
        break;
      case "task" :
      this.task();
        break
      case "delete":
      this.delete(process.argv[3]);
        break
      case "complete" :
      this.complete(process.argv[3]);
        break;
      case "uncomplite" :
      this.uncomplete(process.argv[3]);
        break;
      case "list:outstanding":
      this.outstanding(process.argv[3]);
        break;
      case "list:completed":
      this.list_completed(process.argv[3]);
        break;
      case "tag":
      this.tag(process.argv[3],process.argv.slice(4));
        break;
      case "filter":
      this.filter(process.argv[3]);
        break;
      default :
        this.view.help();
      }
    }

  addTask(input){
    let newFile = this.model.file
    newFile.push({
      task : input,
      complete : false,
      created_at : new Date().toUTCString()
    })
    this.model.write(newFile);
    this.view.add(input);
  }

  task () {
    let newTask = this.model.file
    newTask.filter((element)=>{
      this.view.task(element)
    })
  }

  delete (input) {
    let deleteFile = this.model.file
    deleteFile.splice(input-1, 1)
    this.model.write(deleteFile)
    this.view.delete(input)
  }

  completed (input) {
    let compliteFile = this.model.file
    if (compliteFile[input-1].complite == false) {
      compliteFile[input-1].complite = true;
      this.model.write(compliteFile);
      this.view.complite(input);
    }
  }

  uncomplete (input) {
    let uncompleteFile = this.model.file
    if (uncompleteFile[input-1].complete == true) {
      uncompleteFile[input-1].complete = false;
      this.model.write(uncompleteFile);
      this.view.complite(input);
    }
  }

  outstanding (input) {
    let outstandingFile = this.model.file
    if (input == 'asc' || input == undefined) {
      let finish = outstandingFile.sort((a, b)=>{
        if (outstandingFile.created_at < b.created_at) {
          return -1;
        }
        if (outstandingFile.created_at > b.created_at) {
          return 1;
        }
        return 0;
        })
        this.view.asc_desc(finish)
      } else {
        let finish = outstandingFile.sort((a, b)=>{
          if (outstandingFile.created_at < b.created_at) {
          return 1;
        }
        if (outstandingFile.created_at > b.created_at) {
          return -1;
        }
        return 0;
        })
        this.view.asc_desc(finish)
      }
    }

  list_completed(input) {
    let listCompleteFile = this.model.file

    if(input == 'asc' || input == undefined){
      let finish = listCompleteFile.sort((a, b)=>{
        if (listCompleteFile.created_at < b.created_at) {
          return -1;
        }
        if (listCompleteFile.created_at > b.created_at) {
          return 1;
        }
        return 0;
        })
        this.view.asc_desc(finish)
      } else {
        let finish = listCompleteFile.sort((a, b)=>{
          if (listCompleteFile.created_at < b.created_at) {
          return 1;
        }
        if (listCompleteFile.created_at > b.created_at) {
          return -1;
        }
        return 0;
        })
        this.view.asc_desc(finish)
    }
  }

  tag(input, value) {
    let tagFile = this.model.file
    tagFile[input-1].tag = value
    this.model.write(tagFile)
    this.view.tag(tagFile[input-1].task, value)
  }

  filter (input) {
    let filterFile = this.model.file
    filterFile.filter((element) =>{
      if(element.hasOwnProperty("tag")){
        element.tag.forEach((value)=>{
          if(input = value) {
            this.view.filter(element)
          }
        })
      }
    })
  }
}


class View {
  constructor() {

  }

  help () {
    console.log(` ++++++++++Format input+++++++++++\n node todo.js #will call help\n node todo.js help\n node todo.js add <task_content>\n node todo.js task <task_id>\n node todo.js delete <task_id>\n node todo.js complete <task_id>\n node todo.js uncomplete <task_id>`);
  }

  list(input) {
    for (let i = 0; i < input.length; i++) {
      if (input[i].complite == true) {
        console.log(`${i+1}. [X]${input[i].task}`);
      } else {
        console.log(`${i+1}. [ ]${input[i].task}`);
      }
    }
  }

  add(input){
    console.log(`'${input}' added in your list`)
  }

  task(input){
    console.log(input);
  }

  delete(input){
    console.log(`'${input}' has been delete`);
  }

  complete(input){
    console.log(`'${input}' has been complete`)
  }

  uncomplete(input){
    console.log(`'${input}' change to be uncomplete`)
  }

  asc_desc(input){
    console.log(input);
  }

  tag(task, content){
    console.log(`Tagged task "${task}" with tags: ${content}`)
  }

  filter(input){
    console.log(`Task: ${input.task} tags: ${input.tag}`)
  }
}


let start = new Controller()
start.process()
