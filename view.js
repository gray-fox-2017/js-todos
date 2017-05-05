class View{
  constructor(){

  }

  tampilHelp(){
    console.log('$ node todo.js help')
    console.log('$ node todo.js list')
    console.log('$ node todo.js add <task_content>')
    console.log('$ node todo.js task <task_id>')
    console.log('$ node todo.js delete <task_id>')
    console.log('$ node todo.js complete <task_id>')
    console.log('$ node todo.js uncomplete <task_id>')
    console.log('$ node todo.js tag <task_id> <content>')
    console.log('$ node todo.js filter <content>')
  }
  tampilDataComplete(i,list){
    console.log(`\n${i+1}. [X] ${list["task"]}`);
    console.log(`Complete : ${list["complete"]}`);
    console.log(`Created_at : ${list["created_date"]}`);
    console.log(`Completed_at : ${list["completed_date"]}`);
    console.log(`Tag : ${list["tag"]}`);

  }
  tampilDataUnComplete(i,list){
    console.log(`\n${i+1}. [ ] ${list["task"]}`);
    console.log(`Complete : ${list["complete"]}`);
    console.log(`Created_at : ${list["created_date"]}`);
    console.log(`Completed_at : ${list["completed_date"]}`);
    console.log(`Tag : ${list["tag"]}`);
  }
  tampilErrorOperasi()
  {
    console.log(`Operasi yang diinputkan salah!`);
  }
  tampilAdd(input){
    console.log(`Data ${input} berhasil ditambahkan`);
  }
  tampilDelete(input){
    console.log(`Data ${input} berhasil diHapus`);
  }

  tampilComplete(input){
    console.log(`Data ${input} complete`);
  }

  tampilUncomplete(input){
    console.log(`Data ${input} uncomplete`);
  }

  tampilTag(input){
    console.log(`Data ${input} berhasil ditambahkan`);
  }

  tampilFilterTag(i,task,tags){
    console.log(`${i}. Task: ${task} || Tag(s):${tags}`)
  }

  tampilError(){
    console.log('Error!')
  }
}

module.exports = View;
