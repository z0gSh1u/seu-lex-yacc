"use strict";
class TClass {
    constructor() {
        this._uuid = Symbol();
    }
}
let obj1 = new TClass();
let obj2 = new TClass();
let arr = [obj1, obj2];
console.log(arr.indexOf(obj1));
console.log(arr.indexOf(obj2));
