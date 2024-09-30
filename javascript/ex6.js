// Create array to store companines->"bloombe","microsoft","google",'amazone"
// a>Remove the first company from the Array
// b>Remove uber and add ola in its place 
// c>add amazon at the end 


let companies=["bloomeberg","microsoft","uber","google","IBM","netflix"];
// let a=companies.shift();//answer (a)
let b=companies.splice(2,1,"ola");
// let c=companies.push("Amazon");
// console.log(a);
console.log(b);
console.log(companies);
// console.log(c);