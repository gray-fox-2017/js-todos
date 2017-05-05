'use strict'
var jsonfile= require('jsonfile')

class Model {
  constructor(){
    this.filename = './data.json'
    this.command = []
    this.listTask = jsonfile.readFileSync(this.filename)
  }

  idTask(){
    return this.command[0]['task']
  }

  thisTask(){
    return this.listTask[this.idTask()-1]
  }
}

class Controller {
  constructor(){
    this._model = new Model()
    this._view = new View()
  }

  saveData(){
    return jsonfile.writeFileSync(this._model.filename, this._model.listTask)
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
    this.saveData()
    console.log(`${commandVal.toUpperCase()} baru saja ditambahkan ke list...`)
  }

  deleteTask(){
    console.log(`${this._model.thisTask()['task']} telah di delete dari list...`)
    this._model.listTask.splice(this._model.idTask()-1, 1)
    this.saveData()
    this._view.checkId
  }

  completeTask(){
    if(this._model.idTask().length !==0 && this._model.idTask() <= this._model.listTask.length){
      console.log(`${this._model.thisTask()['task']} belum diselesaikan...`)
      this._model.thisTask()['completed'] = true
      this.saveData()
    } else {
      this._view.checkId()
    }
  }

  uncompleteTask(){
    if(this._model.idTask().length !==0 && this._model.idTask() <= this._model.listTask.length){
      console.log(`${this._model.thisTask()['task']} telah diselesaikan...`)
      this._model.thisTask()['completed'] = false
      this.saveData()
    } else {
      this._view.checkId()
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
    console.log(`=====================================How to use=====================================`)
    console.log(`ketik: [node todo.js help] untuk menampilkan cara menggunakan fungsi ini`)
    console.log(`ketik: [node todo.js list] untuk menampilkan list todo kamu`)
    console.log(`ketik: [node todo.js add <task_content] untuk menambahkan todo list kamu`)
    console.log(`ketik: [node todo.js task <task_id>] untuk melihat detail todo kamu`)
    console.log(`ketik: [node todo.js delete <task_id>] untuk menghapus todo kamu`)
    console.log(`ketik: [node todo.js complete <task_id>] untuk menandai bahwa todo kamu telah selesai`)
    console.log(`ketik: [node todo.js uncomplete <task_id>] untuk menghilangkan tanda selesai pada todo mu`)
  }

  reset_board() {
    console.log('\x1B[2J')
  }

  list(){
    this.reset_board()
    console.log('\n======= Daftar Todo List =======');
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

  checkId(){
    if(this._model.listTask.length == 0){
      console.log('Belum ada list apapun.');
    } else {
      console.log('ID Task yang kamu masukan salah');
    }
  }
}

let argv = process.argv
let runner = new Controller()
runner._view.reset_board()
runner.readCommands(argv)
console.log('\n')
