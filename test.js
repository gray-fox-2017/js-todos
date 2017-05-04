
var jsonfile = require('jsonfile')
var file = './data.json'

var fileData = jsonfile.readFileSync(file)


// jsonfile.writeFileSync(file, obj)

console.log(fileData);
