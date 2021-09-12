const Promise = require("./promise")
Promise.prototype.catch = function (onRejected) {
  return this.then(undefined, onRejected)
}
Promise.prototype.finnally = function (callback) {
  return this.then(
    (value) => {
      return Promise.resolve(callback()).then(() => value)
    },
    (reason) => {
      return Promise.reject(callback()).then(() => {
        throw reason
      })
    }
  )
}

Promise.resolve = function (value) {
  return new Promise((resolve) => {
    resolve(value)
  })
}
Promise.reject = function (reason) {
  return new Promise((resolve, reject) => {
    reject(reason)
  })
}
Promise.all = function (promises) {
  return new Promise((resolve, reject) => {
    let count = 0
    for (let i = 0; i <= promises.length; i++) {
      let promise = promises[i]
      Promise.resolve(promise).then(
        (value) => {
          count += 1
          if (count == promises.length) {
            resolve(value)
          }
        },
        (reason) => {
          reject(reason)
        }
      )
    }
  })
}
Promise.race = function (promises) {
  return new Promise((resolve, reject) => {
    for (let i = 0; i <= promises.length; i++) {
      let promise = promises[i]
      Promise.resolve(promise).then(
        (value) => {
          resolve(value)
        },
        (reason) => {
          reject(reason)
        }
      )
    }
  })
}
Promise.any = function (promises) {
  return new Promise((resolve, reject) => {
    let count = 0
    for (let i = 0; i <= promises.length; i++) {
      let promise = promises[i]
      Promise.resolve(promise).then(
        (value) => {
          resolve(value)
        },
        (reason) => {
          count += 1
          if (count == promises.length) {
            reject(reason)
          }
        }
      )
    }
  })
}
Promise.allSettled = function (promises) {
  return new Promise((resolve, reject) => {
    let count = 0
    for (let i = 0; i <= promises.length; i++) {
      let promise = promises[i]
      Promise.resolve(promise).then(
        (value) => {
          count += 1
          if (count == promises.length) {
            resolve(value)
          }
        },
        (reason) => {
          count += 1
          if (count == promises.length) {
            resolve(reason)
          }
        }
      )
    }
  })
}

module.exports = Promise
