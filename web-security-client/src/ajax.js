const baseUrl = 'http://localhost:8080/api'
export default function({path = throwError(), method = 'GET', headers = {}, data = {}} = throwError('参数')) {
  let url = baseUrl + path
  const options = {
    method,
    credentials: "include", // include, same-origin, omit
    headers: {
      "Content-Type": "application/json"
    },
    mode: 'cors'
  }
  if(method === 'GET') {
    let query = Object.entries(data).reduce((sum, item) => sum += `${item[0]}=${item[1]}&`, '')
    query = query.length ? '?' + query.substring(0, query.length - 1) : query
    url += query
  } else {
    options.body = JSON.stringify(data)
  }
  Object.assign(options.headers, headers)
  return fetch(url, options)
    .then(response => response.json())
    .then(data => {
      if(data.code !== 0) {
        console.log(data.message)
        return Promise.reject(data)
      }
      return Promise.resolve(data)
    }, (err) => {
      console.log("请检查网络链接" + err);
      return Promise.reject(data)
    })
}
const throwError = (name = '') => {
  throw new Error(`${name}必填！`)
}

