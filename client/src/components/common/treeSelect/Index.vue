<template>
<div class="ats-tree" v-clickoutside="hideTreeSelect" ref="atsTree">
  <div class="ats-input">
    <div class="ats-input-single">
      <i class="el-input__icon el-icon-caret-bottom"
        :class="{'is-reverse':treeVisible,'el-icon-circle-close':showCloseIcon}"
        @click="handleCaretClick"
        @mouseenter="hovering=true"
        @mouseleave="hovering=false"></i>
      <input type="text"
        class="el-input__inner"
        readonly="readonly"
        v-model="treeSelected"
        @click="handleToggleTree"
        :placeholder="placetext">
    </div>
  </div>
  <el-scrollbar v-show="treeVisible && hasTreeData" class="ats-tree-scrollbar">
    <div class="ats-tree-wrapper">
      <ul class="ats-tree-nodes">
        <tree-node
          v-for="child in treeNodes[treeProps.children]"
          :node="child"
          :key="child.key"
          :multiple="multiple"
          :currentNodeId="currentNodeId"
          :treeProps="treeProps"
          :eventHub="eventHub"
          :query="query"
          :isQuering="isQuering">
        </tree-node>
      </ul>
    </div>
  </el-scrollbar>
  <p v-show="treeVisible && !hasTreeData" class="el-select-dropdown__empty">无数据</p>
</div>
</template>

<script>
import Vue from 'vue';
import treeNode from './TreeNode.vue';
import Clickoutside from 'element-ui/src/utils/clickoutside';

export default {
  name: 'tree',
  components: {
    treeNode
  },
  props: {
    treeData: {
      type: Array,
      default: []
    },
    treeProps: {
      type: Object,
      default() {
        return {
          label: 'label',
          children: 'children'
        };
      }
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    value: null,
    multiple: {  // 多选，先保留
      type: Boolean
    }
  },
  created() {
    if (this.value) {
      this.setSelected(this.value);
    }
    this.eventHub.$on('node-click', this.handleNodeClick);
  },
  updated() {
    this.isDefault = true;
  },
  computed: {
    hasTreeData() {
      return (
        Array.isArray(this.treeData),
        this.treeData.length > 0
      );
    },
    showCloseIcon() {
      return (
        this.hovering &&
        this.treeSelected !== undefined &&
        this.treeSelected !== ''
      );
    }
  },
  watch: {
    value(val) {
      if (this.isDefault) {
        this.setSelected(this.value);
      }
      this.$emit('change', val);
    },
    treeData(val) {
      if (val) {
        this.treeNodes = {
          [this.treeProps.children]: objArrDeepCopy(val, { visible: true }),
          visible: true
        };
        this.setSelected(this.value);
      }
    }
  },
  data() {
    return {
      treeNodes: {
        [this.treeProps.children]: objArrDeepCopy(this.treeData, {
          visible: true
        }),
        visible: true
      },
      placetext: this.placeholder,
      currentNodeId: '',
      treeSelected: '',
      treeVisible: false,
      eventHub: new Vue(),
      isQuering: false,
      query: '',
      isDefault: true,
      error: {
        message: '',
        data: ''
      },
      hovering: false
    };
  },
  methods: {
    hideTreeSelect() {
      this.treeVisible = false;
    },
    handleCaretClick() {
      // 如果显示的是close icon，重置值
      if (this.showCloseIcon) {
        this.currentNodeId = '';
        this.treeSelected = '';
        this.$emit('input', '');
        this.hideTreeSelect();
      } else {
        this.handleToggleTree();
      }
    },
    handleNodeClick(node, event) {
      if (event) {
        this.isDefault = false;
      }
      this.currentNodeId = node.key;
      this.treeSelected = node[this.treeProps.label];
      this.$emit('input', node.key);
      this.hideTreeSelect();
    },
    handleToggleTree() {
      this.treeVisible = !this.treeVisible;
    },
    setSelected(val) {
      if (!val) return;
      this.findTreeItem(val, this.treeNodes);
      if (!this.currentNodeId) {
        this.setErrorMessage(val);
      }
    },
    findTreeItem(key, treeNodes) {
      let childNodes = treeNodes[this.treeProps.children];

      if (!childNodes) return;
      for (let i = 0; i < childNodes.length; i++) {
        if (childNodes[i].key === key) {
          this.handleNodeClick(childNodes[i]);
          break;
        } else {
          this.findTreeItem(key, childNodes[i]);
        }
      }
    },
    setErrorMessage(data) {
      if (!data || !data.toString()) return;
      let errorText = data instanceof Array ? data.toString() : data;

      this.error.message = `发现不存在的key:${errorText}`;
      this.error.data = data;
      this.$emit('error', this.error);
    }
  },
  directives: { Clickoutside }
};

function objArrDeepCopy(source, extendObj) {
  const sourceCopy = source instanceof Array ? [] : {};
  for (let item in source) {
    sourceCopy[item] = typeof source[item] === 'object' ? objArrDeepCopy(source[item], extendObj) : source[item];
    if (typeof extendObj === 'object' && !(sourceCopy instanceof Array)) {
      for (let param in extendObj) {
        sourceCopy[param] = extendObj[param];
      }
    }
  }
  return sourceCopy;
}
</script>

<style lang="less">
.ats-tree {
  display: block;
  position: relative;
  .ats-input {
    position: relative;
    .el-icon-caret-bottom {
      cursor: pointer;
      &.is-reverse {
        transform: rotateZ(180deg);
      }
    }
  }
  .el-input__inner {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid rgb(191, 204, 217);
    box-sizing: border-box;
    color: rgb(31, 46, 61);
    display: block;
    font-size: inherit;
    height: 36px;
    line-height: 1;
    outline: 0;
    padding: 3px 10px;
    cursor: pointer;
    transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  }
  .ats-input-multiple {
    height: auto;
  }
  .ats-input-multiple input {
    line-height: 1;
    height: 28px;
    box-sizing: border-box;
    outline: none;
    border: 0px;
    position: relative;
    right: 35px;
    left: 0;
    width: 320px;
  }
  .ats-input-multiple .el-select__tags {
    position: relative;
    height: auto;
    top: auto;
    transform: none;
    width: 320px;
    &:hover {
      cursor: pointer;
    }
  }
  .ats-input-multiple .el-select__tags .el-tag {
    margin: 5px;
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: top;
  }
  .ats-input-multiple input:focus {
    outline: none;
  }
  .ats-tree-scrollbar {
    top: 40px;
    width: 100%;
    min-height: 160px;
    position: absolute;
    z-index: 1001;
    background-color: #fff;
    border: 1px solid #d1dbe5;
    border-radius: 2px;
    box-shadow: 0 2px 4px rgba(0,0,0,.12), 0 0 6px rgba(0, 0, 0, .04);
    .el-scrollbar__view {
      max-height: 400px;
    }
    transition: all 0.1s linear;
  }
  .el-select-dropdown__empty {
    position: absolute;
    top: 40px;
    z-index: 1001;
    width: 100%;
    background-color: #fff;
    border: 1px solid #d1dbe5;
    border-radius: 2px;
    box-shadow: 0 2px 4px rgba(0,0,0,.12), 0 0 6px rgba(0, 0, 0, .04);
    transition: all 0.1s linear;
  }
  .ats-tree-wrapper {
    background-color: #fff;
  }
}
</style>
