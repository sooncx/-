<template>
  <ManageBox class="vehManage">
    <!-- 树状图开始 -->
    <FilterTree
      slot="left"
      v-model="group"
      @onAddGroup="handleOnAddGroup"
      @onDeleteGroup="handleOnDeleteGroup"
      @onEditGroup="handleOnEditGroup"
      @onHandleVeh="handleVeh"
    />
    <!-- 树状图结束 -->

    <template slot="right">
      <!-- 功能选项开始 -->
      <div class="vehManage__filterType">
        <el-button
          size="small"
          type="primary"
          @click="handleVeh('add')"
        >添加设备</el-button>
        <el-button
          size="small"
          type="primary"
          @click="handleOnTransferDevs({type: 'select'})"
        >转移</el-button>
        <el-button
          size="small"
          type="primary"
          @click="handleOnDeleteVehs({type: 'select'})"
        >删除</el-button>
        <el-button
          style="margin-left: auto"
          size="small"
          icon="el-icon-download"
          @click="handleOnExportFile()"
        >导出</el-button>
      </div>
      <!-- 功能选项结束 -->

      <!-- 表格开始 -->
      <el-table
        ref="table"
        :data="tableData"
        border
        style="width: 100%"
        row-key="vehicleId"
        @selection-change="val => multipleSelection = val"
        :max-height="$refs.table && $refs.table.$el.offsetHeight"
      >
        <el-table-column
          align="center"
          type="selection"
          width="55"
          :reserve-selection="false"
        />
        <el-table-column
          fixed
          type="index"
          label="序号"
          width="100"
          align="center"
        >
          <span slot-scope="{$index}">{{(currentPage - 1) * pageSize + $index + 1}}</span>
        </el-table-column>
        <el-table-column
          prop="bmsNo"
          label="电池编号"
          width="150"
          align="center"
        >
          <template slot-scope="{row}">
            {{ row.bmsNo || '暂无数据' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="bmsType"
          label="电池类型"
          width="150"
          align="center"
        />
        <el-table-column
          prop="terminalNo"
          label="设备号"
          width="150"
          align="center"
        />
        <el-table-column
          prop="sim"
          label="SIM卡号"
          width="150"
          align="center"
        />
        <el-table-column
          prop="terminalType"
          label="设备类型"
          align="center"
          min-width="150"
        />
        <el-table-column
          prop="serviceCode"
          label="服务密码"
          align="center"
          min-width="150"
        />
        <el-table-column
          prop="doDate"
          label="安装时间"
          width="100"
          align="center"
        />
        <el-table-column
          prop="updateTime"
          label="激活时间"
          width="200"
          align="center"
        />
        <el-table-column
          prop="installRemark"
          label="备注"
          align="center"
          min-width="150"
        />
        <el-table-column
          fixed="right"
          label="操作"
          width="200"
          align="center"
        >
          <template slot-scope="{row}">
            <el-button
              type="text"
              size="small"
              @click="handleVeh('update', row)"
            >修改</el-button>
            <el-button
              type="text"
              size="small"
              @click="handleOnDeleteVehs({data:[row]})"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 表格结束 -->

      <!-- 分页开始 -->
      <el-pagination
        :current-page.sync="currentPage"
        :page-size.sync="pageSize"
        :page-sizes="[20, 50, 100]"
        @size-change="sizeChange"
        @current-change="currentChange"
        layout="sizes,total, prev, pager, next"
        :total="total"
      />
      <!-- 分页结束 -->
    </template>

    <LazyRender slot="plugins">
      <DelDeviceDialog
        :visible.sync="DeleteVehs.visible"
        :params="DeleteVehs.params"
        @onDeleteVehsOk="handleVehOk()"
      />
      <EquipmentTransfer
        :visible.sync="TransferVehs.visible"
        :params="TransferVehs.params"
        @onTransferVehsOk="handleVehOk()"
      />
      <HandleDeviceDialog
        :visible.sync="HandleVeh.visible"
        :type="HandleVeh.type"
        :params="HandleVeh.params"
        @onHandleDeviceOk="handleVehOk()"
      />
      <AddGroupDialog
        :visible.sync="AddGroup.visible"
        :params="AddGroup.params"
        type="submit"
      />
      <DeleteGroupDialog
        :visible.sync="DeleteGroup.visible"
        :params="DeleteGroup.params"
      />
      <EditGroupDialog
        :visible.sync="EditGroup.visible"
        :params="EditGroup.params"
        @onEditGroupOk="handleVehOk()"
      />
    </LazyRender>
  </ManageBox>
</template>

<script>
import { mapState } from "vuex";
import ManageBox from "@/components/ManageBox/index.vue";
import LazyRender from "@/components/LazyRender/index.vue";
import FilterTree from "./FilterTree.vue";
import DelDeviceDialog from "@/components/DelDeviceDialog/index.vue";
import EquipmentTransfer from "@/components/EquipmentTransfer/index.vue";
import HandleDeviceDialog from "@/components/HandleDeviceDialog/index.vue";
import AddGroupDialog from "@/components/AddGroupDialog/index.vue";
import DeleteGroupDialog from "@/components/DeleteGroupDialog/index.vue";
import EditGroupDialog from "@/components/EditGroupDialog/index.vue";

export default {
  name: "vehManage",
  components: {
    ManageBox,
    LazyRender,
    FilterTree,
    EquipmentTransfer,
    DelDeviceDialog,
    HandleDeviceDialog,
    AddGroupDialog,
    DeleteGroupDialog,
    EditGroupDialog
  },

  data() {
    return {
      multipleSelection: [], //当前选中项
      currentPage: 1,
      pageSize: 20,
      total: 0,
      group: null, //当前组织
      tableData: [],
      //添加组织dialog props
      AddGroup: {
        visible: false,
        params: null
      },
      //修改组织dialog props
      EditGroup: {
        visible: false,
        params: null
      },
      //删除组织dialog props
      DeleteGroup: {
        visible: false,
        params: null
      },
      //转移设备dialog props
      TransferVehs: {
        visible: false,
        params: null
      },
      //删除设备dialog props
      DeleteVehs: {
        visible: false,
        params: null
      },
      //处理设备dialog props
      HandleVeh: {
        visible: false,
        params: null,
        type: "" //add modify disabled
      }
    };
  },

  watch: {
    group(val) {
      if (!val) return;
      this.doGetVehicleByOrganizationId(val);
    }
  },

  computed: {
    ...mapState(["USER"])
  },

  methods: {
    sizeChange() {
      this.doGetVehicleByOrganizationId(this.group);
    },
    currentChange() {
      this.doGetVehicleByOrganizationId(this.group);
    },
    //导出设备
    handleOnExportFile() {
      if (!this.tableData.length) {
        this.$msg({
          showClose: true,
          message: "无可导出的设备",
          type: "warning"
        });
        return;
      }
      const params = {
        organizationId: String(this.group.organizationId)
      };
      this.$API.writeExcelVehicle(params);
    },
    //根据组织id显示设备信息
    async doGetVehicleByOrganizationId({ organizationId }) {
      try {
        const { data,total } = await this.$API.getVehiclesByOId({
          organizationId,
          pagger: this.currentPage,
          total: this.pageSize
        });
        this.total = total;
        this.tableData = data;
      } catch (error) {
        console.error(error);
        this.$msg({
          showClose: true,
          message: error.msg,
          type: "error"
        });
      }
    },
    //添加组织
    handleOnAddGroup({ organizationId, organizationName, parentId, userId }) {
      this.AddGroup.params = {
        organizationId,
        organizationName,
        parentId,
        userId
      };
      this.AddGroup.visible = true;
    },

    //处理删除组织
    handleOnDeleteGroup({ organizationId }) {
      this.DeleteGroup.params = { organizationId };
      console.log(this.DeleteGroup.params);
      this.DeleteGroup.visible = true;
    },
    //处理修改组织
    handleOnEditGroup({ organizationId, organizationName }) {
      this.EditGroup.params = { organizationId, organizationName };
      console.log(this.EditGroup.params);
      this.EditGroup.visible = true;
    },
    //处理转移设备
    handleOnTransferDevs({ type, data } = {}) {
      let param;
      if (type !== undefined && type === "select") {
        if (!this.multipleSelection.length) {
          this.$msg({
            showClose: true,
            message: "请选择设备",
            type: "warning"
          });
          return;
        }
        param = [...this.multipleSelection];
      } else {
        param = data;
      }
      this.TransferVehs.params = param;
      this.TransferVehs.visible = true;
    },
    //处理删除设备
    handleOnDeleteVehs({ type, data } = {}) {
      let param;
      if (type !== undefined && type === "select") {
        if (!this.multipleSelection.length) {
          this.$msg({
            showClose: true,
            message: "请选择设备",
            type: "warning"
          });
          return;
        }
        param = [...this.multipleSelection];
      } else {
        param = data;
      }
      this.DeleteVehs.params = param;
      this.DeleteVehs.visible = true;
    },
    //处理设备成功时重新请求接口
    handleVehOk(type) {
      if (!this.group) return;
      this.doGetVehicleByOrganizationId(this.group);
      type === "transfer" && this.$refs.table.clearSelection();
    },
    //设备添加和修改
    async handleVeh(type, data) {
      console.log("类型和数据");
      console.log(type, data);
      this.HandleVeh.visible = true;
      this.HandleVeh.params = data ? { ...data } : null;
      await this.$sleep(10); //延迟渲染dialog
      this.HandleVeh.type = type;
    }
  }
};
</script>

<style lang="scss" scoped>
.vehManage {
  &__filterType {
    display: flex;
    margin-bottom: 16px;
  }
}
</style>
