class Param {
  constructor (initParam = {}) {
    const { key = null, type = 'string', required = true, fixed = false, comment = null } = initParam
    this.key = key
    this.type = type
    this.required = required
    this.fixed = fixed
    this.comment = comment
  }
}

export default Param
