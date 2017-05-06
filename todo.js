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
    } else if (mas[2] === 'tag') {
      this.control.addTag();
    } else if (mas[2] === 'filter' || mas[2] === 'filter:') {
      this.view.filter;
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
      console.log('\n1. node todo.js list\n=====> untuk melihat daftar rencana mu.\n\n2. node todo.js add <new task>:<tags>\n=====> untuk menambah daftar rencana mu.\n\n3. node todo.js complete <task number>\n=====> untuk merubah status rencana mu menjadi selesai.')
      console.log('\n4. node todo.js uncomplete <task number>\n=====> untuk merubah status rencamu menjadi belum selesai.\n\n5. node todo.js delete <task number>\n=====> untuk menghapus daftar rencanamu.')
      console.log('\n6. node todo.js list:outstanding\n=====> untuk melihat daftar rencanamu yang belum selesai (optional desc|asc).\n\n7. node todo.js list:completed\n=====> untuk melihat daftar rencanamu yang sudah selesai (optional desc|asc).')
      console.log('\n8. node todo.js tag <task number> <tags>\n=====> untuk merubah tags pada daftar acaramu.\n\n9. node todo.js filter: <tag>\n=====> untuk menampilkan daftar berdasarkan tag nya. (maksimal masih satu tag aja per search)')
      console.log('\n10. node todo.js help\n=====> untuk menampilkan daftar perintah dalam mengoperasikan applikasi ini.')
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
      var alert = 'Berikut daftar acaramu yang belum selesai, di urutkan dari yang ter BARU ke yang ter LAMA:'
      console.log(alert);
      console.log('_________________________________________________________________________________________\n')
      if (this.dataTask.length < 1) {
        console.log('<kosong>')
      }
      let urut = this.dataTask.filter(x => {if ( x.sudah == false ) {
        return x;
      }});
      urut.sort((a,b) => {return b.createdDate - a.createdDate})
      let listing = urut.map( x => {
        let stat = '[ ]'
        if (x.sudah == true) {stat = '[X]'}
        return `${stat} ${x.task}  <tags: ${x.tags.join(', ')}>`;
      });
      for (let i=0;i<urut.length;i++) {
        let nomor = i+1
        console.log(`${nomor}. ${listing[i]}`)
      }
      console.log('\n\n                             ~Gimana bisa kalem kalau rasanya dalem')
      urut.sort((a,b) => {return a.createdDate - b.createdDate })

    } else {
      var alert = 'Berikut daftar acaramu yang belum selesai, di urutkan dari yang ter LAMA ke yang ter BARU:'
      console.log(alert);
      console.log('__________________________________________________________________________________________\n')
      if (this.dataTask.length < 1) {
        console.log('<kosong>')
      }
      let urut = this.dataTask.filter(x => {if ( x.sudah == false ) {
        return x;
      }});
      let listing = urut.map( x => {
        let stat = '[ ]'
        if (x.sudah == true) {stat = '[X]'}
        return `${stat} ${x.task}  <tags: ${x.tags.join(', ')}>`;
      });
      for (let i=0;i<urut.length;i++) {
        let nomor = i+1
        console.log(`${nomor}. ${listing[i]}`)
      }
      console.log('\n\n                             ~Gimana bisa kalem kalau rasanya dalem')
    }
  }

  get completed() {
    if (this.inputView[3] === 'desc') {
      console.log('\x1B[2J');
      var komplited = this.dataTask.filter(x => x.sudah);
      if (komplited.length < 1) {
        console.log('belom ada yang kelar coyy tugasnyaaa')
      } else {
        komplited.sort((a,b) => {return b.dateCompleted - a.dateCompleted});
        var alert = 'Berikut daftar acaramu yang sudah selesai,\ndiurutkan berdasarkan waktu diselesaikannya dari terBARU ke terLAMA:'
        console.log(alert);
        console.log('____________________________________________________________________\n')
        var list = komplited.map( x => {
          let waktuSelesai = new Date(x.dateCompleted);
          return `${x.task}, selesai pada tanggal: ${waktuSelesai}`;
        })
        for (let i=0;i<list.length;i++) {
          console.log(`${i+1}. ${list[i]}`)
        }
        komplited.sort((a,b) => {return a.dateCompleted - b.dateCompleted});
      }

    } else {
      console.log('\x1B[2J');
      var komplited = this.dataTask.filter(x => x.sudah)
      var alert = 'Berikut daftar acaramu yang sudah selesai,\ndiurutkan berdasarkan waktu diselesaikannya dari terLAMA ke terBARU:'
      console.log(alert);
      console.log('____________________________________________________________________\n')
      if (komplited.length < 1) {
        console.log('belom ada yang kelar coyy tugasnyaaa')
      }
      var list = komplited.map( x => {
        let waktuSelesai = new Date(x.dateCompleted);
        return `${x.task}, selesai pada tanggal: ${waktuSelesai}`;
      })
      for (let i=0;i<list.length;i++) {
        console.log(`${i+1}. ${list[i]}`)
      }
    }
  }

  get filter() {
    console.log('\x1B[2J');
    var tagFilter = this.inputView[3];
    if (tagFilter == undefined) {
      console.log('hm? salah ketik ya? cek `node todo.js help` untuk bantuan')
    } else {
      var taskFiltered = this.dataTask.filter(x => x.tags.indexOf(tagFilter) !== -1);
      console.log(`Menampilkan daftar acara berdasarkan tag: ${tagFilter}\n`);
      for (let i=0;i<taskFiltered.length;i++) {
        var udah = '[X]'
        if (taskFiltered[i].sudah === false) {
          var udah = '[ ]'
        }
        console.log(`${i+1}. ${udah} ${taskFiltered[i].task}        tags: <${taskFiltered[i].tags.join(', ')}>`)
      }
    }
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
      var tanggalKelar = (new Date()).getTime();
      this.dataTask[(this.inputControl[3])-1].dateCompleted = tanggalKelar;
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
      console.log('Hmmm , sepertinya command mu salah, coba ketik seperti ini:\n\nnode todo.js uncomplete < nomor task yang kamu ingin ubah statusnya >\n\nPaham??, ayo coba lagi!!')

    } else if (this.inputControl[3] <= this.dataTask.length && this.inputControl[3] > 0) {
      console.log('\x1B[2J')
      this.dataTask[(this.inputControl[3])-1].sudah = false;
      this.dataTask[(this.inputControl[3])-1].dateCompleted = null;
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

  addTag() {
    if(this.inputControl.length<=3){
      console.log('\x1B[2J')
      console.log('Hmmm? , sepertinya command mu salah, coba ketik seperti ini:\n\nnode todo.js tag <nomor task yang ingin kamu rubah tag nya> <tag yang ingin kamu tambahkan/hilangkan>\n\nPaham??, ayo coba lagi!!')

    } else {
      var tagTambahan = this.inputControl.slice(3, this.inputControl.length);
      console.log('\x1B[2J');
      var nomorTask = tagTambahan[0];
      var tagBaru = tagTambahan.slice(1, tagTambahan.length);
      var tambahTag = [];
      //proses penghapusan tags
      var indexTagYangdiHapus = [];
      for (let i=0; i<tagBaru.length;i++) {
        let indexHapus = this.dataTask[nomorTask-1].tags.indexOf(tagBaru[i]);
        if (indexHapus !== -1) {
          indexTagYangdiHapus.push(indexHapus);
        } else {
          tambahTag.push(tagBaru[i]);
        };
      }
      if (indexTagYangdiHapus.length > 0) {
        var tagYangdiHapus = indexTagYangdiHapus.map(x=>this.dataTask[nomorTask-1].tags[x]);
        console.log(`${tagYangdiHapus.join(', ')} berhasil dihapus dari tag task nomor ${nomorTask}\n`);
        for (let i=0; i<indexTagYangdiHapus.length; i++){
          this.dataTask[nomorTask-1].tags.splice(indexTagYangdiHapus[i],1);
        }
        var dataString = JSON.stringify(this.dataTask);
        fs.writeFileSync('data.json', dataString, 'utf-8');
      }
      //proses penambahan tags
      for (let i=0; i<tambahTag.length;i++) {
        if (this.dataTask[nomorTask-1].tags.indexOf(tambahTag[i]) == -1) {
          this.dataTask[nomorTask-1].tags.push(tambahTag[i])
        }
      }
      if (tambahTag.length > 0) {
        console.log(`${tambahTag.join(', ')} berhasil ditambahkan ke tag task nomor ${nomorTask}`);
      }
      var dataString = JSON.stringify(this.dataTask);
      fs.writeFileSync('data.json', dataString, 'utf-8');
    }
  }

}


var  masukan = process.argv
var todolist = new ToDoList(masukan);

todolist.model.initiatior();

