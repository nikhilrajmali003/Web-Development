// // promise chain
// function asymcfun(){
//     return new Promise((resolve,reject)=>{
//         setTimeout(()=>{
//             console.log("Some data 1");
//         resolve("success")
//         },4000)
//     })
// }
// function asymcfun2(){
//     return new Promise((resolve,reject)=>{
//         setTimeout(()=>{
//             console.log("Some data2 ");
//         resolve("success")
//         },4000)
//     })
// }
// console.log("fetching data 1.....");
// asymcfun().then((res)=>{
//     console.log(res);
//     console.log("Fetching data 2....")
//     asymcfun2().then((res)=>{
//         console.log(res);
//     })
// })



// Asyn-Await
function api()
{
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            console.log("Weather data");
            resolve(200);
        },2000);
    });
}

async function getweatherdata(){
    await api();
}