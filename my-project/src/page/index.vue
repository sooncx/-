<template>
  <div>
    {{data}}
    <test1></test1>
    <test2></test2>
  </div>
</template>
<script>
import test1 from "../components/test1";
import test2 from "../components/test2";
export default {
  data() {
    return {
      data: "test"
    };
  },
  components: {
    test1,
    test2
  }
};
</script>
<style scoped></style>
