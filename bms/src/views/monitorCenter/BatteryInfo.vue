<script>
export default {
  functional: true,
  props: {
    mydata: {
      type: Array,
      require: true
    }
  },
  render(h, { props }) {
    const  {mydata}  = props;
    console.log("datatata")
    console.log(mydata)
    const options = mydata;

    const items = options.map((item, index) => (
      <el-col class="BatteryInfo__item" key={index} span={4}>
        <span class="BatteryInfo__label">{item.label}</span>
        <span class={`BatteryInfo__text BatteryInfo__text_${item.type}`}>
          {item.value}
        </span>
      </el-col>
    ));

    return <el-row class="BatteryInfo">{items}</el-row>;
  }
};
</script>

<style lang="scss" scoped>
.BatteryInfo {
  &__item {
    &:nth-child(6) ~ & {
      margin-top: 10px;
    }
  }

  &__label {
    font-size: 13px;
    font-weight: 400;
    color: rgba(153, 153, 153, 1);
    line-height: 16px;
    margin-right: 5px;

    &::after {
      content: ":";
    }
  }

  &__text {
    font-size: 13px;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    line-height: 16px;

    &_warning {
      color: rgba(244, 118, 26, 1);
    }

    &_error {
      color: rgba(211, 21, 21, 1);
    }
  }
}
</style>
