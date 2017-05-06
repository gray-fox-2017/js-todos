"use strict"

let fs = require("fs");

// Models
function readData() {
  return JSON.parse(fs.readFileSync("data.json", "utf8"));
}

function writeData(data) {
  fs.writeFileSync("data.json", JSON.stringify(data, null, 3));
}

function sortId(data) {
  for (let i = 0; i < data.length; i++) {
    data[i].id = i+1;
  }
  return data;
}

function add(task) {
  let data = readData();
  let object = {
    "id": 0,
    "task": task,
    "completed": false,
    "created_at": new Date(),
    // "completed_at": "",
    "tags": []
  };
  data.push(object);
  data = sortId(data)
  writeData(data);
  console.log(`Added ${object.task} to your TODO list...`);
}

function addTag(id, tags) {
  let data = readData();
  for (let i = 0; i < data.length; i++) {
    if (data[i].id == id) {
      data[i].tags = tags;
      console.log(`Tagged task ${data[i].task} with tags: ${data[i].tags}`);
      break;
    }
  }
  writeData(data);
}

function deleting(id) {
  let data = readData();
  for (let i = 0; i < data.length; i++) {
    if (data[i].id == id) {
      data.splice(i, 1);
      break;
    }
  }
  data = sortId(data)
  writeData(data);
  console.log(`Deleted data with id: ${id} from your TODO list...`);
}

function complete(id) {
  let data = readData();
  for (let i = 0; i < data.length; i++) {
    if (data[i].id == id) {
      data[i].completed = true;
      data[i].completed_at = new Date();
      break;
    }
  }
  writeData(data);
}

function uncomplete(id) {
  let data = readData();
  for (let i = 0; i < data.length; i++) {
    if (data[i].id == id) {
      data[i].completed = false;
      break;
    }
  }
  writeData(data);
}

function sortAsc(data) {
  let data2 = data.sort(function(a,b) {
    return new Date(a.created_at) - new Date(b.created_at);
  });
  data2 = sortId(data2);
  return data2;
}

function sortDsc(data) {
  let data2 = data.sort(function(a,b) {
    return new Date(b.created_at) - new Date(a.created_at);
  });
  data2 = sortId(data2);
  return data2;
}


// View
function help() {
  let showArr = ["$ node todo.js # will call help", "$ node todo.js help",
  "$ node todo.js list", "$ node todo.js add <task_content>",
  "$ node todo.js task <task_id>", "$ node todo.js delete <task_id>",
  "$ node todo.js complete <task_id>", "$ node todo.js uncomplete <task_id>",
  "$ node todo.js list:outstanding asc|desc", "$ node todo.js list:completed asc|desc",
  "$ node todo.js tag <task_id> <tag_name_1> <tag_name_2> ... <tag_name_N>",
  "$ node todo.js filter:<tag_name>"];
  console.log(showArr.join("\n"));
}

function list(data) {
  if (data.length > 0) {
    for (let i = 0; i < data.length; i++) {
      console.log(`${data[i].id}. [${data[i].completed ? "X" : " "}] ${data[i].task}`);
    }
  }
  else {
    console.log("Empty tasks");
  }
}

function tampil(id) {
  let data = readData();
  if(data.length > 0){
    for (let i = 0; i < data.length; i++) {
      if (data[i].id == id) {
        console.log(`${data[i].id}. ${data[i].task}`);
      }
    }
  }
}

function filter(tag) {
  let data = readData();
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].tags.length; j++) {
      if (data[i].tags[j] === tag) {
        console.log(`${data[i].id}. ${data[i].task} [${data[i].tags}]`);
        break;
      }
    }
  }
}

function sortBy(data, sortType) {
  if (sortType == "asc") {
    let data2 = sortAsc(data);
    return data2;
  }
  else if (sortType == "desc") {
    let data2 = sortDsc(data);
    return data2;
  }
  else {
    let data2 = sortAsc(data);
    return data2;
  }
}

function listOutstanding(sortType) {
  let data = readData();
  if (data.length > 0) {
    let data2 = sortBy(data, sortType);
    for (let i = 0; i < data.length; i++) {
      console.log(`${data2[i].id}. [${data2[i].completed ? "X" : " "}] ${data2[i].task} Date created: ${data2[i].created_at}`);
    }
  }
  else {
    console.log("Empty tasks");
  }
}

function listCompleted(sortType) {
  let data = readData();
  if (data.length > 0) {
    let data2 = sortBy(data, sortType);
    for (let i = 0; i < data.length; i++) {
      if (data2[i].completed === true) {
        console.log(`${data2[i].id}. [${data2[i].completed ? "X" : " "}] ${data2[i].task} Date completed: ${data2[i].completed_at}`);
      }
    }
  }
  else {
    console.log("Empty tasks");
  }
}


// Controller
function run(param) {
  switch (param[0]) {
    case "help":
      help();
      break;
    case "list":
      list(readData());
      break;
    case "list:outstanding":
      listOutstanding(param[1]);
      break;
    case "list:completed":
      listCompleted(param[1]);
      break;
    case "add":
      param.shift();
      add(param.join(" "));
      break;
    case "tampil":
      tampil(param[1]);
      break;
    case "delete":
      deleting(param[1]);
      break;
    case "complete":
      complete(param[1]);
      break;
    case "uncomplete":
      uncomplete(param[1]);
      break;
    case "tag":
      let paramCopy = param.slice("");
      paramCopy.shift();
      paramCopy.shift();
      addTag(param[1], paramCopy);
      break;
    case "filter:":
      filter(param[1]);
      break;
    default:
      console.log("Please input correct command.");
      break;
  }
}

// Driver code
let arg = process.argv.slice(2, process.argv.length);
run(arg);
