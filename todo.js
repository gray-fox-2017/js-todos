const fs = require('fs');

class ToDoList{

  constructor(input) {
    this.model = new Model(input);
  }
}

class Model{
  constructor(x) {
    this.inputModel = x;
    this.view = new View(x);
    this.control = new Control(x);
  }

  initiatior() {
    let mas = this.inputModel;

    if (mas[2] === 'help' || mas.length <= 2) {
      this.view.help;
    } else if (mas[2] === 'list') {
      this.view.list;
    } else if (mas[2] === 'list:outstanding') {
      this.view.outstanding;
    } else if (mas[2] === 'list:completed') {
      this.view.completed;
    } else if (mas[2] === 'add') {
      this.control.addList();
    } else if (mas[2] === 'complete') {
      this.control.complete();
    } else if (mas[2] === 'uncomplete') {
      this.control.uncomplete();
    } else if (mas[2] === 'delete') {
      this.control.delete();
    }
  }

}

class View{
  constructor(x) {
    this.inputView = x;
    this.dataTask = JSON.parse(fs.readFileSync('data.json', 'utf8'));
  }

  get help() {
      console.log('\x1B[2J')
      console.log(`\n\n--------------Selamat datang di applikasi TODOS---------------\n\nUntuk memulai silahkan ucapkan 'Hai Todo!!', dengan nada ceria\n\n--------------------------------------------------------------`)
      console.log('\nBerikut daftar command untuk menjalan aplikasi ini:')
      console.log('\n1. node todo.js list\n=====> untuk melihat daftar rencana mu.\n\n2. node todo.js add <new task>:<tags>\n=====> untuk menambah daftar rencana mu\n\n3. node todo.js complete <task number>\n=====> untuk merubah status rencana mu menjadi selesai.')
      console.log('\n4. node todo.js uncomplete <task number>\n=====> untuk merubah status rencamu menjadi belum selesai.\n\n5. node todo.js delete <task number>\n=====> untuk menghapus daftar rencanamu.')
  }

  get list() {
    console.log('\x1B[2J')
    var pemba = 'Berikut daftar aktifitas yang kamu ingin lakukan:\n-------------------------------------------------\n'
    console.log(pemba)
    if (this.dataTask.length < 1) {
      console.log('<kosong>')
    }
    let listing = this.dataTask.map( x => {
      let stat = '[ ]'
      if (x.sudah == true) {stat = '[X]'}
      return `${stat} ${x.task}     <tags: ${x.tags.join(', ')}>`;
    });
    for (let i=1;i<=listing.length;i++) {
      console.log(i+'. '+listing[i-1]);
    }
    console.log('\n\n                        ~Tidak ada yang tidak mungkin, mungkin tidak ingin')
  }

  get outstanding() {
    console.log('\x1B[2J')
    if (this.inputView[3] === 'desc') {
      var alert = 'Berikut daftar acaramu, di urutkan dari yang ter BARU ke yang ter LAMA:'
      console.log(alert);
      console.log('_______________________________________________________________________\n')
      if (this.dataTask.length < 1) {
        console.log('<kosong>')
      }
      let urut = this.dataTask;
      urut.sort((a,b) => {return b.createdDate - a.createdDate})
      let listing = urut.map( x => {
        let stat = '[ ]'
        if (x.sudah == true) {stat = '[X]'}
        return `${stat} ${x.task}     <tags: ${x.tags.join(', ')}>`;
      });
      for (let i=0;i<urut.length;i++) {
        let nomor = i+1
        console.log(`${nomor}. ${listing[i]}`)
      }
      console.log('\n\n                             ~Gimana bisa kalem kalau rasanya dalem')
      urut.sort((a,b) => {return a.createdDate - b.createdDate })

    } else {
      var alert = 'Berikut daftar acaramu, di urutkan dari yang ter LAMA ke yang ter BARU:'
      console.log(alert);
      console.log('_______________________________________________________________________\n')
      if (this.dataTask.length < 1) {
        console.log('<kosong>')
      }
      let urut = this.dataTask;
      for (let i=0;i<urut.length;i++) {
        let nomor = i+1
        console.log(`${nomor}. ${urut[i].task}, tags: ${urut[i].tags.join(' ')}`)
      }
      console.log('\n\n                             ~Gimana bisa kalem kalau rasanya dalem')
    }
  }

  get completed() {
    console.log('\x1B[2J');
    var komplited = this.dataTask.filter(x => x.sudah)
    var alert = 'Berikut daftar acaramu yang sudah selesai:'
    console.log(alert);
    if (komplited.length < 1) {
      console.log('belom ada yang kelar coyy tugasnyaaa')
    }
    console.log(komplited)

  }
}

class Control{
  constructor(x) {
    this.inputControl = x;
    this.dataTask = JSON.parse(fs.readFileSync('data.json', 'utf8'));
  }

  addList() {
    if(this.inputControl.length<=3){
      console.log('\x1B[2J')
      console.log('Hmmm , sepertinya command mu salah, coba ketik seperti ini:\n\nnode todo.js add < task baru yang kamu inginkan >\n\nPaham??, ayo coba lagi!!')
    } else if (this.inputControl[3] !== undefined || this.inputControl[3] !== null) {
      console.log('\x1B[2J')
      var kalimatMasuk = this.inputControl.slice(3, this.inputControl.length).join(' ').split(':');
      var kalimat = kalimatMasuk[0];
      if (kalimatMasuk[1] !== undefined) {
        var tags = kalimatMasuk[1].split(' ');
      } else {
        var tags = [null]
      }
      var waktu = (new Date()).getTime();
      let listBaru = {
        'task': kalimat,
        'sudah': false,
        'createdDate': waktu,
        'tags': tags
      }
      this.dataTask.push(listBaru);
      var dataString = JSON.stringify(this.dataTask)
      fs.writeFileSync('data.json', dataString, 'utf-8');
      console.log(kalimat.toUpperCase() + ', berhasil ditambahkan di TODOS mu.')
    } else {
      console.log('\x1B[2J')
      console.log('Hmmm , sepertinya command mu salah, coba ketik seperti ini:\n\nnode todo.js add < task baru yang kamu inginkan >\n\nPaham??, ayo coba lagi!!')
    }
  }

  complete() {
    if (this.inputControl.length <= 3) {
      console.log('\x1B[2J')
      console.log('Hmmm , sepertinya command mu salah, coba ketik seperti ini:\n\nnode todo.js complete < nomor task yang kamu ingin ubah statusnya >\n\nPaham??, ayo coba lagi!!')

    } else if (this.inputControl[3] <= this.dataTask.length && this.inputControl[3] > 0) {
      console.log('\x1B[2J')
      this.dataTask[(this.inputControl[3])-1].sudah = true;
      var dataString = JSON.stringify(this.dataTask);
      fs.writeFileSync('data.json', dataString, 'utf-8');
      console.log(this.dataTask[this.inputControl[3]-1].task.toUpperCase() + ', sudah berubah status menjadi complete!!\n\n========== Ayo segera selesaikan daftar rencanamu!! ==========\n\n\           jangan perkeruh situasi kecuali situasu')
    } else {
      console.log('\x1B[2J')
      console.log('Hmmm , sepertinya command mu salah, coba ketik seperti ini:\n\nnode todo.js complete < nomor task yang kamu ingin ubah statusnya >\n\nPaham??, ayo coba lagi!!')
    }
  }

  uncomplete() {
    if (this.inputControl.length <= 3) {
      console.log('\x1B[2J')
      console.log('Hmmm , sepertinya command mu salah, coba ketik seperti ini:\n\nnode todo.js complete < nomor task yang kamu ingin ubah statusnya >\n\nPaham??, ayo coba lagi!!')

    } else if (this.inputControl[3] <= this.dataTask.length && this.inputControl[3] > 0) {
      console.log('\x1B[2J')
      this.dataTask[(this.inputControl[3])-1].sudah = false;
      var dataString = JSON.stringify(this.dataTask);
      fs.writeFileSync('data.json', dataString, 'utf-8');
      console.log(this.dataTask[this.inputControl[3]-1].task.toUpperCase() + ', sudah berubah status menjadi uncomplete!!\n\n========== Ayo segera selesaikan daftar rencanamu!! ==========\n\ngimana bisa kalem kalau rasanya dalem ~~')
    } else {
      console.log('\x1B[2J')
      console.log('Hmmm , sepertinya command mu salah, coba ketik seperti ini:\n\nnode todo.js complete < nomor task yang kamu ingin ubah statusnya >\n\nPaham??, ayo coba lagi!!')
    }
  }

  delete() {
    if (this.inputControl.length <= 3) {
      console.log('\x1B[2J')
      console.log('Hmmm , sepertinya command mu salah, coba ketik seperti ini:\n\nnode todo.js complete < nomor task yang kamu ingin hapus >\n\nPaham??, ayo coba lagi!!')

    } else if (this.inputControl[3] <= this.dataTask.length && this.inputControl[3] > 0) {
      console.log('\x1B[2J')
      let indeksss = (this.inputControl[3])-1
      let kenangan = this.dataTask[indeksss].task
      this.dataTask.splice(indeksss, 1);
      var dataString = JSON.stringify(this.dataTask)
      fs.writeFileSync('data.json', dataString, 'utf-8');
      console.log(kenangan.toUpperCase() + ', sudah menjadi kenangan!!\n\n========== Ayo segera selesaikan daftar rencanamu!! ==========\n\n\n                        ~ Dulu kau terbaik, sekarang terbalik\n')
    } else {
      console.log('\x1B[2J')
      console.log('Hmmm , sepertinya command mu salah, coba ketik seperti ini:\n\nnode todo.js complete < nomor task yang kamu ingin hapus >\n\nPaham??, ayo coba lagi!!')
    }
  }
}


var  masukan = process.argv
var todolist = new ToDoList(masukan);

todolist.model.initiatior();

