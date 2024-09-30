let divs=document.querySelectorAll(".box")
// console.log(divs[0])
// divs[0].innerText="new unique value 1"
// divs[1].innerText="new unique value 2"
// divs[2].innerText="new unique value 3"


let index=1
for( div of divs)
{
    div.innerText = `new unique value ${index}`;
    index++
}
