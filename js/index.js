    //NOTE - 1) Fundamentalof js   2) arrays and objects  3) function return  4) async js  5) foreach,map,filter find,indexof

    var arr=[1,2,3,4];

    // NOTE :- FOREACH LOOP
    // arr.forEach(function(val){
    //     console.log(val+' hello');
    // })


    // NOTE :- MAP
    var newarr1=arr.map(function(val){
        return val*2;
    })

    console.log(newarr2)


    // NOTE -filter
    var newarr2=arr.filter(function(val){
        return val<3;
    })

    console.log(newarr2)

    // NOTE - find
    var newarr3=arr.find(function(val){
        return val>3;
    })

    console.log(newarr3);

    // NOTE - Indexof
    var newarr4=arr.indexOf(2);
    console.log(newarr4);

    // NOTE - objects
    var obj={
        name:'Rahul',
        age:25
    }
    console.log(obj.name);

    // NOTE - function 
    // ANCHOR :- how to find function length = no. of parameter is knows length
    function fun(a,b,c){
        console.log(a,b,c);
    }
    console.log(fun.length);

    // NOTE - ASYNC JS CODING :- line by line code chale isey kahte hai synchronus and jo bhi code aync nature ka ho,usey side stack mein bhej do and agle code ko chalao jo bhi sync nature a ho ,jab bhi saar syn code chal jaye,tak check karo kiasyn code complete hua yah nhi and agar wo complete hua ho to usey main stack mein laao and chala do

// var blob = await fetch(`http://randomuser.me/api`);
// var res = await blob.json();
// console.log(res);

async function abcd() {
    var blob=await fetch(`https://api.escuelajs.co/api/v1/products`)
     var ans =await blob.json();
     console.log(ans);    
}
abcd();


