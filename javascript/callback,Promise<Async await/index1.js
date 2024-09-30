// console.log("one")
// console.log("two")
// setTimeout(()=>{
//     console.log("Hello")
// },4000)//timeout
// console.log("three")
// console.log("Four")


// Callback functon

function sum(a,b)
{
    console.log(a+b)
}
function cal(a,b,sumcallback)
{
    sumcallback(a,b);
}
// cal(1,2,sum)
cal(1,2,(a,b)=>{
    console.log(a+b)
}
)