const caches = {}

exports.getCacheByKey = function (key) {
  return caches[key]
}
exports.setCacheByKey = function (key, value) {
  return caches[key] = value
}
exports.delCacheByKey = function (key){
  delete caches[key]
}
