<template>
  <div class="apis el-col" v-if="groups" :class="$route.name">
    <el-menu
      :default-active="$route.params.apiId"
      :default-openeds="defaultOpeneds"
      class="el-menu-vertical"
      :router="true">
      <div v-if="group">
        <el-menu-item-group v-if="group">
          <template slot="title">
            <span>组列表</span>
          </template>
          <el-tree
            class="menu-tree-wrap"
            :data="treeGroup"
            :props="defaultProps"
            :current-node-key="currentNodeKey"
            :expand-on-click-node="false"
            :default-expand-all="true"
            :highlight-current="true"
            node-key="key"
            @node-click="handleNodeClick">
          </el-tree>
        </el-menu-item-group>
        <el-menu-item-group>
          <template slot="title">
            <span>接口列表</span>
          </template>
          <el-menu-item
            v-for="api in apis"
            :index="api._id"
            :route="{ name: 'ApiDoc', params: { groupId: group._id, apiId: api._id}}"
            :key="api._id"
            class="api">
            <label class="method" :class="api.options.method">{{api.options.method.toUpperCase()}}</label>
            <span class="api-name">{{api.name}}</span>
          </el-menu-item>
        </el-menu-item-group>
      </div>
      <div v-else>
        <el-menu-item
          class="group"
          v-if="g.key !== $route.params.groupId"
          v-for="g in treeGroups"
          :key="g.key"
          :index="'/doc/' + g.key">
          {{getGroupName(g)}}
        </el-menu-item>
      </div>
    </el-menu>
  </div>
</template>

<script>
export default {
  props: ['apis'],
  data() {
    return {
      currentNodeKey: this.$route.params.groupId || '',
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  watch: {
    '$route'(currentRoute) {
      this.currentNodeKey = currentRoute.params.groupId || ''
    }
  },
  computed: {
    defaultOpeneds () {
      return this.group ? [this.group._id] : []
    },
    treeGroups() {
      return this.$store.getters.treeGroups
    },
    groupsPos() {
      return this.$store.getters.posCollection
    },
    groups () {
      return this.$store.state.groups.filter(group => !group.parentId)
    },
    group () {
      return this.$store.state.groups.find(g => g._id === this.$route.params.groupId)
    },
    treeGroup() {
      const groupId = this.$route.params.groupId
      const group = this.groupsPos[groupId]

      if (Array.isArray(group) && group.length > 0) {
        const current = this.treeGroups[group[0]]
        return current ? [current] : this.treeGroups
      }
      return this.treeGroups
    }
  },
  methods: {
    handleNodeClick(group) {
      if (group && group.key) {
        this.$router.replace(`/doc/${group.key}`)
      } else {
        this.$router.replace('/doc/all')
      }
    },
    getGroupName(group) {
      if (Array.isArray(group.children)) {
        const len = group.children.length
        return len ? `${group.label}(${len})` : group.label
      }
      return group.label
    },
    showApiDoc (api) {
      const { groupId, apiId } = this.$route.params
      if (api._id === apiId) {
        return
      }
      this.$router.push(`/doc/${groupId}/${api._id}`)
    }
  }
}
</script>
<style lang="less">
.apis {
  transition: width 0.4s ease;
  width: 288px;
  min-width: 288px;
  background-color: #f8f8f8;

  .menu-tree-wrap {
    background-color: #f8f8f8;
    border: none;

    & > .el-tree-node {
      & > .el-tree-node__content {
        padding-left: 16px !important;
      }
    }

    .tree-node-doc {
      float: right;
      margin-right: 10px;
      display: none;
    }

    .el-tree-node__content {
      height: 56px;
      line-height: 56px;
      font-size: 14px;
      color: #48576a;
      padding-right: 20px;
      cursor: pointer;
      position: relative;
      transition: border-color .3s, background-color .3s, color .3s;
      box-sizing: border-box;
      white-space: nowrap;

      &:hover {
        background-color: #d1dbe5;

        .tree-node-doc {
          display: block;
        }
      }
    }
  }

  .el-tree--highlight-current {
    .el-tree-node.is-current {
      & > .el-tree-node__content {
        background-color: #f8f8f8;
        color: #20a0ff;
      }
    }
  }

  &.AllDoc {
    width: 100%;
    padding: 30px;
    display: block !important;

    .group {
      display: inline-block;
      margin: 20px;
    }
  }

  .el-submenu {
    .el-menu {
      background-color: #f8f8f8;
    }
  }

  .api {
    height: 36px;
    line-height: 36px;
    padding: 0 20px !important;
  }
  .el-menu-item.api:hover {
    background-color: #eee;
  }

  .el-menu {
    background-color: #f8f8f8;
  }
  .el-menu-item-group__title {
    margin-bottom: 15px;
  }
  .method {
    display: inline-block;
    width: 44px;
    text-align: right;
    margin-right: 8px;
    font-size: 12px;
  }
  .api-name {
    vertical-align: middle;
    display: inline-block;
    width: 196px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
