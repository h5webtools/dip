<template>
<li class="ats-tree-node"
  :class="{'is-expanded':expanded}">
  <div class="ats-tree-node__content"
    v-show="node.visible"
    :style="{ 'padding-left': (level - 1) * 14 + 'px' }"
    :class="{'is-current':currentNodeId===node.key,'is-checked':node.checked}">
    <div class="ats-tree-node__icon icon">
      <span
        v-if="node[treeProps.children] && node[treeProps.children].length"
        class="ats-tree-node__expand-icon icon"
        :class="{ expanded: expanded }"
        @click.stop="handleClick(node, $event)">
      </span>
    </div>
    <span
      class="ats-tree-node__label"
      :title="handleTitleVisible(node[treeProps.label])"
      @click.stop="handleSelect(node, $event)">
      {{node[treeProps.label]}}
    </span>
  </div>
  <ul class="ats-tree-node__children" v-show="expanded">
    <tree-node
      v-for="child in node[treeProps.children]"
      :node="child"
      :level="childLevel"
      :key="child.key"
      :treeProps="treeProps"
      :currentNodeId="currentNodeId"
      :eventHub="eventHub"
      :query="query"
      :isQuering="isQuering">
    </tree-node>
  </ul>
</li>
</template>

<script>
export default {
  name: 'treeNode',
  props: {
    node: {
      type: Object,
      default: {}
    },
    level: {
      type: Number,
      default: 1
    },
    treeProps: {},
    multiple: {},
    currentNodeId: '',
    eventHub: {},
    query: {
      type: String
    },
    isQuering: {
      type: Boolean
    }
  },
  data() {
    return {
      childLevel: this.level + 1,
      expanded: false
    };
  },
  created() {
    if (this.currentNodeId === this.node.key) {
      // 向上寻找，然后展开tree
      let parentNode = this.$parent;
      while (parentNode && parentNode.$options.name === 'treeNode') {
        parentNode.expanded = true;
        parentNode = parentNode.$parent;
      }
    }
  },
  methods: {
    handleSelect(node, event) {
      this.eventHub.$emit('node-click', node, event);
    },
    handleClick(node, event) {
      this.expanded = !this.expanded;
    },
    handleTitleVisible(title) {
      let titleLen = title.replace(/[^\x00-\xff]/g, '..').length;
      if (titleLen > 28) {
        return title;
      } else {
        return '';
      }
    }
  }
};
</script>

<style lang="less">
.ats-tree-node {
  .ats-tree-node__content {
    text-indent: 5px;
    line-height: 36px;
    height: 36px;
    cursor: pointer;
    white-space: nowrap;
    &:hover {
      background: rgb(228, 232, 241);
    }
    &.is-current {
      background-color: rgb(4, 137, 224);
      color: #fff;
    }
    .ats-tree-node__icon {
      display: inline-block;
      width: 22px;
      height: 36px;
      vertical-align: top;
    }
    .ats-tree-node__expand-icon {
      display: inline-block;
      vertical-align: middle;
      cursor: pointer;
      width: 0;
      height: 0;
      margin-left: 10px;
      border: 6px solid transparent;
      border-right-width: 0;
      border-left-color: rgb(151, 169, 190);
      border-left-width: 7px;
      transform: rotate(0);
      transition: transform 0.3s ease-in-out;
      &.expanded {
        transform: rotate(90deg);
      }
    }
    .ats-tree-node__label {
      display: inline-block;
      width: calc(~"100% - 22px");
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .ats-tree-node__content.is-checked .ats-tree-node__label {
    &::after {
      color: #20a0ff;
      content: "\E608";
      font-family: element-icons;
      right: 10px;
      font-size: 11px;
      position: absolute;
      -webkit-font-smoothing: antialiased;
    }
  }
}
</style>
