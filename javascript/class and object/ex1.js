// Q> You are creating a website for your college.Create a class user with 2 properties,name and email.It alsi has a mthod called viewData() that allowa user to view website data
let data="secret information"
class user{

    constructor(name,email)
    {
        this.name=name;
        this.email=email;

    }
    viewdata()
    {
        console.log("data = "=data);
    }
}

let s1=new user("NIKHIL","abc@gmail.com")
let s2=new user("aman","aman@gamil.com");