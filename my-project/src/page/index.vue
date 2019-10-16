<template>
  <div>
    <!-- {{data}}
    <test1></test1>
    <test2></test2> -->
    <farther>
    </farther>
    <div>-----------</div>
    <farther>
      <child>
        <template slot-scope="props">
          <div>
            {{props.childData}}
          </div>
        </template>
      </child>
    </farther>
  </div>
</template>
<script>
import test1 from "../components/test1";
import test2 from "../components/test2";
import farther from "../components/farther";
import child from "../components/child";
export default {
  data() {
    return {
      data: "test"
    };
  },
  components: {
    test1,
    test2,
    farther,
    child
  }
};
</script>
<style scoped></style>
