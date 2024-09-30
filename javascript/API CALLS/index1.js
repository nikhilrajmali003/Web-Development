const url ="https://cat-fact.herokuapp.com/facts";
const factpara =document.querySelector("#fact");
const btn=document.querySelector("#btn");

const getFact=async ()=>{
    console.log("Getting data...")
let response =await fetch(url);
console.log(response.status);//JSON format
let data =await response.json();
factpara.innerText=data[0].text;
}
btn.addEventListener("click",getFact);