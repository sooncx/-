<template>
  <div>
    <input
      type="text"
      v-model="pas"
    >
    <button @click="passwordFormat">test</button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      reg: "test3",
      pas: null
    };
  },
  methods: {
    test() {
      // console.log(/^[a-zA-Z]+[0-9a-zA-Z]*$/.test("aa213"));
      // console.log("aa  13a".match(/^[a-zA-Z]+.*[0-9a-zA-Z]*$/));
    },
    //密码验证
    passwordFormat() {
      // console.log("pas:" + /^[a-zA-Z][0-9a-zA-Z]+$/.test("aawe3245"));
      // console.log("aawe2345QD1ES1".match(/^[a-zA-Z][0-9a-zA-Z]{7}/g));
      if (/^[a-zA-Z][0-9a-zA-Z]{7}$/.test(this.pas)) {
        console.log("ok");
      } else {
        console.log("error");
      }
    }
  },
  mounted() {}
};
</script>