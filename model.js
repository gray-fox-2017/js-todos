class Model{
  constructor(){
    this._list="";
  }

  get list()
  {
    var fs = require('fs');
    var str = fs.readFileSync('data.json');
    var list = JSON.parse(str);
    this._list=list;
    return this._list;
  }

  write(list){
    var fs = require('fs');
    fs.writeFile("./data.json",JSON.stringify(list), function(err) {
      if(err)
      return false;
      return true;
    });
  }

  manipulasiOustandingAsc(){
    return this.list.sort(function(a,b) {
      return new Date(a.created_date).getTime()-new Date(b.created_date).getTime();});
    }
  manipulasiOustandingDesc(){
    return this.list.sort(function(b,a) {
      return new Date(a.created_date).getTime()-new Date(b.created_date).getTime();});
    }

  manipulasiCompletedAsc(){
    let hasil=[]
    for(let i=0; i<this.list.length;i++)
    {
      if(this.list[i]['complete']===true)
      hasil.push(this.list[i]);
    }
    return hasil.sort(function(a,b) {
      return new Date(a.completed_date).getTime()-new Date(b.completed_date).getTime();
    });
  }

    manipulasiCompletedDesc(){
      let hasil=[]
      for(let i=0; i<this.list.length;i++)
      {
        if(this.list[i]['complete']===true)
        hasil.push(this.list[i]);
      }
      return hasil.sort(function(b,a) {
        return new Date(a.completed_date).getTime()-new Date(b.completed_date).getTime()
      });
    }
}

module.exports = Model;
