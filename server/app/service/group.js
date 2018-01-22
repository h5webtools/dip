const { authority } = require('../../constants')
const {
    PRIVACY_ALL,
    PRIVACY_MEMBER,
    PRIVACY_SELF,
    OPERATION_ALL,
    OPERATION_MEMBER
} = authority

module.exports = app => {
  class Group extends app.Service {
    isWritable (group, authId) {
      switch (group.operation) {
        case OPERATION_ALL:
          return { status: true }
        case OPERATION_MEMBER:
          return {
            status: !!group.member.find(m => m.toString() === authId),
            msg: '仅组内成员可操作'
          }
        default:
          return { status: true }
      }
    }
    * getAllRelatedGroup (groupId) {
      const groups = yield this.getReadableGroups()
      const groupsArr = []
      const current = groups.find(group => group._id.toString() === groupId)

      if (current) {
        groupsArr.push(current._id)
        // TODO：待优化，这里数据量大之后会有性能问题
        this.getChildRelatedGroup(groupId, groups, groupsArr)
      }
      return groupsArr
    }
    getChildRelatedGroup (groupId, groups, groupsArr) {
      const groupIds = this.getChildGroup(groupId, groups)
      if (groupIds.length > 0) {
        groupsArr.push.apply(groupsArr, groupIds)
        this.getChildRelatedGroup(groupIds, groups, groupsArr)
      }
    }
    getChildGroup (groupIds, groups = []) {
      let groupIdsArr = null
      const groupArr = []

      if (!Array.isArray(groupIds)) {
        groupIdsArr = [groupIds]
      } else {
        groupIdsArr = groupIds
      }

      groupIdsArr.forEach((groupId) => {
        groups.forEach((group) => {
          if (group.parentId && group.parentId.toString() === groupId) {
            groupArr.push(group._id.toString())
          }
        })
      })
      return groupArr
    }
    getReadableGroups () {
      const authId = this.ctx.authUser._id
      const cond = {
        isDeleted: false,
        $or: [{
          privacy: null
        }, {
          privacy: PRIVACY_ALL
        }, {
          privacy: PRIVACY_MEMBER,
          member: authId
        }, {
          privacy: PRIVACY_SELF,
          manager: authId
        }]
      }
      return app.model.group.find(cond).sort({ modifiedTime: -1, createTime: -1 })
    }
    update (groupId, group) {
      return app.model.group.findOneAndUpdate({
        _id: groupId,
        manager: this.ctx.authUser._id
      }, Object.assign(group, { modifiedTime: Date.now() }), { new: true })
    }
    updateTime (groupId) {
      // 此方法允许异步执行
      return app.model.group.update({ _id: groupId }, { modifiedTime: Date.now() }, { new: true }).exec()
    }
    create (group) {
      const authId = this.ctx.authUser._id
      const _group = {
        name: group.name,
        creator: authId,
        manager: authId,
        parentId: group.group || null
      }
      return app.model.group(_group).save()
    }
    getUserGroups (user, rights) {
      return app.model.group.find({
        [rights]: user,
        isDeleted: false
      }).sort({
        createTime: -1
      })
    }
    getById (groupId) {
      return app.model.group.findOne({
        _id: groupId
      })
    }
    * delete (groupId) {
      const group = yield this.getById(groupId)
      return app.model.group.findOneAndUpdate({
        _id: groupId,
        manager: this.ctx.authUser._id
      }, {
        modifiedTime: Date.now(),
        name: `${group.name}_已删除_${group._id}`,
        isDeleted: true
      })
    }
    getManageGroup () {
      return this.getUserGroups(this.ctx.authUser._id, 'manager')
    }
    getUnmanaged () {
      return this.getUserGroups(null, 'manager')
    }
    claim (groupId) {
      return app.model.group.findOneAndUpdate({
        _id: groupId,
        manager: null
      }, {
        modifiedTime: Date.now(),
        manager: this.ctx.authUser._id
      })
    }
  }
  return Group
}
