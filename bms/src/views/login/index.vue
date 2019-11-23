<template>
  <div class="login">
    <div class="login__bg">
      <div class="box"></div>
    </div>
    <el-row
      type="flex"
      justify="center"
    >
      <el-col
        :span="12"
        class="login__form__box"
      >
        <div class="login__form__left">
          <div class="login__form__left__top">
            <!-- <p class="title">Hello !</p> -->
            <p class="title2">
              <span class>Welcome to login</span>
            </p>
          </div>
          <el-form
            class="login__form__left__main"
            :model="loginForm"
            :rules="rules"
            ref="loginForm"
          >
            <el-form-item prop="username">
              <el-input
                type="input"
                v-model="loginForm.username"
                autocomplete="off"
                placeholder="Please input an account"
              ></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                type="password"
                v-model="loginForm.password"
                autocomplete="off"
                placeholder="Please input a password"
              ></el-input>
            </el-form-item>
            <!-- <el-row :gutter="22">
              <el-col :span="12">
                <el-form-item prop="code">
                  <el-input
                    v-model="loginForm.code"
                    placeholder="请输入验证码"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <div
                  class="coderight"
                  @click="identifyCode = makeCode()"
                >
                  <Identify :identifyCode="identifyCode" />
                </div>
              </el-col>
            </el-row> -->
            <el-form-item>
              <button
                class="login__form__left__button"
                type="primary"
                @click.prevent="login()"
              >Sign in</button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapMutations, mapActions } from "vuex";
// import Identify from "@/components/Identify/index.vue";

export default {
  // components: { Identify },
  props: {},
  data() {
    return {
      identifyCode: this.makeCode(),
      loginForm: {
        username: "",
        password: "",
        code: ""
      },
      rules: {
        username: [
          {
            required: true,
            message: "The account cannot be empty!",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "The password cannot be empty!",
            trigger: "blur"
          }
        ],
        code: [
          {
            required: true,
            trigger: "blur",
            message: "验证码不能为空"
          },
          {
            trigger: "blur",
            validator: (rule, value, callback) =>
              value.toLocaleLowerCase() ===
              this.identifyCode.toLocaleLowerCase()
                ? callback()
                : callback(new Error("请输入正确的验证码"))
          }
        ]
      }
    };
  },

  methods: {
    ...mapMutations(["COMMIT_USER"]),
    ...mapActions(["DISPATCH_CLEARCHACE"]),
    async login() {
      try {
        await this.$refs.loginForm.validate();
        const { username, password } = this.loginForm;
        const { data } = await this.$API.login({
          username,
          password
        });
        await this.DISPATCH_CLEARCHACE({ Vue: this });
        this.COMMIT_USER(data);
        this.$router.push("/");
      } catch (error) {
        console.error(error);
        this.identifyCode = this.makeCode();
        this.$msg({
          showClose: true,
          message: error ? error.msg : "请输入正确的字段",
          type: "error"
        });
      }
    },
    makeCode() {
      const codes = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split(
        ""
      );
      return new Array(4)
        .fill("")
        .map(() => {
          const i = randomNum(0, codes.length);
          return codes[i];
        })
        .join("");

      function randomNum(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.login {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  &__bg {
    flex: 1;
    position: fixed;
    display: flex;
    align-items: center;
    align-items: center;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    min-width: 1000px;
    z-index: -10;
    zoom: 1;
    background-color: #fff;
    background-repeat: no-repeat;
    background-size: cover;
    -webkit-background-size: cover;
    -o-background-size: cover;
    background-position: center 0;
    background-image: url("../../assets/img/login/bg.png");
  }
  &__form {
    &__box {
      width: 460px;
      height: 400px;
      overflow: hidden;
      border-radius: 6px;
      margin-top: -200px;
    }
    &__left {
      padding: 60px;
      background-color: #ffffff;
      &__top {
        font-family: Microsoft YaHei;
        font-weight: Regular;
        line-height: 44px;
        padding-bottom: 60px;
        .title {
          font-size: 2em;
          color: #333333;
        }
        .title2 {
          font-size: 1.5em;
          color: #999999;
          span {
            color: #00d3b8;
          }
        }
      }
      &__main {
        ::v-deep .el-input__inner {
          border-radius: 0;
          border: none;
          border-bottom: 1px solid #00d3b8;
        }
        ::v-deep .el-input__inner:-webkit-autofill {
          box-shadow: 0 0 0 1000px white inset !important;
        }
        ::v-deep .el-form-item.is-error .el-input__inner {
          border-color: #d3d3d3;
        }
        // ::v-deep .el-form-item__error {
        //   color: green
        // }
      }
      &__button {
        width: 340px;
        height: 44px;
        background: #00d3b8;
        border-radius: 6px;
        border: 0px;
        font-size: 20px;
        font-family: Arial;
        color: rgba(255, 255, 255, 1);
        line-height: 44px;
        user-select: none;
        outline: 0;
        cursor: pointer;
        margin-top: 30px;
        &:hover {
          box-shadow: 0px 0px 5px 0px #12443d;
        }
      }
    }
  }
}
</style>
