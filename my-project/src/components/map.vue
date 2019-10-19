<template>
  <div class="main">
    <div class="el-map">
      <el-amap></el-amap>
    </div>
    <div id='container'></div>
    <div
      class="input-card"
      style="width: auto;"
    >
      <div class="input-item">
        <button
          class="btn"
          @click="toggle"
        >显示/隐藏实时路况</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      map: null,
      isVisible: true,
      trafficLayer: ""
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
        resizeEnable: true,
        center: [116.397428, 39.90923],
        zoom: 13
      });
      this.trafficLayer = new AMap.TileLayer.Traffic({
        zIndex: 10
      });
      this.map.add(this.trafficLayer); //添加图层到地图
    },
    toggle() {
      if (this.isVisible) {
        this.trafficLayer.hide();
        this.isVisible = false;
      } else {
        this.trafficLayer.show();
        this.isVisible = true;
      }
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