<template>
  <div>
    <el-dialog
      :title=title
      width="900px"
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
    },
    title: {
        type: String
    }
  },
  watch:{
      data(val) {
          console.log(val);
      }
  },
  data() {
    return {
      list: [
        { title: "A/C系统致冷剂监控:", value: null },
        { title: "增压压力控制系统:", value: null },
        { title: "综合成分监控:", value: null },
        { title: "催化转化器监控:", value: null },
        { title: "冷启动辅助系统监控:", value: null },
        { title: "DPF监控:", value: null },
        { title: "EGR系统和VVT监控:", value: null },
        { title: "排气传感器加热器监控:", value: null },
        { title: "排气传感器监控:", value: null },
        { title: "蒸发系统监控:", value: null },
        { title: "燃油系统监控:", value: null },
        { title: "加热催化转化器监控:", value: null },
        { title: "失火监控:", value: null },
        { title: "NMHC氧化催化器监控:", value: null },
        { title: "二次空气系统监控:", value: null },
        { title: "选择性催化还原系统:", value: null }
      ]
    };
  },
  methods: {
    getData() {
      this.list[0].value = this.data[0].aCS;
      this.list[1].value = this.data[0].bPCS;
      this.list[2].value = this.data[0].cCMS;
      this.list[3].value = this.data[0].cMS;
      this.list[4].value = this.data[0].cSAS;
      this.list[5].value = this.data[0].dPF;
      this.list[6].value = this.data[0].eGRV;
      this.list[7].value = this.data[0].eGSHMS;
      this.list[8].value = this.data[0].eGSMS;
      this.list[9].value = this.data[0].eSMS;
      this.list[10].value = this.data[0].fSMS;
      this.list[11].value = this.data[0].hCMS;
      this.list[12].value = this.data[0].mMS;
      this.list[13].value = this.data[0].nMHC;
      this.list[14].value = this.data[0].sASMS;
      this.list[15].value = this.data[0].sCR;
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
    width: 150px;
    margin-right: 20px;
}
</style>
