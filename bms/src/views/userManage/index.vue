<template>
  <ManageBox>
    <FilterTree
      slot="left"
      v-model="userIds"
      @onDeleteUser="handleOnDeleteUser"
      @onHandleUser="handleUser"
    />

    <template slot="right">
      <div class="vehManage__filterType">
        <el-button
          size="small"
          type="primary"
          @click="handleUser('add')"
        >新建</el-button>
        <el-button
          size="small"
          type="primary"
          @click="handleOnDeleteUser({type: 'select'})"
        >删除</el-button>
        <el-button
          style="margin-left: auto"
          size="small"
          icon="el-icon-download"
          @click="handleOnExportFile()"
        >导出</el-button>
      </div>
      <!-- 表格开始 -->
      <el-table
        :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
        style="width: 100%"
        height="100%"
        ref="table"
        border
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
          prop="username"
          label="登录账户"
          align="center"
          width="150"
        />
        <el-table-column
          prop="password"
          label="密码"
          align="center"
        />
        <el-table-column
          prop="emailAddress"
          label="客户名称"
          align="center"
          width="200"
        />
        <el-table-column
          prop="type"
          label="账户类型"
          align="center"
        />
        <el-table-column
          prop="createTime"
          label="创建时间"
          align="center"
        />
        <el-table-column
          prop="remark"
          label="备注"
          align="center"
        />
        <!-- <el-table-column
          prop="stateType"
          label="使用状态"
          align="center"
        >
          <el-button
            slot-scope="{row}"
            class="stateTypeBtn"
            :class="{stateTypeBtn_warning: row.stateType === 1}"
            type="text"
            size="small"
            @click="handleStateType(row)"
          >
            {{["使用", "禁止"][row.stateType]}}
          </el-button>
        </el-table-column> -->
        <el-table-column
          label="操作"
          width="200"
          fixed="right"
          align="center"
        >
          <template slot-scope="{row}">
            <el-button
              type="text"
              size="small"
              @click="handleUser('update', row)"
            >修改</el-button>
            <el-button
              type="text"
              size="small"
              @click="handleOnDeleteUser({data:[row]})"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 表格结束 -->

      <!-- 分页开始 -->
      <el-pagination
        :current-page.sync="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next"
        :total="tableData.length"
      />
      <!-- 分页结束 -->
    </template>

    <LazyRender slot="plugins">
      <!-- 删除用户 -->
      <DeleteUsersDialog
        :visible.sync="DeleteUser.visible"
        :params="DeleteUser.params"
        @handleDelOk="handleOk"
      />
      <!-- 添加用户 -->
      <HandleUserDialog
        :visible.sync="HandleUser.visible"
        :type="HandleUser.type"
        :params="HandleUser.params"
        @handleOk="handleOk"
      />
    </LazyRender>
  </ManageBox>
</template>

<script>
import { mapState } from "vuex";
import ManageBox from "@/components/ManageBox/index.vue";
import LazyRender from "@/components/LazyRender/index.vue";
import FilterTree from "./FilterTree.vue";
import DeleteUsersDialog from "@/components/DeleteUsersDialog/index.vue";
import HandleUserDialog from "@/components/HandleUserDialog/index.vue";

export default {
  name: "userManage",
  components: {
    ManageBox,
    LazyRender,
    FilterTree,
    DeleteUsersDialog,
    HandleUserDialog
  },
  props: {},
  data() {
    return {
      multipleSelection: [],
      currentPage: 1,
      pageSize: 100,
      userList: [],
      userIds: [], //当前用户以及其子级用户ids
      //处理用户dialog props
      HandleUser: {
        visible: false,
        params: null,
        type: "" //add modify disabled
      },
      //删除用户dialog props
      DeleteUser: {
        visible: false,
        params: null
      },
      //绑定车组dialog props
      BindGroup: {
        visible: false,
        params: null
      }
    };
  },

  computed: {
    ...mapState(["USER", "USERLIST"]),
    tableData() {
      const { userIds, USERLIST, USER } = this;
      if (!USER) return [];
      if (!this.treeConvertList(USERLIST).length) return [];
      let tableData;
      if (userIds.length) {
        const userListMap = new Map(
          this.treeConvertList(USERLIST).map(item => [item.id, item])
        ); //当前用户id 与 用户 的映射
        tableData = userIds.map(userId => userListMap.get(userId)); //从映射中拿到值
      } else {
        tableData = [...this.treeConvertList(USERLIST)];
      }
      console.log("USER");
      console.log(this.userIds[0]);
      tableData[0].id === USER.userId && tableData.shift();
      return tableData; //过滤掉当前用户
    }
  },

  methods: {
    //将树形图转扁平数据
    treeConvertList(root) {
      const list = [];
      if (root) {
        const queue = JSON.parse(JSON.stringify(root));
        while (queue.length) {
          const node = queue.shift();
          if (node.userList && node.userList.length) {
            queue.push(...node.userList);
          }
          delete node.userList;
          if (node.parentId !== null && node.parentId !== undefined) {
            list.push(node);
          }
        }
      }
      return list;
    },
    handleOk() {
      this.tableData;
    },
    //导出用户
    handleOnExportFile() {
      // if (!this.tableData.length) {
      //   this.$msg({
      //     showClose: true,
      //     message: "无可导出的设备",
      //     type: "warning"
      //   });
      //   return;
      // }
      const params = {
        userId: this.userIds.length ? this.userIds[0] : this.USER.userId
      };
      this.$API.doWriteExcelUser(params);
    },
    handleOnDeleteUser({ type, data } = {}) {
      let param;
      console.log(this.multipleSelection);
      if (type !== undefined && type === "select") {
        if (!this.multipleSelection.length) {
          this.$msg({
            showClose: true,
            message: "请选择用户",
            type: "warning"
          });
          return;
        }
        param = [...this.multipleSelection];
      } else {
        param = data;
      }
      console.log("删除");
      console.log(param);
      this.DeleteUser.params = param;
      this.DeleteUser.visible = true;
    },
    /**
     * @param {add | modify} 参数名 type
     */
    handleUser(type, data) {
      console.log(type, data);
      this.HandleUser.type = type;
      this.HandleUser.params = data ? { ...data } : null;
      this.HandleUser.visible = true;
    }
  }
};
</script>
<style lang="scss" scoped>
.stateTypeBtn {
  &_warning {
    color: rgba(#f44, 0.8);

    &:focus,
    &:hover {
      color: #f44;
    }
  }
}
.vehManage {
  &__filterType {
    display: flex;
    margin-bottom: 16px;
  }
}
</style>
