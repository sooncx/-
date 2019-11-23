<template>
  <div class="main">
    <Nav />

    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import Nav from "@/components/Nav/index.vue";

export default {
  components: {
    Nav
  },
  mounted() {
    //获取GROUPLIST
    this.doShowOrganization();
    //获取用户列表
    this.doShowUserMessage();
  },
  methods: {
    ...mapMutations(["COMMIT_GROUPLIST", "COMMIT_USERLIST"]),
    //获取GROUPLIST
    async doShowOrganization() {
      try {
        const { data } = await this.$API.getOTree();
        if (Array.isArray(data)) {
          this.COMMIT_GROUPLIST(data);
        }else {
           this.COMMIT_GROUPLIST([data]); 
        }
      } catch (error) {
        console.log(error);
      }
    },
    //获取用户列表
    async doShowUserMessage() {
      try {
        const { data } = await this.$API.showUser();
        if (Array.isArray(data)) {
          this.COMMIT_USERLIST(data);
        }else {
          this.COMMIT_USERLIST([data]);
        }
      } catch (error) {
        console.error(error);
        this.$msg({
          showClose: true,
          message: error.msg,
          type: "error"
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.main {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
