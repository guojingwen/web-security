export default (process.env.NODE_ENV === 'production') ? {
  captchaBase: '/api/getCaptcha',
  baseUrl: '/api'
  } : {
  captchaBase: 'http://localhost:10013/api/getCaptcha',
  baseUrl: 'http://localhost:10013/api'
}
