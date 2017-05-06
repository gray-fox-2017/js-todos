let View = require('./view.js');
let Model = require('./model.js')

class Controller {
  constructor() {
    this.view = new View();
    this.model = new Model();
    this.argv = process.argv;
  }

  param_input(){
    switch (this.argv[2]) {
      case "help":
        this.view.help()
        break;

      case "list":
        this.list()
        break;

      case "list:outstanding":
        this.list_outstanding();
        break;

      case "list:outstanding:asc":
        this.list_outstanding_asc();
        break;

      case "add":
        this.add(this.argv[3])
        break;

      case "delete":
        this.delete_task(this.argv[3])
        break;

      case "task":
        this.detail_task(this.argv[3]);
        break;

      case "completed":
        this.completed(this.argv[3]);
        break;

      case "uncompleted":
        this.uncompleted(this.argv[3]);
        break;

      case "tag":
        this.tag(this.argv);
        break;
      //
      // case "filter":
      //   filter(argv[3]);
      //   break;

      default:
      this.view.help()
    }
  }

  list(){
    let id = "";
    let task = "";
    let check = "";
    let created_at = "";
    let tag = "";
    this.view.list_header()
    for (let i = 0 ; i < this.model.data.length ; i++ ){
      if (this.model.data[i].completed == true){
        check = "[X]"
      } else {
        check = "[ ]"
      }
      this.view.list_content(this.model.data[i].id,this.model.data[i].task,check, this.model.data[i].created_at,this.model.data[i].tag)
    }
  }

  add(task_name){
    let tmp = {};
    let tmp_str = "";
    tmp["id"] = Math.ceil(Math.random()*1000);
    for (let h = 1 ; h < this.model.data.length; h++){
      if (tmp["id"] === this.model.data[h-1].id){
        tmp["id"] = Math.ceil(Math.random()*1000);
      }
    }
    tmp["task"] = task_name;
    tmp["completed"] = false;
    tmp["created_at"] = new Date();
    tmp["tag"] = [];
    tmp_str = tmp["task"];
    this.model.data.push(tmp);
    this.model.write(this.model.data);
  }

  delete_task(task_id){
    let tmp_str = ""
    for (let k = 1; k < this.model.data.length + 1; k++){
      if (this.model.data[k - 1].id == task_id){
        tmp_str = this.model.data[k - 1].task
        this.model.data.splice(k - 1, 1);
      }
    }
    this.model.write(this.model.data);
  }

  completed(task_id){
    for (let k = 1; k < this.model.data.length + 1; k++){
      if (this.model.data[k - 1].id == task_id){
        this.model.data[k - 1].completed = true;
      }
    }
    this.model.write(this.model.data);
  }

  uncompleted(task_id){
    for (let k = 1; k < this.model.data.length + 1; k++){
      if (this.model.data[k - 1].id == task_id){
        this.model.data[k - 1].completed = false;
      }
    }
    this.model.write(this.model.data);
  }

  tag(argv){
    let index_id = "";
    let tmp_tag = [];
    for (let o = 0; o < this.model.data.length; o++){
      if (this.model.data[o].id == this.argv[3]){
        index_id = o;
      }
    }
    for (let l = 4; l < this.argv.length;l++){
      tmp_tag.push(this.argv[l]);
    }

    this.model.data[index_id].tag = tmp_tag;
    this.model.write(this.model.data);
  }

  detail_task(task_id){
    for (let k = 1; k < this.model.data.length + 1; k++){
      if (this.model.data[k - 1].id == task_id){
          let check = "";
          if (this.model.data[k - 1].completed == true){
            check = "[X]"
          } else {
            check = "[ ]"
          }
        this.view.list_header();
        this.view.list_content(this.model.data[k - 1].id,this.model.data[k - 1].task,this.model.data[k - 1].completed,check, this.model.data[k - 1].created_at,this.model.data[k - 1].tag)
      }
    }
  }

  list_outstanding(){
    //descending
    let tmp_sort = this.model.data.sort(function(a,b){
          return new Date(b.created_at) - new Date(a.created_at);
        })
    this.view.list_header();
    for (let i = 0 ; i < tmp_sort.length ; i++){
      let check = "";
      if (tmp_sort[i].completed == true){
        check = "[X]"
      } else {
        check = "[ ]"
      }
      this.view.list_content(tmp_sort[i].id,tmp_sort[i].task,check, tmp_sort[i].created_at,tmp_sort[i].tag)
    }
  }

  list_outstanding_asc(){
    //ascending
    let tmp_sort = this.model.data.sort(function(a,b){
          return new Date(a.created_at) - new Date(b.created_at);
        })
    this.view.list_header();
    for (let i = 0 ; i < tmp_sort.length ; i++){
      let check = "";
      if (tmp_sort[i].completed == true){
        check = "[X]"
      } else {
        check = "[ ]"
      }
      this.view.list_content(tmp_sort[i].id,tmp_sort[i].task,check, tmp_sort[i].created_at,tmp_sort[i].tag)
    }
  }

}

module.exports = Controller;
