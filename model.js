let View = require('./view.js');

class Model {
  constructor() {
    this.fs = require('fs');
    this.data = JSON.parse(this.fs.readFileSync('data.json').toString());
    this.view = new View();
  }
  write(data){
    this.fs.writeFile('data.json', JSON.stringify(data) , (err) => {
    if (err) throw err;
    this.view.file_saved()
    });
  }
}

module.exports = Model;
