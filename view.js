
class View {
  constructor() {

  }

  help(){
    console.log("- node todo.js help");
    console.log("- node todo.js list");
    console.log("- node todo.js add <task_content>");
    console.log("- node todo.js task <task_id>");
    console.log("- node todo.js delete <task_id>");
    console.log("- node todo.js complete <task_id>");
    console.log("- node todo.js uncomplete <task_id>");
    console.log("- node todo.js list:outstanding asc|desc");
    console.log("- node todo.js list:complete asc|desc");
    console.log("- node todo.js tag <id> <name_1> <name_2>");
    console.log("- node todo.js filter <tag_name>");
  }

  list(input){
    for(let i=0;i<input.length;i++){
      if(input[i].complete == true){
      console.log(`${i+1}. [X]${input[i].task}`);
      }else{
      console.log(`${i+1}. [ ]${input[i].task}`);
      }
    }
  }

  add(input){
    console.log(`Task added in your list`)
  }

  task(input){
    console.log(input);
  }

  delete(input){
    console.log(`Task has been delete`);
  }

  complete(input){
    console.log(`Task has been complete`)
  }

  uncomplete(input){
    console.log(`Task change to be uncomplete`)
  }
  asc_desc(input){
    console.log(input);
  }
  tag(task, content){
    console.log(`Tagged task "${task}" with tags: ${content}`)
  }
  filter(input){
    console.log(`Task: ${input.task} tags: ${input.tag}`)
  }
}

module.exports = View;
