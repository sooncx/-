<template>
  <div>
    <el-dialog
      title="iupr明细"
      width="1000px"
      :visible.sync="visible"
      @close="$emit('update:visible', false)"
      @open="getData"
    >
      <div class="box1">
        <div
          class="box1-1"
          v-for="(item,index) in list"
          :key="index"
        >
          <div class="inputTitle">
            <span>{{item.title}}</span>
          </div>
          <el-input
            class="input"
            size="small"
            v-model=item.value
            placeholder=""
            :disabled="true"
          >
          </el-input>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array
    }
  },
  data() {
    return {
      list: [
        { title: "增压压力监测完成次数:", value: null },
        { title: "增压压力监测条件符合次数:", value: null },
        { title: "EGR 或 VVT 监视完成次数:", value: null },
        { title: "EGR 或 VVT 监视条件符合次数:", value: null },
        { title: "废气传感器监测完成次数:", value: null },
        { title: "燃料监测完成条件计数:", value: null },
        { title: "燃料监测符合条件计数:", value: null },
        { title: "点火循环计数器:", value: null },
        { title: "催化剂监视器完成计数:", value: null },
        { title: "催化器监测条件符合次数:", value: null },
        { title: "吸附器监测完成次数:", value: null },
        { title: "吸附器监测条件符合次数:", value: null },
        { title: "催化器监测条件符合次数:", value: null },
        { title: "催化器监测完成次数:", value: null },
        { title: "监测条件遇到计数:", value: null },
        { title: "捕集器监测完成次数:", value: null },
        { title: "捕集器监测条件符合次数:", value: null }
      ]
    };
  },
  watch:{

  },
  methods: {
    exportDetail() {
      this.$emit("exportDetail");
    },
    getData() {
      this.list[0].value = this.data[0].bpmccc;
      this.list[1].value = this.data[0].bpmcec;
      this.list[2].value = this.data[0].eavmccc;
      this.list[3].value = this.data[0].eavmcec;
      this.list[4].value = this.data[0].egsmcc;
      this.list[5].value = this.data[0].fmccc;
      this.list[6].value = this.data[0].fmcec;
      this.list[7].value = this.data[0].icc;
      this.list[8].value = this.data[0].ncmcc;
      this.list[9].value = this.data[0].ncmcec;
      this.list[10].value = this.data[0].nmccc;
      this.list[11].value = this.data[0].nmcec;
      this.list[12].value = this.data[0].nscmcec;
      this.list[13].value = this.data[0].nsmccc;
      this.list[14].value = this.data[0].omcec;
      this.list[15].value = this.data[0].pfmccc;
      this.list[16].value = this.data[0].pfmcec;
    }
  },
  components: {}
};
</script>
<style lang="scss" scoped>
/deep/ .el-input,
/deep/ .el-input--mini,
/deep/ .el-input__inner,
/deep/ .el-textarea {
  width: 180px;
  height: 32px;
  font-size: 12px;
  //   background-color: #fff !important;
  //   color: rgb(42, 42, 42) !important;
  * {
    border-radius: 1px !important;
  }
}
.box1 {
  width: 100%;
  padding-bottom: 20px;
}
.box1-1 {
  display: inline-block;
  margin: 13px 35px;
}

.inputTitle {
  width: 80px;
  height: 24px;
  display: inline-block;
  span {
    display: flex;
    align-content: flex-end;
    justify-content: flex-end;
  }
}
// .box1-1:nth-of-type(2) > .inputTitle,
// .box1-1:nth-of-type(4) > .inputTitle,
// .box1-1:nth-of-type(6) > .inputTitle,
// .box1-1:nth-of-type(8) > .inputTitle,
// .box1-1:nth-of-type(10) > .inputTitle,
// .box1-1:nth-of-type(12) > .inputTitle,
// .box1-1:nth-of-type(14) > .inputTitle,
// .box1-1:nth-of-type(16) > .inputTitle {
//   width: 200px;
// }
.inputTitle {
    width: 200px;
    margin-right: 30px;
    margin-left: -10px;
}
</style>
