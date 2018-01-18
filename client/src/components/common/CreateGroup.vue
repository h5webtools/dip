<template>
  <el-dialog title="创建Group" v-model="visited" :show-close="false" class="create-group-dialog">
    <el-form v-stop-default-enter>
      <el-form-item label="分组名称" class="required">
        <el-input v-model="input" placeholder="输入分组名称"></el-input>
      </el-form-item>
      <el-form-item label="接口分组（不选择默认为一级分组）">
        <tree-select
          class="clear-both"
          v-model="group"
          :treeData="groups"
          placeholder="请选择分组">
        </tree-select>
      </el-form-item>
    </el-form>
    <div class="dialog-footer" slot="footer">
      <el-button type="default" @click="handleClickCancel">取消</el-button>
      <el-button type="primary" @click="handleClickAction" ref="create" :disabled="actionDisabled">创建</el-button>
    </div>
  </el-dialog>
</template>

<script>
import TreeSelect from '@/components/common/treeSelect/Index'

// emit: close,action
// props: visited
export default {
  components: {
    TreeSelect
  },
  props: {
    visited: {
      default: false,
      required: true
    }
  },
  data () {
    return {
      input: '',
      group: ''
    }
  },
  methods: {
    handleClickAction () {
      this.$emit('action', {
        name: this.input,
        group: this.group
      })
    },
    handleClickCancel () {
      this.resetValue()
      this.$emit('close', this)
    },
    resetValue() {
      this.input = ''
      this.group = ''
    }
  },
  watch: {
    visited (val) {
      if (!val) {
        this.resetValue()
        this.$emit('close', this)
      }
    }
  },
  computed: {
    actionDisabled () {
      return !this.input
    },
    groups () {
      return this.$store.getters.treeGroups
    }
  }
}
</script>
<style>
.create-group-dialog .el-input__inner {
 background: #fff;
}
.clear-both {
  clear: both;
}
</style>
