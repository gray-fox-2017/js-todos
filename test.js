
// var obj = [
//   {date: "2011-11-14T17:25:45Z", quantity: 2, total: 200, tip: 0,   type: "cash"},
//   {date: "2011-11-14T16:28:54Z", quantity: 1, total: 300, tip: 200, type: "visa"},
//   {date: "2011-11-14T16:30:43Z", quantity: 2, total: 90,  tip: 0,   type: "tab"},
//   {date: "2011-11-14T17:22:59Z", quantity: 2, total: 90,  tip: 0,   type: "tab"},
//   {date: "2011-11-14T16:53:41Z", quantity: 2, total: 90,  tip: 0,   type: "tab"},
//   {date: "2011-11-14T16:48:46Z", quantity: 2, total: 90,  tip: 0,   type: "tab"},
//   {date: "2011-11-31T17:29:52Z", quantity: 1, total: 200, tip: 100, type: "visa"},
//   {date: "2011-11-01T16:17:54Z", quantity: 2, total: 190, tip: 100, type: "tab"},
//   {date: "2011-11-14T16:58:03Z", quantity: 2, total: 90,  tip: 0,   type: "tab"},
//   {date: "2011-11-14T16:20:19Z", quantity: 2, total: 190, tip: 100, type: "tab"},
//   {date: "2011-11-14T17:07:21Z", quantity: 2, total: 90,  tip: 0,   type: "tab"},
//   {date: "2011-11-14T16:54:06Z", quantity: 1, total: 100, tip: 0,   type: "cash"}
// ];
//
// obj.sort(function(a,b){
//   return new Date(a.dateCompleted) - new Date(b.dateCompleted);
// });
//
// console.log(data);
// // console.log(data[0].date < data[1].date);

var obj = [{"id":0,"task":"makan kampret","complete":true,"dateCompleted":"2017-05-05T14:10:56.920Z"},{"id":1,"task":"makan sapi gulai","complete":true,"dateCompleted":"2017-05-05T14:11:19.536Z"},{"id":2,"task":"makan ajaah","complete":true,"dateCompleted":"2017-05-05T14:11:47.896Z"},{"id":3,"task":"ke gunung","complete":true,"dateCompleted":"2017-05-05T14:11:45.761Z"}]

function ascOutStanding (paramObj) {
  paramObj.sort(function(a,b){
    return new Date(b.dateCompleted) - new Date(a.dateCompleted);
  });
  return paramObj
}

function ascComplete (paramObj) {
  paramObj.sort(function(a,b){
    return b.id - a.id;
  });
  return paramObj;
}

// console.log(ascOutStanding(obj));
console.log(ascComplete(obj));


// class Task {
//   constructor(id=0, taskDetail="no task yet", completeValue=false, dateCompleted="") {
//     this.id = id;
//     this.task = taskDetail;
//     this.complete = completeValue;
//     this.dateCompleted = dateCompleted;
//   }
// }

// let task = new Task()
// console.log(task);
// console.log(task);
// console.log(task);
