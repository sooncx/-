<template>
  <div class="main">
    <div class="el-map">
      <el-amap></el-amap>
    </div>
    <div id='container'></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      map: null
    };
  },
  mounted() {
    if (window["AMap"]) {
      this.init();
    } else {
      this.$root.$on("onAmapApiLoaded", () => {
        this.init();
      });
    }
  },

  methods: {
    init() {
      //////////////////////////////初始化地图
      this.map = new AMap.Map("container", {
        center: [116.397428, 39.90923],
        resizeEnable: true,
        zoom: 15
      });
    }
  }
};
</script>
<style lang="">
.main {
  width: 100%;
  display: flex;
  flex-direction: column;
}
.el-map,
#container {
  width: 50%;
  height: 300px;
  margin-bottom: 100px;
}

</style>