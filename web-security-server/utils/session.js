/**
 * todo session持久化 redis
 */
const sessions = {}
exports.createSessionKey = function () {
  return new Date().getTime() + '' + parseInt(Math.random()* 9999)
}
exports.getSession = function(key) {
  return sessions[key]
}
exports.setSession = function(key, value) {
  sessions[key] = value
}
