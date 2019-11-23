<template>
  <div>
    <el-dialog
      :visible="visible"
      :title="title"
      @close="$emit('update:visible', false)"
      @closed="initState()"
      width="600px"
    >
      <el-form
        :model="model"
        ref="form"
        :rules="rules"
        label-width="90px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="用户名:"
              prop="username"
            >
              <el-input
                v-model="model.username"
                autocomplete="off"
                maxlength="10"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="密码:"
              prop="password"
              maxlength="12"
            >
              <el-input
                v-model="model.password"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="公司名称:"
              prop="company"
            >
              <el-input
                v-model="model.company"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="权限类型"
              prop="type"
            >
              <el-select
                v-model="model.type"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in userType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="type != 'update'">
          <el-col :span="12">
            <el-form-item
              label="所属组织:"
              prop="groups"
            >
              <GroupTree
                v-model="model.groups"
                :data="groupsTreeData"
                :props="groupProps"
                :show.sync="visible"
                node-key="organizationId"
                icon="icon-truckgroup"
                :disabled="false"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="所属上级:"
              prop="users"
            >
              <UserTree
                v-model="model.users"
                :data="userTreeData"
                :props="userProps"
                node-key="id"
                icon="icon-truckgroup"
                :disabled="false"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item
              label="备注信息:"
              prop="remark"
            >
              <el-input
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
                v-model="model.remark"
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
          @click="handleApiFn()"
        >确定</el-button>
      </template>
    </el-dialog>

    <!-- 绑定车组dialog开始 -->
    <BindGroupDialog
      ref="BindGroup"
      type="save"
      :visible.sync="BindGroup.visible"
      :params="BindGroup.params"
      @onSave="keys => checkedKeys = keys"
    />
    <!-- 绑定车组dialog结束 -->

    <!-- 添加组织dialog开始 -->
    <AddGroupDialog
      :visible.sync="AddGroup.visible"
      @onSubmit="gid => {checkedKeys = [gid];BindGroup.params = {checkedKeys: [gid]}}"
    />
    <!-- 添加组织dialog结束 -->
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import AddGroupDialog from "@/components/AddGroupDialog/index.vue";
import BindGroupDialog from "../BindGroupDialog/index.vue";
import GroupTree from "./GroupTree.vue";
import UserTree from "./UserTree.vue";

export default {
  components: {
    BindGroupDialog,
    AddGroupDialog,
    GroupTree,
    UserTree
  },

  props: {
    visible: {
      type: Boolean,
      default: false
    },
    params: {
      type: Object,
      default: undefined
    },
    /**
     * @param {add | modify} 参数名 type
     */
    type: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      model: {
        groups: null,
        users: null,
        company: "",
        id: "",
        password: "",
        remark: "",
        type: 1,
        username: ""
      },
      userType: [
        {
          value: 1,
          label: "管理员"
        },
        {
          value: 0,
          label: "监控员"
        }
      ],
      rules: {
        username: [
          {
            required: true,
            message: "用户名不能为空", //this.$t("login.username_rules"),
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "密码不能为空", //this.$t("login.password_rules"),
            trigger: "blur"
          }
        ],
        type: [
          {
            required: true,
            message: "用户类型不能为空", //this.$t("login.password_rules"),
            trigger: "blur"
          }
        ],
        users: [
          {
            required: true,
            message: "所属上级不能为空",
            trigger: "blur"
          },
          { type: "object", message: "所属上级不能为空" }
        ]
      },
      checkedKeys: [],
      //绑定车组dialog props
      BindGroup: {
        visible: false,
        params: null
      },
      //添加组织dialog props
      AddGroup: {
        visible: false
      },
      groupProps: {
        children: "children",
        label: "organizationName"
      },
      userProps: {
        children: "children",
        label: "username"
      }
    };
  },

  computed: {
    ...mapState(["GROUPLIST", "USERLIST"]),
    groupsTreeData() {
      return this.GrouptreeFormat(this.GROUPLIST);
    },
    userTreeData() {
      return this.UsertreeFormat(this.USERLIST);
    },
    title() {
      const titleObj = {
        update: "修改用户",
        add: "新增用户"
      };

      return titleObj[this.type]||"新增用户";
    }
  },

  watch: {
    params(val) {
      if (this.type === "update") {
        Object.keys(this.model).map(
          key => val[key] && (this.model[key] = val[key])
        );
        this.model.type = val.type;
      }else if (this.type === "addThis") {
          this.model.users = val;
      }else {
          this.model.users = null;
      }
    }
  },

  methods: {
    ...mapMutations(["COMMIT_USERLIST"]),
    initState() {
      this.$refs.form.resetFields();
      this.checkedKeys = [];
      this.$refs.BindGroup.initState();
    },
    GrouptreeFormat(data) {
      for (let item of data) {
        item.children = item.organizationsList;
        if (item.organizationsList && item.organizationsList.length > 0) {
          this.GrouptreeFormat(item.organizationsList);
        }
      }
      return data;
    },
    UsertreeFormat(data) {
      for (let item of data) {
        item.children = item.userList;
        if (item.userList && item.userList.length > 0) {
          this.UsertreeFormat(item.userList);
        }
      }
      return data;
    },
    async add() {
      const { groups, users, ...items } = this.model;
      const params = {
        parentId: users.id,
        organizationIds: groups,
        ...items
      };
      delete params.id;
      return await this.$API.addUser(params);
    },
    async addThis() {
      const { groups, users, ...items } = this.model;
      const params = {
        parentId: users.id,
        organizationIds: groups,
        ...items
      };
      delete params.id;
      return await this.$API.addUser(params);
    },
    async update() {
      const { company, id, password, remark, type, username } = this.model;
      const params = {
        company,
        id,
        password,
        remark,
        type,
        username
      };
      return await this.$API.updateUser(params);
    },
    async handleApiFn() {
      try {
        await this.$refs.form.validate();
        const { msg } = await this[this.type]();
        //更新用户列表
        const { data } = await this.$API.showUser();
        if (Array.isArray(data)) {
          this.COMMIT_USERLIST(data);
        } else {
          this.COMMIT_USERLIST([data]);
        }
        this.$msg({
          showClose: true,
          message: msg,
          type: "success"
        });
        this.$emit("update:visible", false);
        this.$emit("handleOk");
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
</style>
