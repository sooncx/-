<template>
  <el-dialog
    :visible="visible"
    :title="title"
    @close="$emit('update:visible', false)"
    @closed="initModel()"
    width="700px"
  >
    <el-form
      :model="deviceModel"
      ref="form"
      :rules="rules"
      label-width="100px"
      :inline="true"
    >
      <!-- <el-row v-if="params ? params.organizationName : true">
        <el-col :span="12">
          <el-form-item label="上级组织:" prop="organization">
            <TreeSelect
              v-model="model.organization"
              :data="treeData"
              :props="defaultProps"
              icon="icon-truckgroup"
              node-key="organizationId"
              :disabled="!!params"
            />
          </el-form-item>
        </el-col>
      </el-row> -->
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="电池编号:"
            prop="bmsNo"
          >
            <el-input
              size="small"
              v-model.trim="deviceModel.bmsNo"
              autocomplete="off"
              maxlength="10"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="电池类型"
            prop="bmsType"
          >
            <el-select
              v-model="deviceModel.bmsType"
              placeholder="请选择"
            >
              <el-option
                v-for="item in bmsTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="设备号:"
            prop="terminalNo"
          >
            <el-input
              size="small"
              v-model.trim="deviceModel.terminalNo"
              autocomplete="off"
              maxlength="13"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="设备类型"
            prop="terminalType"
          >
            <el-select
              v-model="deviceModel.terminalType"
              placeholder="请选择"
            >
              <el-option
                v-for="item in terminalTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="安装时间:"
            prop="doDate"
          >
            <el-date-picker
              v-model="deviceModel.doDate"
              type="date"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="激活时间:"
            prop="activationTme"
          >
            <el-date-picker
              v-model="deviceModel.activationTme"
              type="date"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="服务密码:"
            prop="serviceCode"
          >
            <el-input
              size="small"
              v-model.trim="deviceModel.serviceCode"
              autocomplete="off"
              maxlength="10"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="SIM卡号:"
            prop="sim"
          >
            <el-input
              size="small"
              v-model.trim="deviceModel.sim"
              autocomplete="off"
              maxlength="13"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="所属组织:"
            prop="organization"
          >
            <TreeSelect
              v-model="deviceModel.organization"
              :data="treeData"
              :props="defaultProps"
              node-key="organizationId"
              icon="icon-truckgroup"
              :disabled="type === 'update'?true:false"
            />
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item
            label="备注信息:"
            prop="installRemark"
          >
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              v-model="deviceModel.installRemark"
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
        @click="addVehicle()"
      >确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import day from "dayjs";
import { mapState, mapMutations } from "vuex";
import { toTreeData } from "@/assets/js/base";
import TreeSelect from "@/components/TreeSelect/index.vue";

const defaultDeviceModel = {
  organization: null,
  activationTme: null,
  bmsNo: null,
  bmsType: "三元锂电池",
  doDate: null,
  groupId: null,
  installRemark: null,
  serviceCode: null,
  sim: null,
  terminalNo: null,
  terminalType: "GPRS-部标"
};

export default {
  components: {
    TreeSelect
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      required: true
    },
    params: {
      type: Object,
      default: null
    }
  },

  data() {
    return {
      textarea: "",
      value: "",
      terminalTypeOptions: [
        {
          value: "GPRS-部标",
          label: "GPRS-部标"
        }
      ],
      bmsTypeOptions: [
        {
          value: "三元锂电池",
          label: "三元锂电池"
        },
        {
          value: "磷酸铁锂电池",
          label: "磷酸铁锂电池"
        }
      ],
      deviceModel: {
        ...JSON.parse(JSON.stringify(defaultDeviceModel))
      },
      rules: {
        bmsNo: [
          {
            required: true,
            message: "电池编号不能为空",
            trigger: "blur"
          }
        ],
        terminalNo: [
          {
            required: true,
            message: "设备号不能为空",
            trigger: "blur"
          },
          {
            pattern: /^\d{11,13}$/,
            message: "设备号为11-13位",
            trigger: "blur"
          }
        ],
        sim: [
          {
            required: true,
            message: "sim卡号不能为空",
            trigger: "blur"
          },
          {
            pattern: /^1[3-9][0-9]\d{8}$/,
            message: "请输入正确的手机号",
            trigger: "blur"
          }
        ],
        serviceCode: [
          {
            required: true,
            message: "服务密码不能为空",
            trigger: "blur"
          }
        ],
        activationTme: [
          {
            trigger: "blur",
            validator: (rule, value, callback) =>
              day(value).valueOf() > Date.now()
                ? callback(new Error("不能大于当前日期"))
                : callback()
          }
        ],
        doDate: [
          {
            required: true,
            message: "安装日期不能为空",
            trigger: "blur"
          },
          {
            trigger: "blur",
            validator: (rule, value, callback) =>
              day(value).valueOf() > Date.now()
                ? callback(new Error("不能大于当前日期"))
                : callback()
          },
          {
            trigger: "blur",
            validator: (rule, value, callback) => {
              if (this.deviceModel.activationTme) {
                day(value).valueOf() > this.deviceModel.activationTme
                  ? callback(new Error("不能大于激活日期"))
                  : callback();
              }
            }
          }
        ],
        bmsType: [
          {
            required: true,
            message: "请选择电池类型",
            trigger: "blur"
          }
        ],
        terminalType: [
          {
            required: true,
            message: "请选择设备类型",
            trigger: "blur"
          }
        ],
        organization: [
          {
            required: true,
            message: "所属组织不能为空", //this.$t("login.username_rules"),
            trigger: "blur"
          },
          { type: "object", message: "所属组织不能为空" }
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
    },
    title() {
      const titleObj = {
        add: "添加设备",
        update: "修改设备"
      };
      return titleObj[this.type];
    }
  },
  watch: {
    params: {
      handler(val) {
        if (!val) return;
        this.deviceModel = val;
        const { groupId, groupName, ...otherParams } = val;
        const organizationId = val.groupId || val.organizationId,
          organizationName = val.groupName || val.organizationName;
        this.deviceModel.organization = { organizationId, organizationName };
        Object.keys(this.deviceModel).map(
          key =>
            otherParams[key] !== undefined &&
            (this.deviceModel[key] = otherParams[key])
        );
      }
    }
  },

  methods: {
    handleApi() {},
    ...mapMutations(["COMMIT_GROUPLIST"]),
    initModel() {
      this.$refs.form.resetFields();
      this.deviceModel = JSON.parse(JSON.stringify(defaultDeviceModel));
    },
    async add(_params) {
      const params = {
        ..._params
      };
      params.groupId = this.deviceModel.organization.organizationId;
      console.log("添加参数");
      console.log(params);
      return await this.$API.addVehicle(params);
    },
    async update(_params) {
      const { vehicleId } = this.params;
      const params = {
        ..._params,
        vehicleId
      };
      console.log("修改参数");
      console.log(params);
      return await this.$API.updateVehicle(params);
    },
    async addVehicle() {
      try {
        await this.$refs.form.validate();
        this.deviceModel.doDate = day(this.deviceModel.doDate).format(
          "YYYY-MM-DD"
        );
        this.deviceModel.activationTme = day(
          this.deviceModel.activationTme
        ).format("YYYY-MM-DD");
        const params = this.deviceModel;

        const apiFnObj = {
          add: "add",
          update: "update"
        };

        const { msg } = await this[apiFnObj[this.type]](params);
        this.$msg({
          showClose: true,
          message: msg,
          type: "success"
        });
        this.$emit("update:visible", false);
        this.$emit("onHandleDeviceOk");

        //更新树状图
        const { data } = await this.$API.getOTree();
        if (Array.isArray(data)) {
          this.COMMIT_GROUPLIST(data);
        } else {
          this.COMMIT_GROUPLIST([data]);
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
  width: 200px !important;
}
.el-textarea {
  width: 530px !important;
}
</style>
