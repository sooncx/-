<template>
  <div>
    <div>我是child1,这是chlid2传过来的值：{{mes}}</div>
  </div>
</template>
<script>
import empty from "../util/empty";
export default {
  data() {
    return {
      mes: ""
    };
  },
  methods: {},
  mounted() {
    empty.$on("sent", val => {
      this.mes = val;
    });
  }
};
</script>