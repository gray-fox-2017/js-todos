'use strict'
var jsonfile= require('jsonfile')

class Model {
  constructor(){
    this.filename = './data.json'
    this.command = []
    this.listTask = jsonfile.readFileSync(this.filename)
  }
}

class Controller {
  constructor(){
    this._model = new Model()
    this._view = new View()
  }

  readCommands(command_name){
    let commandKey = command_name[2]
    let commandVal = []

    for (let i=3; i<command_name.length; i++){
      commandVal.push(command_name[i])
    }

    let objCommand = {}
    objCommand['task'] = commandVal.join(' ')
    objCommand['commandKey'] = commandKey
    this._model.command.push(objCommand)
    return this.execute()
  }

  addTask(){
    let objTask = {}
    let commandVal = this._model.command[0]['task']
    objTask['task'] = commandVal
    objTask['completed'] = false
    this._model.listTask.push(objTask)
    jsonfile.writeFileSync(this._model.filename, this._model.listTask)
    console.log(`${commandVal.toUpperCase()} baru saja ditambahkan ke list...`)
  }

  idTask(){
    return this._model.command[0]['task']
  }

  deleteTask(){
    let idTask = this.idTask()
    this._model.listTask.splice(idTask-1, 1)
    jsonfile.writeFileSync(this._model.filename, this._model.listTask)
    // if(this._model.listTask.length == 0){
    //   console.log('Belum ada list apapun.');
    // } else {
    //   console.log('ID Task yang kamu masukan salah');
    // }
  }

  completeTask(){
    let idTask = this._model.command[0]['task']
    if(idTask.length!==0 && idTask <= this._model.listTask.length){
      for(let i=1; i<=this._model.listTask.length; i++){
        if(idTask==i){
          let thisTask = this._model.listTask[i-1]
          console.log(`${thisTask['task']} telah selesai dikerjakan...`);
          thisTask['completed'] = true
          jsonfile.writeFileSync(this._model.filename, this._model.listTask)
        }
      }
    } else if(this._model.listTask.length == 0){
      console.log('Belum ada list apapun.');
    } else {
      console.log('ID Task yang kamu masukan salah');
    }
  }

  uncompleteTask(){
    let idTask = this._model.command[0]['task']
    if(idTask.length!==0 && idTask <= this._model.listTask.length){
      for(let i=1; i<=this._model.listTask.length; i++){
        if(idTask==i){
          let thisTask = this._model.listTask[i-1]
          console.log(`${thisTask['task']} belum dikerjakan...`);
          thisTask['completed'] = false
          jsonfile.writeFileSync(this._model.filename, this._model.listTask)
        }
      }
    } else if(this._model.listTask.length == 0){
      console.log('Belum ada list apapun.');
    } else {
      console.log('ID Task yang kamu masukan salah');
    }
  }

  execute(){
    switch(this._model.command[0]['commandKey']){
      case 'help':
        this._view.help()
        break
      case 'list':
        this._view.list()
        break;
      case 'add':
        this.addTask()
        break;
      case 'task':
        this._view.task()
        break;
      case 'delete':
        this.deleteTask()
        break;
      case 'complete':
        this.completeTask()
        break;
      case 'uncomplete':
        this.uncompleteTask()
        break;
      default:
        this._view.help()
    }
  }
}

class View {
  constructor(){
    this._model = new Model()
  }

  help(){
    console.log(`ketik: [node todo.js help] untuk menampilkan cara menggunakan fungsi ini`)
    console.log(`ketik: [node todo.js list] untuk menampilkan list todo kamu`)
    console.log(`ketik: [node todo.js add <task_content] untuk menambahkan todo list kamu`)
    console.log(`ketik: [node todo.js task <task_id>] untuk melihat detail todo kamu`)
    console.log(`ketik: [node todo.js delete <task_id>] untuk menghapus todo kamu`)
    console.log(`ketik: [node todo.js complete <task_id>] untuk menandai bahwa todo kamu telah selesai`)
    console.log(`ketik: [node todo.js uncomplete <task_id>] untuk menghilangkan tanda selesai pada todo mu`)
  }

  list(){
    console.log('======= Daftar Todo List =======');
    for(let i=0; i<this._model.listTask.length; i++){
      let nameTask = this._model.listTask[i]['task']
      let taskFlag = this._model.listTask[i]['completed']
      if(taskFlag){
        console.log(`${i+1}. [v] ${nameTask}`)
      } else {
        console.log(`${i+1}. [ ] ${nameTask}`)
      }
    }
    if(this._model.listTask.length == 0){
      console.log('Belum ada list apapun.');
    }
  }

}

let argv = process.argv
let runner = new Controller()
runner.readCommands(argv)
// console.log(runner._model.listTask);
// console.log(runner._model.command)
