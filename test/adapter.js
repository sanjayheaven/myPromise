/**
 * for promises-aplus tests
 */

const Promise = require("../src/promise")
console.log(Promise, 111)
module.exports = {
  deferred: function () {
    let deferred = {}
    deferred.promise = new Promise((resolve, reject) => {
      deferred.resolve = resolve
      deferred.reject = reject
    })
    return deferred
  },
}
