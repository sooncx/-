<template>
  <div>
    我是farther组件
    <slot>我是slot</slot>
  </div>
</template>

<script>
import child from "./child";
export default {
  data() {
    return {};
  },
  components: {
    child
  }
};
</script>
<style scoped>
</style>