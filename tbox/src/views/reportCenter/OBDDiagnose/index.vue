<template>
  <ManageBox class="vehTypeManage">
    <template slot="upside">
      <el-form
        ref="form"
        :model="form"
        label-width="80px"
      >
        <el-form-item>
          <el-col :span="11">
            <el-date-picker
              size="small"
              type="date"
              placeholder="开始日期"
              v-model="form.beginTime"
              style="width: 100%;"
            ></el-date-picker>
          </el-col>
          <el-col
            class="line"
            :span="1"
          >-</el-col>
          <el-col :span="11">
            <el-date-picker
              size="small"
              type="date"
              placeholder="结束日期"
              v-model="form.endTime"
              style="width: 100%;"
            ></el-date-picker>
          </el-col>
        </el-form-item>
      </el-form>
      <SelectInput
        v-model="searchValue"
        style="margin: 20px"
        :showGroup="false"
      />
      <el-button
        style="margin-left: 32px"
        size="small"
        type="primary"
        @click="getOBDReport()"
      >查询</el-button>
      <el-button
        style="margin-left: auto"
        size="small"
        @click="exportOBDReport()"
      >导出</el-button>
    </template>

    <div
      class="vehTypeManage__content"
      slot="content"
    >
      <!-- 表格开始 -->
      <!-- :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" -->
      <el-table
        height="100%"
        max-height="100%"
        :data="tableData"
        border
        style="min-width: 100%"
        row-key="vehicleId"
      >
        <el-table-column
          fixed
          prop="index"
          label="序号"
          width="50"
          align="center"
        />
        <el-table-column
          prop="calibrate"
          label="软件标定识别码"
          min-width="150"
          align="center"
        />
        <el-table-column
          prop="cvn"
          label="标定验证码"
          min-width="100"
          align="center"
        />
        <el-table-column
          prop="devTime"
          label="设备时间"
          min-width="100"
          align="center"
        />
        <el-table-column
          prop="diagnostic"
          label="诊断协议表示"
          align="center"
          min-width="150"
        />
        <el-table-column
          prop="faultNum"
          label="故障码总数"
          align="center"
          min-width="120"
        />
        <el-table-column
          label="故障明细"
          align="center"
          width="80"
          style="position:relative"
        >
          <template slot-scope="scope">
            <el-popover
              placement="left-start"
              width="0"
              trigger="click"
            >
              <div class="checkResultBox">
                故障详情：
                <div
                  v-for="(item,index) in scope.row.faultArr"
                  :key="index"
                >
                  <span class="faultMsg">{{item}}</span>
                </div>
              </div>
              <div slot="reference">
                <el-button
                  type="text"
                  size="small"
                >查看</el-button>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          prop="mil"
          label="MIL"
          align="center"
          min-width="100"
        />
        <!-- <el-table-column
          prop="status"
          label="支持(SUP)——就绪状态(REA)"
          align="center"
          min-width="300"
        /> -->

        <el-table-column
          label="支持(SUP)——就绪状态(REA)"
          width="300"
          align="center"
        >
          <template slot-scope="{row}">
            <el-button
              type="text"
              size="small"
              @click="statusShow('SUP', [row.status.SUP])"
            >SUP</el-button>
            <el-button
              type="text"
              size="small"
              @click="statusShow('REA', [row.status.REA])"
            >REA</el-button>
          </template>
        </el-table-column>

        <el-table-column
          prop="vin"
          label="VIN"
          align="center"
          min-width="100"
        />
        <el-table-column
          label="iupr明细"
          width="200"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="check([scope.row.iupr])"
            >查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 表格结束 -->

      <!-- 分页开始 -->
      <el-pagination
        :current-page.sync="currentPage"
        :page-size.sync="pageSize"
        :page-sizes="[20, 50, 100]"
        @size-change="getOBDReport"
        @current-change="getOBDReport"
        layout="total, prev, pager, next"
        :total="total"
      />
      <!-- 分页结束 -->
    </div>
    <div slot="plugins">
      <DetailDialog
        :visible.sync="dialogVisible"
        :data="iuprData"
      />

      <StatusDetailDialog
        :visible.sync="statusVisible"
        :data="statusData"
        :title="statusTitle"
      />
    </div>
    <!-- <div
      class="vehTypeManage__footer"
      slot="footer"
    >
      <div>
        <BarChar></BarChar>  
      </div>
    </div> -->
  </ManageBox>

</template>

<script>
import day from "dayjs";
import ManageBox from "@/components/ManageBox/index.vue";
import SelectInput from "@/components/SelectInput/index.vue";
import DetailDialog from "@/components/OBDDiagnoseDialog/index.vue";
import StatusDetailDialog from "../../../components/OBDStatusDetailDialog/index.vue";

export default {
  components: {
    ManageBox,
    SelectInput,
    DetailDialog,
    StatusDetailDialog
  },
  data() {
    return {
      iuprData: null,
      statusData: null,
      statusTitle: "status",
      dialogVisible: false,
      statusVisible: false,
      testdata: [
        {
          calibrate: "测试内容xfc7",
          cvn: "测试内容1cq5",
          devTime: "测试内容3t0g",
          diagnostic: 0,
          faultArr: ["string1", "string2", "string3", "string4", "string5"],
          faultNum: 88708,
          iupr: {
            bpmccc: 67061,
            bpmcec: 86606,
            eavmccc: 73306,
            eavmcec: 37821,
            egsmcc: 67335,
            fmccc: 40878,
            fmcec: 65805,
            icc: 42434,
            ncmcc: 54403,
            ncmcec: 28463,
            nmccc: 31645,
            nmcec: 48588,
            nscmcec: 80614,
            nsmccc: 18123,
            omcec: 52347,
            pfmccc: 66272,
            pfmcec: 27578
          },
          mil: -1,
          status: {
            SUP: {
              aCS: 1,
              bPCS: 1,
              cCMS: 1,
              cMS: 1,
              cSAS: 1,
              dPF: 1,
              eGRV: 1,
              eGSHMS: 0,
              eGSMS: 1,
              eSMS: 1,
              fSMS: 1,
              hCMS: 1,
              mMS: 1,
              nMHC: 1,
              sASMS: 1,
              sCR: 1
            },
            REA: {
              aCS: 1,
              bPCS: 1,
              cCMS: 1,
              cMS: 1,
              cSAS: 1,
              dPF: 1,
              eGRV: 1,
              eGSHMS:10,
              eGSMS: 31,
              eSMS: 11231,
              fSMS: 112,
              hCMS: 121,
              mMS: 1231,
              nMHC: 13,
              sASMS: 131,
              sCR: 100
            }
          },
          vin: "测试内容l1u0"
        }
      ],
      dialogData: null,
      form: {
        beginTime: day(new Date()).subtract(7, "day"),
        endTime: new Date(),
        dayBeginTime: day(new Date()).subtract(7, "day")
      },
      place: null,
      searchValue: null,
      value: "",
      model: "", //当前查询型号
      currentPage: 1,
      pageSize: 100,
      tableData: [],
      getParams: {},
      total: 0
    };
  },
  mounted() {},

  methods: {
    check(data) {
      this.dialogVisible = true;
      this.iuprData = data;
    },
    statusShow(title,data) {
        this.statusVisible = true;
        this.statusData = data;
        this.statusTitle = title;
    },
    //导出OBD历史报表
    async exportOBDReport() {
      if (!this.tableData.length) {
        this.$msg({
          showClose: true,
          message: "无可导出的数据",
          type: "warning"
        });
        return;
      }
      try {
        this.$API.exportOBDReport(this.getParams);
      } catch (error) {
        console.error(error);
        this.$msg({
          showClose: true,
          message: error.msg,
          type: "error"
        });
      }
    },
    //获取OBD报表数据
    async getOBDReport() {
      if (this.searchValue === null) {
        // this.$msg({
        //   message: "输入框不可为空！",
        //   type: "error"
        // });
      } else {
        let params = {
          startTime: day(this.form.beginTime || this.form.dayBeginTime).format(
            "YYYY-MM-DD 00:00:00:0"
          ),
          endTime: day(this.form.endTime || new Date()).format(
            "YYYY-MM-DD 23:59:59:999"
          ),
          pageNumber: this.currentPage,
          pageSize: this.pageSize,
          vehicleId: this.searchValue ? this.searchValue.vehicleId : 0
        };
        this.getParams = params;
        try {
            const { data, total } = await this.$API.getDiagnosticReport(params);
            this.total = total;
          this.tableData = data.map((item, index) => ({
            ...item,
            index: (this.currentPage - 1) * this.pageSize + index + 1,
            mil:
              item.mil === 0
                ? "未点亮"
                : item.mil === 1
                ? "点亮"
                : item.mil === -1
                ? "无效"
                : "暂无数据!",
            diagnostic:
              item.diagnostic === 0
                ? "IOS15765"
                : item.diagnostic === 1
                ? "IOS27145"
                : item.diagnostic === 2
                ? "SAEJ1939"
                : item.diagnostic === -1
                ? "无效"
                : "暂无数据!"
          }));
        } catch (error) {
          console.error(error);
          this.$msg({
            showClose: true,
            message: error.msg,
            type: "error"
          });
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/ .el-pagination {
  padding-top: 20px;
}
.vehTypeManage {
  &__content {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    background: #fff;
    padding: 16px;
  }
  &__footer {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    background: #fff;
    padding: 16px;
  }
}
// /deep/.el-input {
//   width: 100px !important;
//   margin-left: 20px !important;
// }
span {
  color: rgb(179, 179, 179);
  margin: 10px;
}
/deep/ .el-form-item {
  margin-bottom: 2px;
}
/deep/ .el-form-item__content {
  margin-left: 0 !important;
  width: 300px;
}
/deep/ .el-col-1 {
  margin-left: 2%;
}
.faultMsg {
    display: block;
    padding-top: 5px;
}
</style>
