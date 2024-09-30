// class
class ToyotaCar{
    constructor(brand,milege)
    {
        console.log("Creating new object")
    this.milege=milege
        this.brand=brand
    }
start()
{
    console.log("Start");
}
stop()
{
    console.log("End");
}
// setBrand(brand)
// {
//     this.brand=brand
// }
}

let fortuner=new ToyotaCar("fortuner",10)//constructor
// fortuner.setBrand("fortuner")
let lexus=new ToyotaCar