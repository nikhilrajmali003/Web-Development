// Array Method
// Push():add to end
// pop:delete from end &return 
// toString():converts array to string
// concat():joins multiple arrys and return Result
// unshift():add to Start
// shift():delete from start and return
// silce():return a piece of the array
// splice:change original array (add, remove,replace)
// splice(startIdx,delCOUNT,newEL1)


// let fooditems=["potato","apple","banana"];
// fooditems.push("chips","burger","panner");
// console.log(fooditems);
// // let deleteditem=fooditems.pop();
// // console.log("Deleted item is ",deleteditem);
// console.log(fooditems.toString());


// let marvelheroes=['thor','spiderman'];
// let dcheroes=['superman','batman'];
// let indianheroes=['shaktiman','krish'];
// let heroes=marvelheroes.concat(dcheroes,indianheroes);
// console.log(heroes);

// marvelheroes.unshift("DON");
// let val=marvelheroes.shift("DON");
// console.log("Delete element =",val);




// let marvelheroes=['thor','spiderman','ironman','badman','superman'];
// console.log(marvelheroes);
// console.log(marvelheroes.slice(1,2));//can't change in oringnal array




let arr=[1,2,3,4,5,6,7];
// arr.splice(2,2,101,108);
// Add element
// let a=arr.splice(2,0,101);
// console.log(a);

// Delete the element
let a=arr.splice(3,1);
console.log(a);