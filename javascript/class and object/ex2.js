// Create a class called Admin which inherits from User.Add a new metthod called editDAta to Admin that allows it to edit website data
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
class admin extends user{
    constructor(name,email)
    {
        super(name,email);
    }
    editdat(){
        data="some new value"
    }
}

let s1=new user("NIKHIL","ABC@gmail.com")
let s2=new user("AMAN","XYZ@gmail.com")

let t1=new user("Dean","dean@college.com")
let admin=new admin("admin","admin@gmail.com");