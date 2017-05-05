const Model = require('./model');
const View = require('./view');

class Control{
  constructor(){
    this._model = new Model();
    this._view = new View();
    this._argv =[];
  }

  argvProcess(){
    var arrPerintah=[];
    process.argv.forEach((val, index) => {
      let hasil=[];
      if(index>1)
      {
        arrPerintah.push(val)
      }
    });
    this._argv=arrPerintah;
  }

  tampilDataCtr(){
    let command=this._argv[0]

    switch(command){

    case 'list' :
                      let list = this._model.list;
                      for (let i=0; i<list.length;i++) {
                        if(list[i]["complete"]===true)
                        this._view.tampilDataComplete(i,list[i]);
                        else this._view.tampilDataUnComplete(i,list[i])
                      } break;

    case 'list:outstanding' :
                      if(this._argv[1]==="asc"){
                        let list = this._model.manipulasiOustandingAsc();
                        for (let i=0; i<list.length;i++) {
                          if(list[i]["complete"]===true)
                          this._view.tampilDataComplete(i,list[i]);
                          else this._view.tampilDataUnComplete(i,list[i])
                        }

                      }else if(this._argv[1]==="desc"){
                        let list = this._model.manipulasiOustandingDesc();
                        for (let i=0; i<list.length;i++) {
                          if(list[i]["complete"]===true)
                          this._view.tampilDataComplete(i,list[i]);
                          else this._view.tampilDataUnComplete(i,list[i])
                        }
                      } break;

    case 'list:completed':
                      if(this._argv[1]==="asc"){
                        let list = this._model.manipulasiCompletedAsc();
                        for (let i=0; i<list.length;i++)
                        this._view.tampilDataComplete(i,list[i]);
                      }
                      else if(this._argv[1]==="desc"){
                        let list = this._model.manipulasiCompletedDesc();
                        for (let i=0; i<list.length;i++)
                        this._view.tampilDataComplete(i,list[i]);
                      } break;
    case 'filter':   this.filter(this._argv[1]); break;
    case 'add':      this.add(this._argv); break;
    case 'complete': this.listComplete(this._argv[1]); break;
    case 'tag':      this.tag(this._argv); break;
    case 'delete':   this.hapus(this._argv[1]); break;
    case 'uncomplete':      this.uncomplete(this._argv[1]); break;
    case 'help' :    this._view.tampilHelp(); break;

    default:         this._view.tampilHelp(); break;
  }
}

  add(input)
  {
    let obj={};
    let list = this._model.list
    input.shift();
    input = input.join(" ");
    obj.task=input;
    obj.complete=false;
    obj.created_date=Date();
    obj.completed_date=null;
    list.push(obj)
    this._model.write(list)
    this._view.tampilAdd(input)
  }

  listComplete(input)
  {
    let list = this._model.list
    let i=Number(input)-1;
    list[i].complete=true;
    list[i].completed_date= Date();
    this._model.write(list);
    this._view.tampilComplete(input);
  }

  tag(input)
  {
    let list = this._model.list;
    let index=+input[1]-1;
    input.shift();
    input.shift();
    for(let i=0; i<list.length;i++){
      if(index===i)
      list[i].tag=input;
    }
    this._model.write(list)
    this._view.tampilTag(input)
  }

  hapus(input)
  {
    let list = this._model.list;
    let data=list.splice(Number(input-1),1);
    var fs = require('fs');
    this._model.write(list)
    this._view.tampilDelete(data[0].task)
  }

  uncomplete(input)
  {
    let list = this._model.list;
    let i=Number(input)-1;
    list[i]["complete"]=false;
    list[i]["completed_date"]=null;
    this._model.write(list)
    this._view.tampilUncomplete()
  }

  filter(input){
    let list = this._model.list
    let hasil=[];
    for(let i=0; i<list.length;i++){

      for(let j=0; j<list[i].tag.length;j++){
        if(list[i].tag[j]===input)
          hasil.push(list[i])
      }
    }
    for(let i=0;i<hasil.length;i++)
      this._view.tampilFilterTag(i+1,hasil[i].task,hasil[i].tag);
  }
}

module.exports = Control;
