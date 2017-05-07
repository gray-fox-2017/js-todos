const fs = require('fs');

class Model {
  constructor() {
    this.file = JSON.parse(fs.readFileSync('data.json', 'utf-8'))
  }
  write(data){
    fs.writeFileSync('data.json', JSON.stringify(data))
  }
}

module.exports = Model;
