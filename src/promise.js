const PENDING = "pending"
const FULFILLED = "fulfilled"
const REJECTED = "rejected"

function Promise(executor) {
  let self = this
  self.state = PENDING

  self.onFulfilledCallbacks = []
  self.onRejectedCallbacks = []
  function resolve(value) {
    if (self.state === PENDING) {
      self.state = FULFILLED
      self.value = value
      // 2.2.6.1 If/when promise is fulfilled, all respective onFulfilled callbacks must execute in the order of their originating calls to then.
      self.onFulfilledCallbacks.forEach((fn) => fn())
    }
  }
  function reject(reason) {
    if (self.state === PENDING) {
      self.state = REJECTED
      self.reason = reason
      // 2.2.6.1 If/when promise is rejected, all respective onRejected callbacks must execute in the order of their originating calls to then.
      self.onRejectedCallbacks.forEach((fn) => fn())
    }
  }
  try {
    executor(resolve, reject)
  } catch (error) {
    reject(error)
  }
}

// 2.2.6 then may be called multiple times on the same promise.
Promise.prototype.then = function (onFulfilled, onRejected) {
  // 2.2.1.1 If onFulfilled is not a function, it must be ignored.
  if (typeof onFulfilled !== "function") {
    onFulfilled = function (value) {
      return value
    }
  }
  // 2.2.1.2 If onRejected is not a function, it must be ignored.
  if (typeof onRejected !== "function") {
    onRejected = function (reason) {
      throw reason
    }
  }

  /**
   * what do above is to make sure the onFulfilled & onRejected are function
   */

  // 2.2.4 onFulfilled or onRejected must not be called until the execution context stack contains only platform code. [3.1].
  /**
   * that is why use queueMicrotask
   */

  // 2.2.7 then must return a promise

  let self = this
  let promise2 = new Promise(function (resolve, reject) {
    if (self.state === FULFILLED) {
      // 2.2.2.1 it must be called after promise is fulfilled, with promise’s value as its first argument.
      // 2.2.2.2 it must not be called before promise is fulfilled.
      // 2.2.2.3 it must not be called more than once.
      queueMicrotask(() => {
        try {
          // 2.2.7.3 If onFulfilled is not a function and promise1 is fulfilled, promise2 must be fulfilled with the same value as promise1.
          let x = onFulfilled(self.value)
          // 2.2.7.1 If either onFulfilled or onRejected returns a value x, run the Promise Resolution Procedure [[Resolve]](promise2, x).
          resolvePromise(promise2, x, resolve, reject)
        } catch (error) {
          // 2.2.7.2 If either onFulfilled or onRejected throws an exception e, promise2 must be rejected with e as the reason.
          reject(error)
        }
      })
    } else if (self.state === REJECTED) {
      // 2.2.3.1 it must be called after promise is rejected, with promise’s reason as its first argument.
      // 2.2.3.2 it must not be called before promise is rejected.
      // 2.2.3.3 it must not be called more than once.
      queueMicrotask(() => {
        try {
          // 2.2.7.4 If onRejected is not a function and promise1 is rejected, promise2 must be rejected with the same reason as promise1.
          let x = onRejected(self.reason)
          // 2.2.7.1 If either onFulfilled or onRejected returns a value x, run the Promise Resolution Procedure [[Resolve]](promise2, x).
          resolvePromise(promise2, x, resolve, reject)
        } catch (error) {
          // 2.2.7.2 If either onFulfilled or onRejected throws an exception e, promise2 must be rejected with e as the reason.
          reject(error)
        }
      })
    } else if (self.state === PENDING) {
      self.onFulfilledCallbacks.push(() => {
        queueMicrotask(() => {
          try {
            let x = onFulfilled(self.value)
            resolvePromise(promise2, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        })
      })
      self.onRejectedCallbacks.push(() => {
        queueMicrotask(() => {
          try {
            let x = onRejected(self.reason)
            resolvePromise(promise2, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        })
      })
    }
  })
  return promise2
}

function resolvePromise(promise, x, resolve, reject) {
  // 2.3.1 If promise and x refer to the same object, reject promise with a TypeError as the reason.
  if (promise === x) {
    let err = new TypeError("promise and x refer to the same object")
    return reject(err)
  }
  if ((typeof x === "object" || typeof x === "function") && x !== null) {
    // 2.3.3 Otherwise, if x is an object or function,

    // 2.3.3.3.3 If both resolvePromise and rejectPromise are called, or multiple calls to the same argument are made, the first call takes precedence, and any further calls are ignored.
    // 2.3.3.3.4 If calling then throws an exception e,
    let called = false

    // 2,3.3.2 If retrieving the property x.then results in a thrown exception e, reject promise with e as the reason.
    try {
      let then = x.then
      /**
       * well, such codes to make sure x is thanable
       */

      if (typeof then === "function") {
        then.call(
          x,
          // 2.3.3.3.1 If/when resolvePromise is called with a value y, run [[Resolve]](promise, y).
          (y) => {
            if (called) return
            called = true
            resolvePromise(promise, y, resolve, reject)
          },
          // 2.3.3.3.2 If/when rejectPromise is called with a reason r, reject promise with r.
          (r) => {
            if (called) return
            called = true
            reject(r)
          }
        )
      } else {
        if (called) return
        called = true
        resolve(x)
      }
    } catch (error) {
      // 2.3.3.3.4.1 If resolvePromise or rejectPromise have been called, ignore it.
      // 2.3.3.3.4.2 Otherwise, reject promise with e as the reason.
      if (called) return
      called = true
      reject(error)
    }
  } else {
    resolve(x)
  }
}

// Promise.prototype.catch = function (onRejected) {
//   if (!(this instanceof Promise)) throw new TypeError()
//   return this.then(undefined, onRejected)
// }

// Promise.resolve = function () {}
// Promise.reject = function () {}
// Promise.all = function () {}
// Promise.race = function () {}

module.exports = Promise
