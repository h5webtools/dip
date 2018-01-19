<template>
<div class="manage-group">
  <div class="mode-switch" :class="mode">
    <el-button size="small" class="managed" @click.native="getGroups">我的分组</el-button>
    <el-button size="small" class="unmanaged" @click.native="getUnmanaged">未认领分组</el-button>
  </div>
  <div class="group-table">
    <!-- <el-table :data="groups" style="width: 100%">
      <el-table-column prop="name" label="分组名">
      </el-table-column>
      <el-table-column prop="createTime" :formatter="timeFormat" width="200" label="创建时间">
      </el-table-column>
      <el-table-column width="160" label="操作">
        <template scope="scope">
          <control :group="scope.row" :mode="mode" @delete="groupDelete" @manage="manageGroup"></control>
        </template>
      </el-table-column>
    </el-table> -->
    <div class="group-table-head">
      <span class="col-1">分组名</span>
      <span class="col-2">创建时间</span>
      <span class="col-3">操作</span>
    </div>
    <el-tree
      class="group-manage-tree"
      :data="treeGroup"
      :props="defaultProps"
      :expand-on-click-node="false"
      :highlight-current="false"
      :default-expand-all="false"
      :render-content="renderContent"
      node-key="key">
    </el-tree>
  </div>
  <group-edit
    v-if="group"
    :visible="showGroupEdit"
    :group="group"
    @update="updateGroup"
    @hide="showGroupEdit = false">
  </group-edit>
</div>
</template>

<script>
import { mapActions } from 'vuex'
import moment from 'moment'
import Control from './GroupControl'
import GroupEdit from './GroupEdit'
import R from 'ramda'
import groups2Tree from '@/util/groups2Tree'

export default {
  components: {
    Control,
    GroupEdit
  },
  data () {
    return {
      showGroupEdit: false,
      mode: 'managed',
      group: null,
      groups: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  computed: {
    treeGroup () {
      return groups2Tree(this.groups)
    }
  },
  methods: {
    ...mapActions([
      'getManageGroup',
      'getUnmanagedGroup'
    ]),
    renderContent(h, { node, data, store }) {
      const group = this.groups.filter(g => g._id === node.key)[0] || {};

      return (
        <span>
          <span>
            <span>{node.label}</span>
          </span>
          <span class="col-2">
            <span>{this.timeFormat(group.createTime)}</span>
          </span>
          <span class="col-3">
            <Control group={group} mode={this.mode} on-delete={this.groupDelete} on-manage={this.manageGroup}></Control>
          </span>
        </span>
      );
    },
    timeFormat (val) {
      return moment(new Date(Number(val))).format('YYYY-MM-DD HH:mm:ss')
    },
    getUnmanaged () {
      this.getUnmanagedGroup().then(rs => {
        this.groups = rs.data
        this.mode = 'unmanaged'
      })
    },
    getGroups () {
      this.getManageGroup().then(rs => {
        this.groups = rs.data
        this.mode = 'managed'
      })
    },
    groupDelete (group) {
      const index = R.findIndex(a => a === group)(this.groups)
      this.groups.splice(index, 1)
    },
    manageGroup (group) {
      window.console.log(group)
      this.group = group
      this.showGroupEdit = true
    },
    updateGroup (group) {
      window.console.log(group)
      const index = R.findIndex(R.propEq('_id', group._id))(this.groups)
      this.$set(this.groups, index, group)
    }
  },
  mounted () {
    this.getGroups()
  }
}
</script>
<style lang="less">
.mode-switch {
  margin-bottom: 20px;
}
.managed .managed,
.unmanaged .unmanaged {
  color: #20a0ff;
  border-color: #20a0ff;
}

.manage-group {
  .col-1 {
    padding-left: 20px;
  }

  .col-2 {
    position: absolute;
    top: 0;
    right: 160px;
    width: 160px;
  }

  .col-3 {
    position: absolute;
    top: 0;
    right: 20px;
    width: 120px;
  }
}

.group-table-head {
  position: relative;
  line-height: 40px;
  background-color: #eef1f6;
  border: 1px solid #dfe6ec;
  font-size: 14px;
  font-weight: 700;
  color: #1f2d3d;
}

.group-manage-tree {
  border-left: 1px solid #dfe6ec;
  border-right: 1px solid #dfe6ec;
  border-top: none;
  border-bottom: none;

  .el-tree-node__content {
    position: relative;
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #dfe6ec;
  }

  .el-tree__empty-block {
    border-bottom: 1px solid #dfe6ec;
  }
}
</style>
