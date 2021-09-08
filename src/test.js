const Promise = require("./promise")
function fetchData(success) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (success) {
        resolve("willem")
      } else {
        reject("error")
      }
    }, 1000)
  })
}

fetchData(true).then((data) => {
  console.log(data) // after 1000ms: willem
})

fetchData(false).then(null, (reason) => {
  console.log(reason) // after 1000ms: error
})
