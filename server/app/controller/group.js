const assert = require('http-assert')

module.exports = app => {
  class GroupController extends app.Controller {
    * update () {
      const { id } = this.ctx.params
      const group = this.ctx.request.body
      delete group._id
      if (!group.parentId) group.parentId = null
      const rs = yield this.service.group.update(id, group)
      if (rs && rs._id) {
        this.success(rs)
      } else {
        this.error('更新失败')
      }
    }
    * getAll () {
      const resources = yield this.service.group.getReadableGroups()
      // 过滤父分组已经被删除的分组
      const groupIds = resources.reduce((obj, g) => {
        obj[g._id] = g
        return obj
      }, {})
      this.service.group.clearUnusedGroup(groupIds)
      this.ctx.body = {
        resources: Object.keys(groupIds).map(g => groupIds[g])
      }
      this.ctx.status = 200
    }
    * get () {
      let { limit = 20, page = 1, q = '.*' } = this.ctx.query
      page = Number(page)
      limit = Number(limit)
      const reg = new RegExp(`.*${q}.*`, 'i')
      const cond = {
        isDeleted: false,
        name: reg
      }
      const resources = yield app.model.group
                                       .find(cond)
                                       .sort({ modifiedTime: -1, createTime: -1 })
                                       .skip((page - 1) * limit)
                                       .limit(limit)
                                       .exec()
      const count = yield app.model.group.find(cond).count().exec()
      this.ctx.body = { resources, pages: { limit, page, count } }
      this.ctx.status = 200
    }
    * getManageGroup () {
      this.ctx.body = yield this.service.group.getManageGroup()
    }
    * getUnmanaged () {
      this.ctx.body = yield this.service.group.getUnmanaged()
    }
    * claim () {
      // 认领分组，历史遗留问题，可忽略此接口
      const groupId = this.ctx.params.id
      this.ctx.body = yield this.service.group.claim(groupId)
    }
    * create () {
      const { body } = this.ctx.request
      assert(body.name, 403, 'required group name')
      const resources = yield this.service.group.create(body)
      this.ctx.body = { resources }
    }
    * delete () {
      const { id } = this.ctx.params
      const rs = yield this.service.group.delete(id)
      if (!rs) {
        this.error('无权删除')
      }
      // 不是很合理，应该是要先删除api再删除分组，但api这里没法做权限，所以暂时先后执行
      yield this.service.api.deleteGroupApis(id)
      this.ctx.status = 204
    }
    * tempUpdate () {
      const { email, groupid } = this.ctx.query
      const user = yield this.ctx.service.user.getByEmail(email)
      if (!user) {
        this.error('user不存在')
      }
      const newGroup = {
        creator: user._id,
        manager: user._id
      }
      const rs = yield app.model.group.findOneAndUpdate({
        _id: groupid
      }, Object.assign(newGroup, { modifiedTime: Date.now() }), { new: true })

      if (rs && rs._id) {
        this.success(rs)
      } else {
        this.error('更新失败')
      }
    }
    * tempApiUpdate () {
      const { from, to } = this.ctx.query
      const userFrom = yield this.ctx.service.user.getByEmail(from)
      const userTo = yield this.ctx.service.user.getByEmail(to)
      if (!userFrom || !userTo) {
        this.error('user不存在')
      }
      const newParams = {
        creator: userTo._id,
        manager: userTo._id
      }
      const rs = yield app.model.api.update({
        creator: userFrom._id
      }, Object.assign(newParams, { modifiedTime: Date.now() }), { multi: true })

      if (rs) {
        this.success(rs)
      } else {
        this.error('更新失败')
      }
    }
  }
  return GroupController
}
