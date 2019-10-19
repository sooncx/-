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
      storeTest1Data: "数据2",
    };
  },
  methods: {
    changeUserId() {
      this.$store.commit("setUserId", "321");
    },
    changePassWord() {
      this.$store.dispatch("actionPassWord", "789987");
    }
  }
};
</script>