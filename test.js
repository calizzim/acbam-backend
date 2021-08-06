let get = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(true), 1000)
  })
}

let doit = async () => {
  let a = get()
  await a
  console.log(a.)
}

doit()