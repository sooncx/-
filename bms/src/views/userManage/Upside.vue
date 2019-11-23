<template>
  <div class="Upside">
    <div class="Upside__item">
      <i class="Upside__icon iconfont icon-member" />
      登录账户:
      <span class="Upside__text">{{USER && USER.username}}</span>
    </div>
     <el-button
        type="primary"
        size="mini"
        style="margin-left: auto"
        @click="$emit('onHandleUser', 'add', {parentId: USER.userId, userRights: 123, stateType: 0})"
      >新建</el-button>
      <el-button
        size="mini"
        @click="$emit('onExportFile')"
      >导出</el-button>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {

    };
  },

  computed: {
    ...mapState(["USER"])
  },

  mounted() {

  },

  methods: {
  
  }
};
</script>

<style lang="scss" scoped>
.Upside {
  width: 100%;
  display: flex;
  align-items: center;

  &__item {
    color: #666;
    display: inline-flex;
    align-items: center;
    margin-left: 16px;

    & + & {
      margin-left: 50px;
    }
  }

  &__text {
    color: #333;
  }

  &__icon {
    color: #d7d7d7;
    margin-right: 5px;
  }
}
</style>
