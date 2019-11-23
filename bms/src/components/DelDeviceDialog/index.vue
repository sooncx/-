<template>
  <el-dialog
    :visible="visible"
    title="删除设备"
    @close="$emit('update:visible', false)"
    :width="params ? '500px' : '600px'"
  >
    <Result
      v-show="params"
      title="是否确认删除设备"
    />

    <template slot="footer">
      <el-button
        type="info"
        plain
        size="small"
        @click="$emit('update:visible', false)"
      >取消</el-button>
      <el-button
        type="primary"
        plain
        size="small"
        @click="doDeleteVehicle()"
      >确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { mapMutations } from "vuex";
import Result from "@/components/Result/index.vue";

export default {
  components: {
    Result
  },

  props: {
    visible: {
      type: Boolean,
      default: false
    },
    params: {
      type: Array,
      default: undefined
    }
  },

  data() {
    return {
      model: {
        terminalNos: ""
      }
    };
  },

  watch: {
    params(val) {
      if (!val) {
        this.model.terminalNos = "";
        return;
      }
      this.model.terminalNos = val.map(item => item.terminalNo).join(",");
    }
  },

  methods: {
    ...mapMutations(["COMMIT_GROUPLIST"]),
    async doDeleteVehicle() {
      try {
        const params = {
          terminalNos: this.model.terminalNos
        };
        const { msg } = await this.$API.delVehicle(params);

        this.$msg({
          showClose: true,
          message: msg,
          type: "success"
        });
        this.$emit("update:visible", false);
        this.$emit("onDeleteVehsOk");

        //更新树状图数据
        const { data } = await this.$API.getOTree();
        if (Array.isArray(data)) {
          this.COMMIT_GROUPLIST(data);
        } else {
          this.COMMIT_GROUPLIST([data]);
        }
      } catch (error) {
        this.$msg({
          showClose: true,
          message: error ? error.msg : "删除失败",
          type: "error"
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
