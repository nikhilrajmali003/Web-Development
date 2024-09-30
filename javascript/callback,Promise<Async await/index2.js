
// function getdata(dataid, getnextdata) {
//     setTimeout(() => {
//         console.log("data", dataid);
//         if (getnextdata) {
//             getnextdata();
//         }

//     }, 2000);
// }
// // callback hell
// getdata(1, () => {
//     getdata(2, () => {
//         getdata(3)
//     });
// });






// promise
// let promise= new promise((resolve,reject)=>{
//     console.log("I am promise");
//     // resolve(123)
//     reject("error occured")
// })

// function getdata(dataid,getnextdata)
// {
//     return new Promise((resolve,reject)=>{
//         setTimeout(()=>
//     {
//         console.log("data",dataid);
//         resolve("success")
//         if(getnextdata)
//         {
//             getnextdata();
//         }
//     },2000);
//     })
// }

const getPromise = () => {
  return  new Promise((resolve, reject) => {
        console.log("I am a promise");
         resolve("success");
        // reject("Error")
    }
    )
}

let promise=getPromise();
promise.then((res)=>{
    console.log("promise fulfiled :)",res)
}
)
promise.catch((err)=>{
    console.log("rejected",err)
})