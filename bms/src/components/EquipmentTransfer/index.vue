<template>
  <el-dialog
    :visible="visible"
    title="转移设备"
    @close="$emit('update:visible', false)"
    @closed="$refs.form.resetFields()"
    width="700px"
  >
    <el-form
      :model="model"
      ref="form"
      :rules="rules"
      label-width="100px"
    >
      <el-row>
        <el-col :span="22">
          <el-form-item
            label="所属组织:"
            prop="organization"
          >
            <TreeSelect
              v-model="model.organization"
              :data="treeData"
              :props="defaultProps"
              node-key="organizationId"
              icon="icon-truckgroup"
              :disabled="false"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="22">
          <el-form-item
            label="设备号:"
            prop="terminalNo"
          >
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              v-model="model.terminalNo"
            >
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

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
        @click="removeVehicle()"
      >确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { toTreeData } from "@/assets/js/base";
import TreeSelect from "@/components/TreeSelect/index.vue";

export default {
  components: {
    TreeSelect
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
        organization: null,
        terminalNo: null
      },
      rules: {
        organization: [
          {
            required: true,
            message: "上级组织不能为空",
            trigger: "change"
          },
          { type: "object", message: "上级组织不能为空" }
        ],
        terminalNo: [
          {
            required: true,
            message: "设备号不能为空",
            trigger: "blur"
          }
        ]
      },
      defaultProps: {
        children: "children",
        label: "organizationName"
      }
    };
  },

  computed: {
    ...mapState(["GROUPLIST"]),
    treeData() {
      return toTreeData(this.GROUPLIST, {
        id: "organizationId",
        parentId: "parentId"
      });
    }
  },

  watch: {
    params(val) {
      if (!val) return;
      const { groupId, groupName } = val[0];
      const organizationId = groupId,
        organizationName = groupName;
      this.model.organization = { organizationId, organizationName };
      this.model.terminalNo = val.map(item => item.terminalNo).join(",");
      console.log(this.model.organization);
    }
  },

  methods: {
    ...mapMutations(["COMMIT_GROUPLIST"]),
    async removeVehicle() {
      try {
        await this.$refs.form.validate();
        console.log(this.model.organization);
        const params = {
          organizationId: this.model.organization.organizationId,
          terminalNos: this.model.terminalNo
        };
        const { msg } = await this.$API.removeVehicle(params);

        this.$msg({
          showClose: true,
          message: msg,
          type: "success"
        });
        this.$emit("update:visible", false);
        this.$emit("onTransferVehsOk");

        //更新树状图数据
        const res = await this.$API.getOTree();

        if (Array.isArray(res.data)) {
          this.COMMIT_GROUPLIST(res.data);
        } else {
          this.COMMIT_GROUPLIST([res.data]);
        }
      } catch (error) {
        console.error(error);
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
.el-select,
.el-date-editor {
  width: 510px !important;
}
</style>
