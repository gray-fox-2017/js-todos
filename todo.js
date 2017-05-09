class TODO {
    constructor(data) {
        this._data = data
    }

    help() {
        console.log(`list           : Melihat daftar TODO`);
        console.log(`add            : Menambahkan TODO ke dalam list`);
        console.log(`task <id>      : Melihat detail TODO`);
        console.log(`delete         : Menghapus TODO`);
        console.log(`complete <id>  : Menandai bahwa TODO selesai`);
        console.log(`uncomplete <id>: Menandai bahwa TODO belum selesai`);
    }

    add(sentence) {
        let obj = {
            "task": sentence,
            "complete": false
        }
        this._data.push(obj)
        console.log(`Added "${sentence}" from your TODO list`);
    }

    saveToFile() {
        fs.writeFile('data.json', JSON.stringify(this._data, null, 4), (err) => {
            if (err) {
                console.log(err);
            }
        })
    }

    list() {
        let str = ''
        for (let i = 0; i < this._data.length; i++) {
            if (this._data[i].complete == false) {
                str += `${i+1}. [ ] ${this._data[i].task} \n`
            } else {
                str += `${i+1}. [x] ${this._data[i].task} \n`
            }
        }
        console.log(str)
    }

    delete(num) {
        let data = this._data.splice(num - 1, 1)
        let result = `Deleted "${data[0].task}" from your TODO list...`
        return result
    }

    task(num) {
        let taskStr = this._data[num - 1].task
        let statusStr = this._data[num - 1].complete
        return `Task ${num}: ${taskStr} \nComplete: ${statusStr}`
    }

    complete(num) {
        if (this._data[num - 1].complete == false) {
            this._data[num - 1].complete = true
            return `${num}. [x] ${this._data[num-1].task}`
        } else {
            return `${num}. [x] ${this._data[num-1].task}`
        }
    }

    uncomplete(num) {
        if (this._data[num - 1].complete == false) {
            return `${num}. [ ] ${this._data[num-1].task}`
        } else {
            this._data[num - 1].complete = false
            return `${num}. [ ] ${this._data[num-1].task}`
        }
    }
}

let fs = require('fs')
let data = JSON.parse(fs.readFileSync('data.json'))

let todo = new TODO(data)
let processConvert = process.argv
// console.log(processConvert);
if (processConvert[2] == "add") {
    todo.add(String(processConvert.slice(3)).replace(/,/g, ' '))
    todo.saveToFile()
} else if (processConvert[2] == "list") {
    todo.list()
} else if (processConvert[2] == "delete") {
    console.log(todo.delete(processConvert[3]));
    todo.saveToFile()
} else if (processConvert[2] == "task") {
    console.log(todo.task(processConvert[3]));
} else if (processConvert[2] == "complete") {
    console.log(todo.complete(processConvert[3]));
    todo.saveToFile()
} else if (processConvert[2] == "uncomplete") {
    console.log(todo.uncomplete(processConvert[3]));
    todo.saveToFile()
} else if (processConvert[2] == "help") {
    console.log(todo.help(processConvert[3]));
} else {
    console.log(`Command is not found`);
}