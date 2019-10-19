<template>
  <div>
    <div>{{this.$store.getters.getUserId}}</div>
    <button @click="changeUserId">id</button>
    <div>{{this.$store.getters.getPassWord}}</div>
    <button @click="changePassWord">pass</button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      storeTest1Data: "数据1",
    };
  },
  methods: {
    changeUserId() {
      this.$store.commit("setUserId", "123");
    },
    changePassWord() {
      this.$store.dispatch("actionPassWord", "999999");
    }
  }
};
</script>