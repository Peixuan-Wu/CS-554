class Employee {
    constructor(name) {
        this._fullName = name;
    }
    get fullName() {
        console.log('in Getter');
        return this._fullName;
    }
    set fullName(newName) {
        console.log('in Setter');
        if (newName) {
            this._fullName = newName;
        }
        else {
            throw 'Name not supplied';
        }
    }
}
let empInstance = new Employee();
empInstance.fullName = 'Patrick Hill';
if (empInstance.fullName) {
    console.log(empInstance.fullName);
}
let empInstance2 = new Employee('John Smith');
console.log(empInstance2.fullName);
empInstance2.fullName = 'Mike Jones';
console.log(empInstance2.fullName);
