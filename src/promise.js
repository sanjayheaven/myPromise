const PENDING = "pending"
const FULFILLED = "fulfilled"
const REJECTED = "rejected"

// const doStateTransition = (state, transitionedState) => {
//   if (state == PENDING) {
//     return [FULFILLED, REJECTED].includes(transitionedState) || ""
//   } else if(state == FULFILLED) {
//     transitionedState
//   }
// }
function Promise(executor) {
  if (!(this instanceof Promise)) throw new TypeError()
  this.queue = []
  this.state = "pending"
  this.value = undefined
  this.reason = undefined
  function resolve(value) {
    if (this.state == PENDING) {
      this.state = FULFILLED
    }
  }
  function reject(reason) {
    this.state = REJECTED
  }
  try {
  } catch (error) {
    reject()
  }
}
Promise.resolve = function () {}
Promise.reject = function () {}
Promise.all = function () {}
Promise.race = function () {}
Promise.prototype.then = function (onFulfilled, onRejected) {
  if (!(this instanceof Promise)) throw new TypeError()
}
Promise.prototype.catch = function (onRejected) {
  if (!(this instanceof Promise)) throw new TypeError()
  return this.then(undefined, onRejected)
}

module.exports = Promise
