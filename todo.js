const fs = require('fs');
const rgx_outstanding = /outstanding/;
const rgx_completed = /completed/;
const rgx_uncomplete = /uncomplete/;
const rgx_digit = /\d+/gi;
const rgx_asc = /asc/i;
const rgx_desc = /desc/i;

class Model {
  constructor(filename) {
    this._filename = filename;
    this.readFile();
  }

  readFile() {
    this._tasks = JSON.parse(fs.readFileSync(this._filename,'utf8').toString());
  }

  writeFile() {
    fs.writeFileSync(this._filename,JSON.stringify(this._tasks));
  }
  cekIdExist(id) {
    id = id.toString();
    return this._tasks.findIndex((x)=>x.id === id);
  }

  generateID() {
    let len = this._tasks.length;
    return (len !== 0? (parseInt(this._tasks[len-1].id)+1).toString() : '1');
  }
  updateTask(id,status = '',task = {}) {
    let idx = this.cekIdExist(id);
    if( idx !== -1) {
      if (status === '') this._tasks[idx] = task;
      else {
        this._tasks[idx].status = status;
        this._tasks[idx].completed_date = (status === 0 ? '' : new Date());
      }
      this.writeFile();
      return this._tasks[idx].task;
    }
    return false;
  }

  addTags(id,tags) {
    let idx = this.cekIdExist(id);
    if( idx !== -1) {
      tags.forEach((x)=> this._tasks[idx].tag.push(x));
      this._tasks[idx].tag = this._tasks[idx].tag.filter((v,i,a)=>a.indexOf(v) === i);
      this.writeFile();
      return this._tasks[idx].task;
    }
    return false;
  }

  filterTags(tag) {
    let filtered;
    filtered = this._tasks.filter((x)=>{
      if (x.tag.findIndex((y)=> y === tag) !== -1) return x;
    });
    return filtered;
  }

  addTask(task) {
    task["created_date"] = new Date();
    task["completed_date"] = null;
    task["tag"] = [];
    task["status"] = 0;
    task["id"] = this.generateID();
    this._tasks.push(task);
    this.writeFile();
    return task.task;
  }

  viewTask(id) {
    let idx = this.cekIdExist(id);
    return (idx !== -1 ? this._tasks[idx] : false);
  }

  removeTask(id) {
    let task;
    let idx = this.cekIdExist(id);
    if( idx !== -1) {
      task = this._tasks[idx].task;
      this._tasks.splice(idx,1);
      this.writeFile();
      return task;
    }
    return false;
  }

  filterTask(criteria,sort) {
    let filtered;
    switch (criteria) {
      case 'outstanding' :
        filtered = this._tasks.filter((x)=> x.status === 0);
        if (sort === 'asc') filtered = filtered.sort((a,b) => a.created_date > b.created_date);
        else if (sort === 'desc') filtered =filtered.sort((a,b) => a.created_date < b.created_date);
      break;
      case 'completed' :
        filtered = this._tasks.filter((x)=> x.status === 1);
        if (sort === 'asc') filtered = filtered.sort((a,b) => a.completed_date > b.completed_date);
        else if (sort === 'desc') filtered = filtered.sort((a,b) => a.completed_date < b.completed_date);
      break;
      default :
        filtered = this._tasks;
      break;
    }
    console.log(`${criteria} ${sort} sort`);
    return filtered;
  }
}

class Controller {
  constructor(filename) {
    this._model = new Model(filename);
    this._view = new View();
    this.doCommand();
  }

  filterTags(tag) {
    let res = this._model.filterTags(tag);
    this._view.printTask(res);
  }

  showHelp() {
    this._view.showHelp();
  }

  showCertainTask(task = {}){
    this._view.printSingleTask(task);
  }

  showList(tipe = 'all',sort = 'not') {
    let tasks = this._model.filterTask(tipe,sort);
    this._view.printTask(tasks);
  }

  printRespond(msg) {
    this._view.printRespond(msg);
  }

  cls() {
    console.log("\x1B[2J")
  }

  doCommand() {
    this.cls();
    let commands = process.argv.filter((x) => x.startsWith('/') === false);
    let clen = commands.length;
    let command0;
    let msg = '';
    let res = false;

    if (clen > 0) {
      let command0 = commands[0].toLowerCase().trim();
      if (command0 === 'help') {
        this.showHelp();
      } else if (command0.startsWith('list')) {
        let tipe = 'all';
        let sort = 'not';
        if (rgx_outstanding.test(command0)) tipe = 'outstanding';
        else if (rgx_completed.test(command0)) tipe = 'completed';
        if (rgx_asc.test(commands.join(' '))) sort = 'asc';
        else if (rgx_desc.test(commands.join(' '))) sort = 'desc';
        this.showList(tipe,sort);
      } else if (command0.startsWith('add')) {
        let taskname = commands.filter((v,i,a)=> i > 0 ).join(' ');
        msg = `[SUCCESS][ADD] Added `+this._model.addTask({task:taskname})+` to your tasks`;
      }  else if (command0.startsWith('filter')) {
        if(commands.length > 1) {
          let tag = commands[1];
          this.filterTags(tag);
        } else msg = '[FAILED][FILTER] Invalid Tag';

      } else if (command0.startsWith('task')) {
          let id = commands.join('').match(/\d+/gi);
          if (id !== null) {
            res = this._model.viewTask(id);
            if (res === false) msg  = '[FAILED][DETAIL] Invalid ID';
            else this.showCertainTask(res);
          } else msg  = '[FAILED][DETAIL] Invalid ID';
          if (msg !== false) this.printRespond(msg);
      } else {
        let id = commands.join('').match(/\d+/gi);
        if (command0.startsWith('delete')) {
          if (id !== null) res = this._model.removeTask(id);
          msg = (res === false ? '[FAILED][DELETE] Invalid ID' : `[SUCCESS][DELETE] Delete ${res} from your list`);
        } else if (command0.startsWith('complete')) {
          console.log('complete');
          if (id !== null) res = this._model.updateTask(id,1);
          msg = (res === false ? '[FAILED][COMPLETE] Invalid ID' : `[SUCCESS][COMPLETE] Set ${res} as completed task`);
        } else if (command0.startsWith('uncomplete')) {
          if (id !== null) res = this._model.updateTask(id,0);
          msg = (res === false ? '[FAILED][UNCOMPLETE] Invalid ID' : `[SUCCESS][UNCOMPLETE] Set ${res} as uncomplete task`);
        } else if (command0.startsWith('tag') ) {
          if (id !== null) {
              let tagss = commands.filter((v,i,a)=> i > 1);
              if (tagss.length === 0) msg = '[FAILED][TAG] Invalid Tags';
              else {
                res = this._model.addTags(id,tagss);
                msg = (res === false ? '[FAILED][TAG] Invalid ID' : `[SUCCESS][TAG] Set ${tagss.join(',')} tag to ${res}`);
              }
            }
          else msg = '[FAILED][TAG] Invalid ID';
        }

        if (res !== false) this.showList();
        if (msg !== '') this.printRespond(msg);
      }

    }
  }
}

class View {
  constructor() {}

  showHelp() {
    console.log('Menu');
    console.log('=====================================');
    console.log('help');
    console.log('list');
    console.log('list:outstanding asc|desc');
    console.log('list:completed asc|desc');
    console.log('add');
    console.log('task task_id');
    console.log('delete task_id');
    console.log('complete task_id');
    console.log('uncomplete task_id');
    console.log('filter tag_name');
    console.log('tag task_id tag_name1 .. tag_namen');
  }

  printTask(tasks) {
    let i = 0;
    let status = '';
    console.log('List Tasks');
    tasks.forEach((x)=>{
      status = (x.status === 1 ? 'X' : ' ');
      let tag = (x.tag.length >0? `[${x.tag.join(',')}]`:'' );
      console.log(`${x.id} [${status}] ${x.task} ${tag}`);
    });
  }

  printSingleTask(task) {
    let status = task.status === 1 ? 'X' : ' ';
    let tag = (task.tag.length >0? `[${task.tag.join(',')}]`:'' );
    console.log(`${task.id} [${status}] ${task.task} ${tag}`);
  }

  printRespond(msg) {
    console.log(msg);
  }
}

const start = new Controller('data.json');