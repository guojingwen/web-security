export default (process.env.NODE_ENV === 'production') ? {
  captchaBase: '/api/getCaptcha',
  baseUrl: '/api'
  } : {
  captchaBase: 'http://localhost:8080/api/getCaptcha',
  baseUrl: 'http://localhost:8080/api'
}
