// let div = document.querySelector("div")
// console.log(div)

// let id = div.getAttribute("id")
// console.log(id)

// let name = div.getAttribute("name")
// console.log(name)


// let para=document.querySelector("p")
// // console.log(para.getAttribute("class"))
// console.log(para.setAttribute("class","newclass"))    // setattribute use for change the class name


// let div=document.querySelector("div")

// div.style.backgroundColor="white"
// div.style.fontSize="26px"
// div.innerText="Hello!"



let newbtn=document.createElement("button")
newbtn.innerText="click me"
console.log(newbtn)

let div=document.querySelector("div")
div.append(newbtn)