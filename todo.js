'use strict'
var jsonfile= require('jsonfile')

class Model {
  constructor(){
    this.filename = './data.json'
    this.command = []
    this.listTask = jsonfile.readFileSync(this.filename)
  }

  idTask(){
    return this.command[0]['task'].split(' ')[0]
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
    // let strJson = JSON.stringify(this._model.listTask)
    // return jsonfile.writeFileSync(this._model.filename, strJson)
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
    objTask['created_date'] = new Date().toString()
    objTask['checked_date'] = new Date().toString() // make sort works
    objTask['tag'] = []

    this._model.listTask.push(objTask)
    this.saveData()
    console.log(`${commandVal.toUpperCase()} baru saja ditambahkan ke list...`)
  }

  deleteTask(){
    if(this._model.idTask().length !==0 && this._model.idTask() <= this._model.listTask.length){
      console.log(`${this._model.thisTask()['task']} telah di delete dari list...`)
      this._model.listTask.splice(this._model.idTask()-1, 1)
      this.saveData()
      this._view.checkId
    } else {
      this._view.checkId()
    }
  }

  completeTask(){
    if(this._model.idTask().length !==0 && this._model.idTask() <= this._model.listTask.length){
      console.log(`${this._model.thisTask()['task']} telah diselesaikan dan ditandai...`)
      this._model.thisTask()['completed'] = true
      this._model.thisTask()['checked_date'] = new Date().toString()
      this.saveData()
    } else {
      this._view.checkId()
    }
  }

  uncompleteTask(){
    if(this._model.idTask().length !==0 && this._model.idTask() <= this._model.listTask.length){
      console.log(`${this._model.thisTask()['task']} telah di uncheck...`)
      this._model.thisTask()['completed'] = false
      this.saveData()
    } else {
      this._view.checkId()
    }
  }

  task(){
    if(this._model.idTask().length !==0 && this._model.idTask() <= this._model.listTask.length){
      console.log(`Task dengan id ${this._model.idTask()} adalah ${this._model.thisTask()['task']}`)
      if(this._model.thisTask()['tag'].length !== 0){
         console.log(`dengan tag ${this._model.thisTask()['tag']}`);
      }
    } else {
      this._view.checkId()
    }
  }

  listOutstandingAsc(){
    this._model.listTask.sort(function (a, b){
      return new Date(a.created_date) - new Date(b.created_date)
    })
    this.saveData()
    this._view.unCompletedList(this._model.listTask)
  }

  listOutstandingDesc(){
    this._model.listTask.sort(function (a, b){
      return new Date(b.created_date) - new Date(a.created_date)
    })
    this.saveData()
    this._view.unCompletedList(this._model.listTask)
  }

  listCompletedAsc(){
    this._model.listTask.sort(function (a, b){
      return new Date(a.checked_date) - new Date(b.checked_date)
    })
    console.log(this._model.listTask);
    this.saveData()
    this._view.completedList(this._model.listTask)
  }

  listCompletedDesc(){
    this._model.listTask.sort(function (a, b){
      return new Date(b.checked_date) - new Date(a.checked_date)
    })
    console.log(this._model.listTask);
    this.saveData()
    this._view.completedList(this._model.listTask)
  }

  addTag(){
    if(this._model.idTask().length !==0 && this._model.idTask() <= this._model.listTask.length){
      let obj = this._model.thisTask()
      let tagInput = this._model.command[0]['task'].split(' ')
      tagInput.shift()
      let tagList = tagInput.join(',')

      obj['tag'] = tagList
      console.log(`tag [${tagInput.join(', ')}] telah berhasil ditambahkan ke task ${obj['task']}`);
      this.saveData()
    } else {
      this._view.checkId()
    }
  }

  filterTag(){
    let invalidEntries = 0;
    let keyword = this._model.idTask()

    function filterByTag(item) {
      // console.log('-----------', item);
      // if (item.tag != undefined && item.tag.indexOf(keyword) !== -1) {
      //   return true;
      // }
      // invalidEntries++;
      return item.tag != undefined && item.tag.includes(keyword)
      // return false;
    }

    var arrByTag = this._model.listTask.filter(filterByTag);
    // var arrByTag = this._model.listTask.filter(function (item){
    //   filterByTag(item)
    // } );

    console.log(`Filtered by tag: ${keyword}`)
    this._view.list(arrByTag)
  }

  execute(){
    switch(this._model.command[0]['commandKey']){
      case 'help':
        this._view.help()
        break
      case 'list':
        this._view.list(this._model.listTask)
        break;
      case 'add':
        this.addTask()
        break;
      case 'task':
        this.task()
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
      case 'list:outstanding':
        if(this._model.command[0].task == 'asc'){
          console.log('Disortir berdasarkan task yang dicheck terbaru');
          this.listOutstandingAsc()
        } else if (this._model.command[0].task == 'desc') {
          console.log('Disortir berdasarkan task yang dicheck terlama');
          this.listOutstandingDesc()
        } else {
          console.log('harap masukan input yang benar');
        }
        break;
      case 'list:completed':
        if(this._model.command[0].task == 'asc'){
          console.log('Task yang sudah complete dan diurutkan dari yang terdahulu selesai');
          this.listCompletedAsc()
        } else if (this._model.command[0].task == 'desc') {
          console.log('Task yang sudah complete dan diurutkan dari yang terakhir selesai');
          this.listCompletedDesc()
        } else {
          console.log('harap masukan input yang benar');
        }
        break;
      case 'tag':
        this.addTag();
        break;
      case 'filter:':
        // this.filterTag()
        this.filterTag()
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
    console.log(`ketik: [node todo.js list:outstanding <asc> atau <desc>] untuk melihat daftar tugas sesuai tanggal pembuatan`)
    console.log(`ketik: [node todo.js list:completed <asc> atau <desc>] untuk melihat daftar TODO sesuai daftar yang sudah selesai`)
    console.log(`ketik: [node todo.js tag <id> <tag_name_1> atau <tag_name_2>] untuk menambahkan beberapa tag pada TODO`)
    console.log(`ketik: [node todo.js filter:<tag_name_1>] untuk mencari atau memfilter TODO dengan tag tertentu`)
  }

  reset_board() {
    console.log('\x1B[2J')
  }

  list(objList){
    console.log('\n======= Daftar Todo List =======');
    for(let i=0; i<objList.length; i++){
      let nameTask = objList[i]['task']
      let taskFlag = objList[i]['completed']
      if(taskFlag){
        console.log(`${i+1}. [v] ${nameTask}`)
      } else {
        console.log(`${i+1}. [ ] ${nameTask}`)
      }
    }
    if(objList.length == 0){
      console.log('Belum ada list apapun.');
    }
  }

  completedList(objList){
    console.log('\n======= Daftar Todo List =======');
    for(let i=0; i<objList.length; i++){
      let nameTask = objList[i]['task']
      let taskFlag = objList[i]['completed']
      if(taskFlag){
        console.log(`${i+1}. [v] ${nameTask}`)
      }
    }
    if(objList.length == 0){
      console.log('Belum ada list apapun.');
    }
  }

  unCompletedList(objList){
    console.log('\n======= Daftar Todo List =======');
    for(let i=0; i<objList.length; i++){
      let nameTask = objList[i]['task']
      let taskFlag = objList[i]['completed']
      if(!taskFlag){
        console.log(`${i+1}. [ ] ${nameTask}`)
      }
    }
    if(objList.length == 0){
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
