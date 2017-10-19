/**
 * 工具库
 */

const hasOwn = Object.prototype.hasOwnProperty

/**
 * 首字母大写
 * @param {String} str
 * @return {String}
 */
function firstUpperCase (str) {
  if (typeof str !== 'string') {
    return ''
  }

  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * 数据类型转换
 * @param {Any} type
 * @param {Any} val
 */
function convertDataType (type, val) {
  const ctor = global[firstUpperCase(type)]

  if (ctor) {
    return ctor(val)
  }
  return val
}

function hasOwnProp (obj, k) {
  return hasOwn.call(obj, k)
}

module.exports = {
  firstUpperCase,
  convertDataType,
  hasOwnProp
}
