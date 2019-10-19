<template>
  <div @click="getNewNum(3)">
    {{this.$store.state.footerStatus.changableNum}}
    {{isShow}}
    {{arr}}
    <!-- <test3></test3> -->
  </div>
</template>
<script>
import { mapState, mapGetters, mapActions } from "vuex";
import test3 from "./test3";
export default {
  data() {
    return {
      data: "test2",
      arr: {}
    };
  },
  mounted() {
    let bar = { a: 1, b: 2 };
    // this.arr = Object.assign({ c: 3, d: 4 }, bar);
    this.arr = { ...bar, c: 3, d: 4 };
  },
  methods: {
    ...mapActions("footerStatus", [
      //footerStatus是指modules文件夹下的footerStatus.js
      "getNewNum" //footerStatus.js文件中的actions里的方法，在上面的@click中执行并传入实参
    ])
    // add() {
    //   this.$store.dispatch("footerStatus/getNewNum", 1);
    // }
  },
  computed: {
    // ...mapState({
    //   //这里的...是超引用，ES6的语法，意思是state里有多少属性值我可以在这里放多少属性值
    //   isShow: state => state.footerStatus.showFooter //注意这些与上面的区别就是state.footerStatus,
    //   //里面定义的showFooter是指footerStatus.js里state的showFooter
    // })
    //你也可以用下面的mapGetters来获取isShow的值，貌似下面的更简洁
    ...mapGetters("footerStatus", {
      //footerStatus指的是modules文件夹下的footerStatus.js模块
      isShow: "isShow" //第一个isShow是我自定义的只要对应template里v-if="isShow"就行，
      //第二个isShow是对应的footerStatus.js里的getters里的isShow
    }),
    ...mapActions("footerStatus", {})
  },
  components: {
    test3
  }
};
</script>
<style scoped></style>
