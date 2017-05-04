const argv = process.argv;
const fs = require('fs');
let data = JSON.parse(fs.readFileSync('data.json').toString());


switch (argv[2]) {
  case "help":
    help()
    break;

  case "list":
    list()
    break;

  case "add":
    add(argv[3])
    break;

  case "delete":
    delete_task(argv[3])
    break;

  case "task":
    detail_task(argv[3]);
    break;

  case "completed":
    completed(argv[3]);
    break;

  case "uncompleted":
    uncompleted(argv[3]);
    break;

  default:
  help()
}

function help() {
  console.log("Masukkan (list) untuk melihat seluruh task");
  console.log("Masukkan (add task_content) untuk menambah task");
  console.log("Masukkan (task task_id) untuk melihat detail task");
  console.log("Masukkan (delete task_id) untuk menghapus task");
  console.log("Masukkan (completed task_id) untuk menandai task completed");
  console.log("Masukkan (uncompleted task_id) untuk menhapus tanda task completed");
}

function list() {
  console.log("id | task                  | completed?");
  let check = "";
  for (let i = 0 ; i < data.length ; i++ ){
    if (data[i].completed == true){
      check = "[X]"
    } else {
      check = "[ ]"
    }
    console.log(`${data[i].id}  | ${data[i].task}                 | ${check}`);
  }
}

function add(task_name) {
  let tmp = {};
  let tmp_str = "";
  // tmp["id"] = data[data.length - 1].id + 1;
  tmp["id"] = Math.ceil(Math.random()*1000);
  for (let h = 1 ; h < data.length; h++){
    if (tmp["id"] === data[h-1].id){
      tmp["id"] = Math.ceil(Math.random()*1000);
    }
  }
  tmp["task"] = task_name;
  tmp["completed"] = false;
  tmp_str = tmp["task"];
  data.push(tmp);
  fs.writeFile('data.json', JSON.stringify(data) , (err) => {
  if (err) throw err;
  console.log(`${tmp_str} has been added to task list`);
  console.log('The file has been saved!');
  });
}

function delete_task(task_id) {
  let tmp_str = ""
  for (let k = 1; k < data.length + 1; k++){
    if (data[k - 1].id == task_id){
      tmp_str = data[k - 1].task
      data.splice(k - 1, 1);
    }
  }
  fs.writeFile('data.json', JSON.stringify(data) , (err) => {
  if (err) throw err;
  console.log(`${tmp_str} has been deleted from task list`);
  console.log('The file has been saved!');
  });
}

function detail_task(task_id) {
  for (let k = 1; k < data.length + 1; k++){
    if (data[k - 1].id == task_id){
      console.log(data[k - 1]);
    }
  }
}
function completed(task_id) {
  for (let k = 1; k < data.length + 1; k++){
    if (data[k - 1].id == task_id){
      data[k - 1].completed = true;
    }
  }
  fs.writeFile('data.json', JSON.stringify(data) , (err) => {
  if (err) throw err;
  console.log('The file has been saved!');
  });
}

function uncompleted(task_id) {
  for (let k = 1; k < data.length + 1; k++){
    if (data[k - 1].id == task_id){
      data[k - 1].completed = false;
    }
  }
  fs.writeFile('data.json', JSON.stringify(data) , (err) => {
  if (err) throw err;
  console.log('The file has been saved!');
  });
}
