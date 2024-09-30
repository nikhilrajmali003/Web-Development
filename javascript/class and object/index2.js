// Inherutence

// class Parent{
//     hello()
//     {
//         console.log("hello")
//     }
// }
// class child extends parent{

// }
// let obj= new child()


class person {
    constructor(name) {
        console.log("Enter a parent construtor")
        this.species = "Homo sapines"
        this.name=name
    }
    eat() {
        console.log("hello")
    }
    // sleep()
    // {
    //     console.log("sleep")
    // }
    // work()//overriding
    // {
    //     console.log("Do nothing")
    // }
}

class engineer extends person {
    constructor(name) {
        console.log("Enter child constructor ")
        super(name)//to invoke parent class constructor
        this.branch = branch
        console.log("Exit child constructor")
    }
    work() {
        super.eat()
        console.log("Solve problem,build something")
    }
}

// class doctor extends person{
//     work()
//     {
//         console.log("help pa")
//     }
//     }

// let obj=new engineer()

let engobj = new engineer("NIKHIL")