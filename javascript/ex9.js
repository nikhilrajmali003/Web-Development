// For a given array of number,print the square of each value using forEach loop
let num = [2, 4, 6, 8, 10]
// num.forEach((num) => {
//     console.log(num * num)
// })

let calcsquare = (num) => {
    console.log(num * num)
}
num.forEach(calcsquare)