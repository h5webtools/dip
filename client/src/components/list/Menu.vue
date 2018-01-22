<template>
  <el-col :span="0" class="menu-nav">
    <el-menu :default-active="$route.params.groupId" class="el-menu-vertical">
      <el-menu-item-group :class="{showSearch: isShowSearch}">
        <template slot="title">
          <span @click="handleNodeClick">组列表</span>
          <search @query="handleQuery" v-model="query" placeholder="请输入分组名称" size="small" id="search-group"></search>
          <i class="el-icon-plus title-icon" @click="handleClickShowDialog"></i>
          <i class="el-icon-search title-icon" @click="showSearch()"></i>
        </template>
        <el-tree
          class="menu-tree-wrap"
          :data="treeGroup"
          :props="defaultProps"
          :current-node-key="currentNodeKey"
          :default-expanded-keys="expandKey"
          :expand-on-click-node="false"
          :highlight-current="true"
          :filter-node-method="filterNode"
          :indent="20"
          :render-content="renderContent"
          node-key="key"
          accordion
          ref="menuTreeWrap"
          @node-click="handleNodeClick">
        </el-tree>
      </el-menu-item-group>
    </el-menu>
    <create-group-dialog
      :visited="showCreateDialog"
      @action="handleClickCreateGroup"
      @close="handleClickClose"/>
  </el-col>
</template>
<script>
import CreateGroupDialog from '@/components/common/CreateGroup'
import Search from './Search'
export default {
  components: {
    Search,
    CreateGroupDialog
  },
  computed: {
    groupList () {
      return this.$store.state.groups.filter(g => g.name.toLowerCase().indexOf(this.query.toLowerCase()) >= 0)
    },
    treeGroup() {
      return this.$store.getters.treeGroups;
    }
  },
  data () {
    return {
      currentNodeKey: this.$route.params.groupId || '',
      expandKey: [this.$route.params.groupId || ''],
      showCreateDialog: false,
      isShowSearch: false,
      query: '',
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  methods: {
    renderContent(h, { node, data, store }) {
      return (
        <span>
          <span>
            <span>{node.label}</span>
          </span>
          <span title="接口文档" class="tree-node-doc">
            <i class="el-icon-document" on-click={ (ev) => this.showGroupDoc(ev, node.key) }></i>
          </span>
        </span>
      );
    },
    handleQuery(val) {
      this.query = val;
      this.$refs.menuTreeWrap.filter(val);
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    showSearch () {
      this.isShowSearch = true
      window.setTimeout(() => {
        document.querySelector('#search-group input').focus()
      })
    },
    handleNodeClick(group) {
      if (group && group.key) {
        this.$router.replace(`/list/${group.key}`)
      } else {
        this.$router.replace('/')
      }
    },
    handleClickCreateGroup (groupInfo) {
      this.$store.dispatch('createGroup', groupInfo).then(() => {
        this.showCreateDialog = false
      }).catch(e => this.$message.error(e.msg))
    },
    handleClickClose () {
      this.showCreateDialog = false
    },
    handleClickShowDialog () {
      this.showCreateDialog = true
    },
    showGroupDoc (ev, key) {
      ev.stopPropagation();
      this.$router.push({
        name: 'GroupDoc',
        params: {
          groupId: key
        }
      })
    }
  }
}
</script>
<style lang="less">
.menu-nav {
  width: 288px;
  min-width: 288px;
  background-color: #eef1f6;

  .menu-tree-wrap {
    background-color: #eef1f6;
    border: none;

    .tree-node-doc {
      float: right;
      margin-right: 10px;
      display: none;
    }

    .el-tree-node__expand-icon {
      margin-left: 30px;
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
        background-color: #eef1f6;
        color: #20a0ff;
      }
    }
  }

  .el-menu-item-group__title {
    padding: 15px 20px 0 20px;
    line-height: 30px;
    position: relative;

    & > i {
      position: relative;
      right: 0;
      margin: 0 3px;
      transform: rotate(0deg);
      transform-origin: 50% 50%;
      transition: transform .3s;
      cursor: pointer;
    }
    .title-icon:hover {
      color: #20a0ff;
    }
  }

  .el-icon-plus:hover {
    transform: rotate(90deg);
  }
  .el-icon-search.title-icon {
    top: 1px;
    font-size: 15px;
  }
  .search {
    display: none;
    position: absolute;
    width: auto;
    top: 15px;
    left: 91px;
    right: 20px;
    z-index: 1;

    .el-input__inner {
      background-color: #F9FAFC;
    }
  }
  .showSearch .search {
    display: block;
  }
}

.group-item {

  [class^=el-icon-].el-icon-document {
    display: inline-block;
    font-size: 18px;
    position: relative;
    top: 2px;
    visibility: hidden;
    margin-right: 4px;
  }

  &:hover .el-icon-document {
    visibility: visible;
  }
  & > * {
    display: inline-block;
    vertical-align: middle;
  }
}
</style>
