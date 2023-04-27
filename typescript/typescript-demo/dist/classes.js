class User {
    constructor(name, email, age) {
        this.name = name;
        this.email = email;
        this.age = age;
    }
    register() {
        console.log(`${this.name} is now registered`);
    }
    payInvoice() {
        console.log(`${this.name} has paid their invoice`);
    }
}
let patrick = new User('Patrick Hill', 'phill@stevens.edu', 44);
console.log(patrick);
patrick.register();
patrick.payInvoice();
class Member extends User {
    constructor(id, name, email, age) {
        super(name, email, age);
        this.id = id;
    }
    payInvoice() {
        super.payInvoice();
    }
}
let aiden = new Member(1, 'Aiden Hill', 'ahill@stevens.edu', 1);
console.log(aiden);
aiden.payInvoice();
