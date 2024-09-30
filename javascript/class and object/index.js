//object
// const students = {
//     fullname: "NIKHIL RAJ MALI",
//     marks: 98.9,
//     printMarks: function () {
//         console.log("marks = ", this.marks)
//     }
// }

const employee={
    calcTax(){
        console.log("Tax rate is 10%");
    },
}
const karanArjun={
    salary:50000,
}
karanArjun.__proto__=employee;