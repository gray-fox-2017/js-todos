const Model = require('./model.js')
const View = require('./view.js')

class Controller {
  constructor() {
    this.model = new Model()
    this.view = new View()
  }

  process(){
    switch(process.argv[2]){
      case "help":
        this.view.help();
      break;
      case "list":
        this.view.list(this.model.file);
      break;
      case "add":
        this.add_task(process.argv[3]);
      break;
      case "task":
        this.task();
      break;
      case "delete":
        this.delete(process.argv[3]);
      break;
      case "complete":
        this.complete(process.argv[3]);
      break;
      case "uncomplete":
        this.uncomplete(process.argv[3]);
      break;
      case "list:outstanding":
        this.outstanding(process.argv[3]);
      break;
      case "list:complete":
        this.list_completed(process.argv[3]);
      break;
      case "tag":
        this.tag(process.argv[3],process.argv.slice(4));
      break;
      case "filter":
        this.filter(process.argv[3]);
      break;
    }
  }

  add_task(input){
    let filedata = this.model.file
    filedata.push({
      task:input,
      complete:false,
      create_at:new Date().toISOString()
    })
    this.model.write(filedata)
    this.view.add(input)
  }

  task(){
    let filedata = this.model.file
    filedata.filter((element)=>{
        this.view.task(element)
    })
  }

  delete(input){
    let filedata = this.model.file
    filedata.splice(input-1,1)
    this.model.write(filedata)
    this.view.delete(input)
  }

  complete(input){
    let filedata = this.model.file
    if(filedata[input-1].complete == false){
      filedata[input-1].complete = true;
      this.model.write(filedata)
      this.view.complete(input)
    }
  }

  uncomplete(input){
    let filedata = this.model.file
    if(filedata[input-1].complete == true){
      filedata[input-1].complete = false;
      this.model.write(filedata)
      this.view.uncomplete(input)
    }
  }

  outstanding(input){
    let filedata = this.model.file

    if(input == 'asc' || input == undefined){
      let final = filedata.sort((a,b)=>{
        if (a.create_at < b.create_at){
          return -1;
        }
        if (a.create_at > b.create_at){
          return 1;
        }
        return 0;
      })
      this.view.asc_desc(final)
    } else {
      let final = filedata.sort((a,b)=>{
        if (a.create_at < b.create_at){
          return 1;
        }
        if (a.create_at > b.create_at){
          return -1;
        }
        return 0;
      })
      this.view.asc_desc(final)
    }
  }

  list_completed(input){
    let filedata = this.model.file

    if(input == 'asc' || input == undefined){
      let final = filedata.sort((a,b)=>{
        if (a.create_at < b.create_at){
          return -1;
        }
        if (a.create_at > b.create_at){
          return 1;
        }
        return 0;
      })
      this.view.asc_desc(final)
    } else {
      let final = filedata.sort((a,b)=>{
        if (a.create_at < b.create_at){
          return 1;
        }
        if (a.create_at > b.create_at){
          return -1;
        }
        return 0;
      })
      this.view.asc_desc(final)
    }
  }

  tag(input,value){
    let filedata = this.model.file
    filedata[input-1].tag = value
    this.model.write(filedata)
    this.view.tag(filedata[input-1].task, value)
  }

  filter(input){
    let filedata = this.model.file
    filedata.filter((element)=>{
      if(element.hasOwnProperty("tag")){
          element.tag.forEach((value)=>{
            if(input == value){
              this.view.filter(element)
            }
          })
      }
    })
  }
}

module.exports = Controller;
