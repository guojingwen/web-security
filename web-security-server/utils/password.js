function md5 (str) {
  const crypto  = require('crypto')
  const md5Hash = crypto.createHash('md5')
  md5Hash.update(str)
  return md5Hash.digest('hex')
}
function getSalt () {
  return md5(Math.random()*999999 + '' + new Date().getTime())
}
function encryptPassword (salt, password) {
  return md5(salt + '2fasdf@12%^#@' + password)
}
module.exports = {
  encryptPassword,
  getSalt
}
