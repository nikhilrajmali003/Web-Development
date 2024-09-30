// // FILTER METHOD 
// let arr=[1,2,3,4,5,6]
// let evenarr=arr.filter((val)=>{
//     return val%2===0
// })
// console.log(evenarr)


// reduce method
let arr = [34, 65, 8, 2, 6]
const output = arr.reduce((result, current) => {
    return result + current
})
console.log(output)