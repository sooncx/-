<template>
  <el-dialog
    :visible="visible"
    title="删除用户"
    @close="$emit('update:visible', false)"
    width="500px"
  >
    <Result
      title="是否确认删除用户"
      subtitle="重要提示：帐号被删时，该帐号下子级账号也会被删除"
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
        @click="doDeleteUser()"
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
      userIds: null
    };
  },
  watch: {
    params(val) {
      if (!val) {
        this.userIds = "";
        return;
      }
      this.userIds = val.map(item => item.id).join(",");
    }
  },
  methods: {
    ...mapMutations(["COMMIT_USERLIST"]),
    async doDeleteUser() {
      try {
        const params = {
          userIds: this.userIds
        };
        const { msg } = await this.$API.delUser(params);

        this.$msg({
          showClose: true,
          message: msg,
          type: "success"
        });
        this.$emit("update:visible", false);
        this.$emit("handleDelOk");
        //更新树状图数据

        const { data } = await this.$API.showUser();
        if (Array.isArray(data)) {
          this.COMMIT_USERLIST(data);
        } else {
          this.COMMIT_USERLIST([data]);
        }
      } catch (error) {
        this.$msg({
          showClose: true,
          message: error ? error.msg : "请输入正确字段",
          type: "error"
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
