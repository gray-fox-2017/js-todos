
class View {
  constructor() {
  }
  help(){
    console.log("Masukkan (list) untuk melihat seluruh task");
    console.log("Masukkan (add task_content) untuk menambah task");
    console.log("Masukkan (task task_id) untuk melihat detail task");
    console.log("Masukkan (delete task_id) untuk menghapus task");
    console.log("Masukkan (completed task_id) untuk menandai task completed");
    console.log("Masukkan (uncompleted task_id) untuk menhapus tanda task completed");
    console.log("Masukkan (tag task_id input_tag_1 input_tag_2 input_tag_...) untuk menambahkan tag pada task");
  }
  file_saved(){
    console.log('The file has been saved!');
  }

  list_header(){
    console.log("id|task|completed?|created at|tag");
}
  list_content(id,task,check,created_at,tag){
    console.log(`${id}|${task}|${check}|${created_at}|${tag}`);
  }

  list_outstanding(syntax){
    console.log(`${syntax}`);
  }
}
module.exports = View;
