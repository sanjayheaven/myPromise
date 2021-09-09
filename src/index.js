const Promise = require("./promise")
// Promise.prototype.catch = function (onRejected) {
//   if (!(this instanceof Promise)) throw new TypeError()
//   return this.then(undefined, onRejected)
// }

// Promise.resolve = function () {}
// Promise.reject = function () {}
// Promise.all = function () {}
// Promise.race = function () {}
module.exports = Promise
