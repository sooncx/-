<template>
  <div>
    <div @click="sent">我是child2，点我传值
      <input
        @click="sent"
        type="text"
        v-model="mes"
      >
    </div>
  </div>
</template>
<script>
import empty from "../util/empty";
export default {
  data() {
    return {
      mes: "child2的值"
    };
  },
  methods: {
    sent() {
      empty.$emit("sent", this.mes);
    }
  },
  mounted() {
    empty.$emit("sent", this.mes);
  }
};
</script>