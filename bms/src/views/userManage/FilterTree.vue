<template>
  <div class="filter-tree">
    <el-input
      placeholder="输入关键字进行过滤"
      v-model="filterText"
      size="small"
      suffix-icon="el-icon-search"
    />

    <div class="filter-tree__content">
      <el-tree
        ref="tree"
        :data="treeData"
        :props="defaultProps"
        @node-click="handleNodeClick"
        :expand-on-click-node="false"
        node-key="userId"
        :filter-node-method="filterNode"
        :highlight-current="true"
        :default-expanded-keys="USER ? [USER.userId] : []"
      >
        <span
          class="filter-tree__node"
          slot-scope="{ node, data }"
        >
          <i class="filter-tree__tree-icon iconfont icon-UserManagement" />
          <span>{{ data.username }}</span>
          <span class="filter-tree__total">({{ data.sum }})</span>
          <span
            class="filter-tree__icon-box"
            v-if="USER && USER.userId !== data.id"
          >
            <i
              class="filter-tree__icon iconfont"
              v-for="item in iconList"
              :key="item.value"
              :class="item.icon"
              :title="item.title"
              @click.stop="handleUserClick(item.value, data)"
            />
          </span>
        </span>
      </el-tree>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
// import { toTreeData } from "@/assets/js/base";

export default {
  props: {
    value: {
      type: Array,
      required: true
    }
  },

  data() {
    return {
      filterText: "",
      defaultProps: {
        children: "children",
        label: "username"
      },
      iconList: [
        { icon: "icon-Caraddinggroup", title: "添加用户", value: "onAddUser" },
        {
          icon: "icon-Deletetrainset",
          title: "删除用户",
          value: "onDeleteUser"
        },
        { icon: "icon-modify-", title: "修改用户", value: "update" }
      ]
    };
  },

  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },

  computed: {
    ...mapState(["USER", "USERLIST"]),
    treeData() {
      return this.treeFormat(this.USERLIST);
    }
  },

  methods: {
    //转换成标准树形数据
    treeFormat(data) {
      for (let item of data) {
        item.children = item.userList;
        if (item.userList && item.userList.length > 0) {
          this.treeFormat(item.userList);
        }
      }
      return data;
    },
    filterNode(value, data) {
      if (!value) return true;
      return (
        data.username.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) !==
        -1
      );
    },
    handleUserClick(type, data) {
      switch (type) {
        case "onAddUser":
          this.$emit("onHandleUser", "addThis", data);
          break;
        case "onDeleteUser":
          this.$emit("onDeleteUser", { data: [data] });
          break;
        case "update":
          this.$emit("onHandleUser", "update", {
            ...data
          });
          break;
      }
    },
    handleNodeClick(data, node) {
      this.$emit("input", getUserIds(node));
      console.log("参数");
      console.log(node);
      function getUserIds(node) {
        let ids = [node.data.id];
        runChildNodes(node);
        return ids;

        function runChildNodes(node) {
          if (node.childNodes) {
            node.childNodes.map(item => {
              ids.push(item.data.id);
              runChildNodes(item);
            });
          }
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.filter-tree {
  flex: 1;
  display: flex;
  flex-direction: column;

  &__content {
    margin-top: 16px;
    flex: 1;
    overflow-y: auto;
    @include scrollBar;
  }

  &__node {
    display: flex;
    align-items: center;
  }

  &__tree-icon {
    margin-right: 5px;
    font-size: 14px;
    color: #18c18b;
  }

  &__icon-box {
    display: none;
  }

  &__icon {
    margin-left: 10px;
    color: #cfcfcf;
    font-size: 14px;

    & + & {
      margin-left: 5px;
    }

    &:hover {
      color: #18c18b;
    }
  }
}

.el-tree-node__content {
  &:hover {
    .filter-tree__icon-box {
      display: block;
    }
  }
}
</style>
