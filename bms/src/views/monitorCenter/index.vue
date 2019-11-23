<template>
  <Drag
    class="monitorCenter"
    :min-width="300"
    defaultWidth="300px"
  >
    <LeftContent
      slot="left"
      :vehInfo.sync="vehInfo"
      :vehGroup.sync="vehGroup"
      :vehIndices.sync="vehIndices"
      :electricData.sync="electricData"
      :monitorInfo.sync="monitorInfo"
      @updateGroup="handleGroupData"
      @onZoomMarker="ZoomMarker()"
      class="monitorCenter__left"
    />
    <div
      class="monitorCenter"
      slot="right"
    >
      <div class="monitorCenter__content">
        <div class="monitorCenter__upside">
          <div class="monitorCenter__update-time">数据更新时间：2019-09-09 16：21</div>

          <!-- 电池信息开始 -->
          <el-row>
            <el-col :span="4">
              <div class="battery">
                <Battery />
                <div class="battery__item">
                  <span class="battery__label">工作状态</span>
                  <span class="battery__text battery__text_warning">放电</span>
                </div>

                <div class="battery__item">
                  <span class="battery__label">SOC电量计</span>
                  <span class="battery__text battery__text_primary">70%</span>
                </div>
              </div>
            </el-col>
            <el-col :span="20">
              <BatteryInfo :mydata="defmonitorInfo" />
            </el-col>
          </el-row>
          <!-- 电池信息结束 -->

          <!-- 电池图表开始 -->
          <el-row
            type="flex"
            class="monitorCenter__chart"
          >
            <el-col
              :span="5"
              class="chart-card"
            >
              <div class="chart-card__title">电池容量</div>
              <Chart
                class="chart-card__content"
                :option="capacityChartOption"
              />
            </el-col>
            <el-col
              :span="5"
              class="chart-card"
            >
              <div class="chart-card__title">充放电间隔</div>
              <Chart
                class="chart-card__content"
                :option="interValChartOption"
              />
            </el-col>
            <el-col
              :span="5"
              class="chart-card"
            >
              <div class="chart-card__title">电流统计</div>
              <Chart
                class="chart-card__content"
                :option="countChartOption"
              />
            </el-col>
            <el-col
              :span="9"
              class="chart-card"
            >
              <div class="chart-card__content">
                <div class="chart-card__gauge">
                  <Gauge :percentage.sync="mosTemp" />
                  <div class="chart-card__gauge-label">MOS温度</div>
                </div>
                <!-- <div class="chart-card__gauge">
                  <Gauge :percentage.sync="balanceTemp"/>
                  <div class="chart-card__gauge-label">均衡板温度</div>
                </div> -->
                <div class="chart-card__gauge">
                  <Gauge :percentage.sync="environmentTemp" />
                  <div class="chart-card__gauge-label">环境温度</div>
                </div>
              </div>
            </el-col>
          </el-row>
          <!-- 电池图表结束 -->
        </div>

        <div class="monitorCenter__underside">
          <div class="monitorCenter__underside-item">
            <BatteryFaultCount
              :data.sync="batteryCount"
              :list.sync="batteryList"
            />
          </div>

          <div class="monitorCenter__underside-item">
            <div
              class="monitorCenter__map"
              ref="map"
              :style="{top: isMapEnlarge ? 0 : '61%', left: isMapEnlarge ? 0 : 'calc(50% + 8px)'}"
            >
              <i
                @click="isMapEnlarge = !isMapEnlarge"
                class="monitorCenter__map-zoom iconfont"
                :class="isMapEnlarge ? 'icon-suoxiao' : 'icon-enlarge'"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </Drag>
</template>

<script>
import GPS from "@/assets/js/GPS";
import { getCarIcon } from "@/assets/js/base";
import Chart from "@/components/Chart/index.vue";
import Battery from "./Battery.vue";
import BatteryInfo from "./BatteryInfo.vue";
import Gauge from "./Gauge.vue";
import BatteryFaultCount from "./BatteryFaultCount.vue";
import Drag from "@/components/Drag/index.vue";
import LeftContent from "./LeftContent.vue";

export default {
  components: {
    Chart,
    Battery,
    BatteryInfo,
    Gauge,
    BatteryFaultCount,
    Drag,
    LeftContent
  },

  data() {
    return {
      mosTemp: 0,
      environmentTemp: 0,
      capacityChartOption: {},
      interValChartOption: {},
      countChartOption: {},
      map: null,
      isMapEnlarge: false, //地图是否放大

      infoWindow: {
        instance: null,
        visible: false
      }, //当前信息窗口
      markerMap: new Map(), //当前地图车辆
      vehGroup: { gids: new Set(), data: [] }, //当前车组车辆
      vehIndices: { value: new Map(), timestamp: 0 }, //当前已选车辆索引
      vehInfo: null, //当前车辆信息
      defelectricData: [
        { label: "00:00-08:00", value: 1.5 },
        { label: "08:00-16:00", value: 1 },
        { label: "16:00-24:00", value: 2 }
      ],
      defmonitorInfo: [
        { label: "电池设备号", value: "15246854", type: "info" },
        { label: "总电压", value: "66.99V", type: "info" },
        { label: "电池温超", value: "正常", type: "info" },
        { label: "过压保护", value: "正常", type: "info" },
        { label: "电池掉线", value: "否", type: "info" },
        { label: "充电总时间", value: "1H", type: "info" },
        { label: "版本号", value: "BSJ-ASD", type: "info" },
        { label: "最低电压", value: "3.898V", type: "info" },
        { label: "充电保护", value: "正常", type: "info" },
        { label: "欠压保护", value: "异常", type: "error" },
        { label: "均衡开闭", value: "开启", type: "info" },
        { label: "放电总时间", value: "否", type: "info" },
        { label: "电池数量", value: "20串", type: "info" },
        { label: "最高电压", value: "3.975V", type: "info" },
        { label: "放电保护", value: "正常", type: "info" },
        { label: "充电保护", value: "正常", type: "info" },
        { label: "温度数量", value: "3个", type: "info" },
        { label: "充电次数", value: "3次", type: "info" },
        { label: "剩余电容量", value: "0A", type: "info" },
        { label: "相差电压", value: "0.077V", type: "warning" },
        { label: "短路次数", value: "3次", type: "info" },
        { label: "放电保护", value: "正常", type: "info" },
        { label: "设计容量", value: "0AH", type: "info" },
        { label: "循环次数", value: "33次", type: "info" },
        { label: "出厂日期", value: "2019-03-09", type: "info" },
        { label: "均衡电压", value: "7.23V", type: "info" },
        { label: "设备编号", value: "3800939", type: "info" }
      ],
      defpile: [
        { label: "标称容量", value: 4 },
        { label: "当前容量", value: 3.5 },
        { label: "剩余容量", value: 1 }
      ],
      defChartData: [
        { label: "最大充电间隔", value: 4 },
        { label: "最大放电间隔", value: 3.5 }
      ],
      batteryCount: { normal: 0, error: 0 },
      batteryList: [],
      electricData: null,
      monitorInfo: null,
      vid: null, //当前车辆id
      vehsLimit: 100, //当前地图车辆限制, 超过100开启聚合
      cluster: {
        instance: null, //点聚合实例
        visible: true
      },
      refresh: {
        //轮询定时器
        timer: null,
        num: 0
      }
    };
  },
  watch: {
    //监听索引变化
    vehIndices() {
      //处理索引变化
      this.handleIndices();
      //重新刷新轮询
      this.handlePolingRefresh();
    },
    electricData(val) {
      this.defelectricData = [
        {
          label: val.value[0].devTime,
          value: val.value[0].pileElectric
        },
        {
          label: val.value[1].devTime,
          value: val.value[1].pileElectric
        },
        {
          label: val.value[2].devTime,
          value: val.value[2].pileElectric
        },
        {
          label: val.value[3].devTime,
          value: val.value[3].pileElectric
        }
      ];
      this.initCountChartOption();
    },
    monitorInfo(val) {
      this.mosTemp = val.mosTemp;
      this.environmentTemp = val.environmentTemp;
      this.batteryCount = {
        normal: val.commonNum || 0,
        error: val.errorNum || 0
      };
      this.defpile = [
        { label: "标称容量", value: val.designCharge },
        { label: "当前容量", value: val.pileCharge },
        { label: "剩余容量", value: val.pileCopacity }
      ];
      this.defChartData = [
        { label: "最大充电间隔", value: val.chargeInterval },
        { label: "最大放电间隔", value: val.disChargeInterval }
      ];
      this.defmonitorInfo = [
        { label: "电池设备号", value: val.bmsNo, type: "info" },
        { label: "总电压", value: val.pileVoltage, type: "info" },
        { label: "电池温超", value: "正常", type: "info" },
        {
          label: "过压保护",
          value: val.monomerOverVoltage === 1 ? "单体过压保护" : "无",
          type: "info"
        },
        { label: "电池掉线", value: "否", type: "info" },
        { label: "充电总时间", value: val.chargeSpaceTime, type: "info" },
        { label: "版本号", value: "BSJ-ASD", type: "info" },
        { label: "最低电压", value: val.minVoltage, type: "info" },
        { label: "充电保护", value: val.shortCircuitNum, type: "info" },
        {
          label: "欠压保护",
          value: val.voltageOverDischarge === 1 ? "总压过放保护" : "无",
          type: "error"
        },
        {
          label: "均衡开闭",
          value: val.balanceFlag === 0 ? "开启" : "关闭",
          type: "info"
        },
        { label: "放电总时间", value: val.dischargeSpaceTime, type: "info" },
        { label: "电池数量", value: val.batteryCount, type: "info" },
        { label: "最高电压", value: val.maxVoltage, type: "info" },
        {
          label: "放电保护",
          value: val.dischargeOver === 0 ? "无保护" : "有保护",
          type: "info"
        },
        {
          label: "充电保护",
          value: val.chargeOver === 0 ? "无保护" : "有保护",
          type: "info"
        },
        { label: "温度数量", value: val.TempNum, type: "info" },
        { label: "充电次数", value: val.chargeNum, type: "info" },
        { label: "剩余电容量", value: val.pileCopacity, type: "info" },
        { label: "相差电压", value: val.deltaVoltage, type: "warning" },
        { label: "短路次数", value: val.shortCircuitNum, type: "info" },
        { label: "放电保护", value: val.dischargeOver, type: "info" },
        { label: "设计容量", value: val.designCharge, type: "info" },
        { label: "循环次数", value: val.circulateNum, type: "info" },
        { label: "出厂日期", value: val.createTime, type: "info" },
        { label: "均衡电压", value: val.avgVoltage, type: "info" },
        { label: "设备编号", value: val.terminalNo, type: "info" }
      ];
      this.batteryList = val.mapList;
      this.initCapacityChart();
      this.initInterValChart();
    },
    async vehInfo(nowVal, curVal) {
      if (!nowVal) return;

      //map setCenter LngLat
      if (!curVal || nowVal.vehicleId !== curVal.vehicleId) {
        this.ZoomMarker();
      }
    }
  },
  async mounted() {
    await this.$sleep();
    this.initCapacityChart();
    this.initInterValChart();
    this.initCountChartOption();
    this.initMap();
  },

  methods: {
    //重新刷新轮询
    handlePolingRefresh() {
      if (this.vehIndices.value.size === 0) {
        clearInterval(this.refresh.timer);
        this.refresh = {
          timer: null,
          num: 0
        };
      } else {
        !this.refresh.timer && this.pollingRefresh();
      }
    },
    //轮询
    pollingRefresh() {
      clearInterval(this.refresh.timer);
      this.refresh.num = 100;
      this.refresh.timer = setInterval(async () => {
        this.refresh.num === 0 ? (this.refresh.num = 10) : this.refresh.num--;
        if (this.refresh.num === 0) {
          if (this.$route.path !== "/monitorCenter") return;
          //每10秒获取车组数据
          try {
            const gids = [...this.vehGroup.gids];
            const { data } = await this.$API.getVehicleState({
              organizationIds: gids.join(","),
              pagger: 1,
              total: 10,
              type: 0
            });
            console.log(data);
            this.handleGroupData(gids, data.vehicleMonitoringVos);
          } catch (error) {
            console.error(error);
            this.$msg({
              showClose: true,
              message: error.msg,
              type: "warning"
            });
          }
        }
      }, 1000);
      this.$off("hook:beforeDestroy");
      this.$once("hook:beforeDestroy", () => {
        clearInterval(this.refresh.timer);
      });
    },
    //处理车组数据排序 以及 更新索引内最新数据
    handleGroupData(gids, data) {
      //有多个车组时则需要排序
      if (gids.length > 1) {
        //建立车组点击顺序的映射
        const gidsMap = new Map(gids.map((gid, i) => [gid, i]));
        //按树状图点击先后顺序来排序
        data.sort(
          (a, b) =>
            gidsMap.get(b.organizationId) - gidsMap.get(a.organizationId)
        );
      }

      let vehIndices = new Map(this.vehIndices.value);
      data.map(item => {
        //更新当前车辆信息
        this.vehInfo &&
          this.vehInfo.vehicleId === item.vehicleId &&
          (this.vehInfo = Object.freeze(item));
        //更新索引内最新数据
        vehIndices.has(item.vehicleId) && vehIndices.set(item.vehicleId, item);
      });

      //更新已选车辆索引
      this.vehIndices = {
        value: vehIndices,
        timestamp: Date.now()
      };
      //更新车组数据
      this.vehGroup = {
        data: Object.freeze(data),
        gids: new Set(gids)
      };
    },
    //处理车辆索引变化
    async handleIndices() {
      if (this.$route.path !== "/monitorCenter") return;
      if (this.vehIndices.value.size === 0) {
        this.infoWindow = null;
        this.vehInfo = null;
        //清除点聚合
        this.cluster.instance && this.cluster.instance.clearMarkers();
        this.cluster.instance = null;
        //清除地图上所有点
        this.map && this.map.remove([...this.markerMap.values()]);
        this.markerMap = new Map();
        this.map && this.map.clearMap();
        return;
      }
      this.showVehGroup();
    },
    //多车模式
    async showVehGroup() {
      //清除点聚合
      if (!this.cluster.visible) {
        this.cluster.instance && this.cluster.instance.clearMarkers();
        this.cluster.instance = null;
      }

      let markerMap = this.markerMap;
      //删除索引内不存在的车辆
      [...markerMap.keys()].map(vid => {
        if (!this.vehIndices.value.has(vid)) {
          markerMap.get(vid).setMap(null);
          markerMap.delete(vid);
        }
      });
      //添加或删除车辆
      let renderNum = 0;
      let changeNum = 0;
      const vehs = [...this.vehIndices.value.values()];
      for (let i = 0; i < vehs.length; i++) {
        const nowVehInfo = { ...vehs[i] }; //复制防止内存泄露
        //如果markerMap内存有该车辆
        if (markerMap.has(nowVehInfo.vehicleId)) {
          console.log("run");
          const { lon, lat } = GPS.gcj_encrypt(nowVehInfo.Y, nowVehInfo.X);
          const marker = markerMap.get(nowVehInfo.vehicleId);
          const oldVehInfo = marker.getExtData(); //获取旧数据
          marker.setExtData(nowVehInfo); //设置最新数据

          //超过数量限制则代表开聚合，不setMap影响性能
          vehs.length > this.vehsLimit
            ? marker.setMap(null)
            : marker.setMap(this.map);

          if (
            nowVehInfo.lon !== oldVehInfo.lon ||
            nowVehInfo.lat !== oldVehInfo.lat
          ) {
            //位置改变时才设置车辆位置
            changeNum++;
            await batchSetPosition.bind(this)(
              marker,
              [lon, lat],
              changeNum,
              50,
              50
            );
          }

          if (nowVehInfo.state !== oldVehInfo.state) {
            //如果图片信息有变化则重新设置图片
            changeNum++;
            await batchSetContent.bind(this)(
              marker,
              nowVehInfo,
              changeNum,
              50,
              50
            );
          }
        } else {
          //如果markerMap内没存有该车辆
          renderNum++;
          await batchMarker.bind(this)(nowVehInfo, i, vehs, renderNum, 50, 50); //分批渲染
        }
      }

      //地图上车辆大于100辆自动开启聚合
      if (
        !this.cluster.visible &&
        this.vehIndices.value.size > this.vehsLimit
      ) {
        this.cluster.visible = true;
        this.$msg({
          showClose: true,
          message: `由于地图车辆超过${this.vehsLimit}辆, 开启聚合以优化性能`,
          type: "warning"
        });
      }
      //设置点聚合
      this.cluster.visible && this.toggleCluster();

      //分批设置marker Content
      function batchSetContent(marker, item, changeNum, num, ms) {
        //changeNum代表当前渲染到多少辆了， num代表每多少辆暂停会执行， ms代表暂停多少毫秒
        return new Promise(resolve => {
          marker.setContent(
            `<img style="width: 32px;height:35px;transform: rotate(${
              item.F
            }deg);" src="${getCarIcon(item)}" />`
          );

          if (changeNum % num === 0) {
            //每num辆则等ms再渲染
            setTimeout(() => {
              resolve();
            }, ms);
          } else {
            resolve();
          }
        });
      }
      //分批设置marker位置
      function batchSetPosition(marker, position, changeNum, num, ms) {
        //changeNum代表当前渲染到多少辆了， num代表每多少辆暂停会执行， ms代表暂停多少毫秒
        return new Promise(resolve => {
          marker.setPosition(new AMap.LngLat(...position));

          if (changeNum % num === 0) {
            //每num辆则等ms再渲染
            setTimeout(() => {
              resolve();
            }, ms);
          } else {
            resolve();
          }
        });
      }
      //分批渲染函数
      function batchMarker(item, index, vehs, renderNum, num, ms) {
        //renderNum代表当前渲染到多少辆了， num代表每多少辆暂停会执行， ms代表暂停多少毫秒
        return new Promise(resolve => {
          const { lon, lat } = GPS.gcj_encrypt(item.lat, item.lon);
          let marker = new AMap.Marker({
            map: vehs.length > this.vehsLimit ? null : this.map,
            position: [lon, lat], // 位置
            offset: new AMap.Pixel(-16, -17.5), // 设置图标偏移度
            content: `<img style="width: 32px;height:35px;transform: rotate(${
              item.F
            }deg);" src="${getCarIcon(item)}" />`,
            label: {
              content: `<div class="bsj-infowindow"><span>${item.plate}</span><span>${item.organizationName}</span></div>` //设置文本标注内容
            },
            extData: item
          });

          marker.on("click", () => {
            //更新车辆信息
            this.vehInfo = Object.freeze(item);
            item.vehicleId === this.vehInfo.vehicleId &&
              this.infoWindow.open(this.map);
          });

          this.markerMap.set(item.vehicleId, marker);

          if (renderNum % num === 0) {
            //每num辆则等ms再渲染
            setTimeout(() => {
              resolve();
            }, ms);
          } else {
            resolve();
          }
        });
      }
    },
    //移至当前车辆
    async ZoomMarker() {
      if (!this.$refs.InfoWindow) await this.$nextTick();
      const { lon, lat } = GPS.gcj_encrypt(this.vehInfo.lat, this.vehInfo.lon);
      this.infoWindow = new AMap.InfoWindow({
        offset: new AMap.Pixel(0, -20),
        isCustom: true,
        autoMove: false,
        content: this.$refs.InfoWindow.$el
      });

      this.infoWindow.open(this.map, [lon, lat]);
      this.map.setCenter([lon, lat]);
      this.map.panBy(0, 30);
    },
    //设置点聚合
    toggleCluster(flag) {
      if (flag) {
        if (
          this.cluster.visible &&
          this.vehIndices.value.size > this.vehsLimit
        ) {
          this.$msg({
            showClose: true,
            message: `地图车辆超过${this.vehsLimit}辆, 不能关闭`,
            type: "warning"
          });
          return;
        }
        this.cluster.visible = !this.cluster.visible;
        this.cluster.visible
          ? this.$msg({
              showClose: true,
              message: "聚合开启",
              type: "success"
            })
          : this.$msg({
              showClose: true,
              message: "聚合关闭",
              type: "success"
            });
      }

      if (this.cluster.visible) {
        if (this.cluster.instance) {
          this.cluster.instance.setMarkers([...this.markerMap.values()]);
        } else {
          this.markerMap.size > 0 &&
            (this.cluster.instance = new AMap.MarkerClusterer(
              this.map,
              [...this.markerMap.values()],
              { maxZoom: 17, gridSize: 80 }
            ));
        }
      } else {
        this.showVehGroup();
      }
    },
    ///////////////

    getLineChartOptions({ options, color, formatter }) {
      return {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          top: "10%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: options.map(item => item.label),
            axisLabel: {
              color: "rgba(51,51,51,1)"
            },
            axisLine: {
              lineStyle: {
                color: "rgba(223,223,223,1)"
              }
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            axisLabel: {
              color: "rgba(51,51,51,1)",
              formatter
            },
            axisLine: {
              lineStyle: {
                color: "rgba(223,223,223,1)"
              }
            },
            splitLine: {
              lineStyle: {
                color: "rgba(223,223,223,1)"
              }
            }
          }
        ],
        series: [
          {
            name: "Online quantity",
            type: "bar",
            data: options.map(item => item.value),
            itemStyle: {
              normal: { color }
            },
            barWidth: 10,
            barGap: "0%"
          }
        ]
      };
    },
    initCapacityChart() {
      const options = this.defpile;
      this.capacityChartOption = this.getLineChartOptions({
        options,
        color: "rgba(0,211,184,1)",
        formatter: "{value} Ah"
      });
    },
    initInterValChart() {
      const options = this.defChartData;

      this.interValChartOption = this.getLineChartOptions({
        options,
        color: "rgba(52,151,234,1)",
        formatter: "{value} 天"
      });
    },
    initCountChartOption() {
      var options = this.defelectricData;
      this.countChartOption = {
        xAxis: {
          type: "category",
          data: options.map(({ label }) => label),
          axisTick: {
            show: false
          },
          axisLabel: {
            color: "rgba(51,51,51,1)"
          },
          axisLine: {
            lineStyle: {
              color: "rgba(223,223,223,1)"
            }
          }
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross"
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          top: "10%",
          containLabel: true
        },
        yAxis: {
          type: "value",
          axisTick: {
            show: false
          },
          axisLabel: {
            color: "rgba(51,51,51,1)",
            formatter: "{value} A"
          },
          axisLine: {
            lineStyle: {
              color: "rgba(223,223,223,1)"
            }
          },
          splitLine: {
            lineStyle: {
              color: "rgba(223,223,223,1)"
            }
          }
        },
        textStyle: {
          fontSize: 10,
          color: "white"
        },
        series: [
          {
            data: options.map(({ value }) => value),
            type: "line",
            name: "电流(A)",
            itemStyle: {
              normal: {
                color: "#2BE3EA"
              }
            },
            lineStyle: {
              normal: {
                color: "rgba(52,151,234,1)"
              }
            },
            areaStyle: {
              color: "rgba(52,151,234,.3)"
            }
          }
        ]
      };
    },
    //延迟渲染地图
    initMap() {
      this.map = new AMap.Map(this.$refs.map, {
        center: [105, 37.5],
        zoom: document.body.clientWidth > 1600 ? 4 : 3
      });
    }
    // initMap() {
    //   this.map = new BSJMap.Map(this.$refs.map, {
    //     center: [105, 37.5],
    //     zoom: document.body.clientWidth > 1600 ? 4 : 3
    //   });
    // }
  }
};
</script>

<style lang="scss" scoped>
.monitorCenter {
  $gap: 16px;
  height: 100%;
  background: rgba(248, 248, 248, 1);
  display: flex;
  &__left {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  &__content {
    margin: $gap;
    display: flex;
    flex: 1;
    overflow: hidden;
    flex-direction: column;
    position: relative;
    overflow: hidden;
  }

  &__upside {
    padding: $gap;
    background: #fff;
    // flex: 1;
    display: flex;
    flex-direction: column;
  }

  &__chart {
    // flex: 1;
    overflow: hidden;
  }

  &__underside {
    margin-top: $gap;
    display: flex;
    height: 39%;
  }

  &__underside-item {
    flex: 1;
    overflow: hidden;
    background: #fff;

    & + & {
      margin-left: $gap;
    }
  }

  &__map {
    position: absolute;
    right: 0;
    bottom: 0;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    border-radius: 3px;
    transform: transition3d(0, 0, 0);
    transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  }

  &__map-zoom {
    position: absolute;
    top: 16px;
    right: 16px;
    width: 34px;
    height: 34px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    color: rgba(0, 211, 184, 1);
    user-select: none;
    z-index: 1;

    &:hover {
      opacity: 0.8;
    }
  }

  &__update-time {
    font-size: 12px;
    font-weight: 400;
    color: rgba(153, 153, 153, 1);
    line-height: 16px;
    padding: 0 16px 32px;
  }
}

.battery {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 32px;

  &__item {
    margin-top: 16px;

    & + & {
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

    &_primary {
      color: rgba(0, 211, 184, 1);
    }
  }
}

.chart-card {
  flex: 1;
  background: rgba(247, 247, 247, 1);
  display: flex;
  flex-direction: column;
  overflow: hidden;

  & + & {
    margin-left: 10px;
  }

  &__title {
    font-size: 14px;
    font-weight: bold;
    color: rgba(51, 51, 51, 1);
    padding: 16px;
  }

  &__content {
    flex: 1;
    display: flex;
    padding: 16px;
    overflow: hidden;
  }

  &__gauge {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 16px;
  }

  &__gauge-label {
    font-size: 14px;
    font-weight: bold;
    color: rgba(51, 51, 51, 1);
    margin-top: 5px;
  }
}
</style>
