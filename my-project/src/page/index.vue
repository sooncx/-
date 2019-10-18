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
    <child1></child1>
    <child2></child2>
    <button @click="tomap">地图</button>
  </div>
</template>
<script>
import test1 from "../components/test1";
import test2 from "../components/test2";
import farther from "../components/farther";
import child from "../components/child";
import child1 from "../components/child1"
import child2 from "../components/child2"
export default {
  data() {
    return {
      data: "test"
    };
  },
  methods: {
    tomap() {
       this.$router.push('/map')
    }
  },
  components: {
    test1,
    test2,
    farther,
    child,
    child1,
    child2
  }
};
</script>
<style scoped></style>
