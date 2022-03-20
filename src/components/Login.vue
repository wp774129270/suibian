<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/img/95828445_p0.jpg" alt="" />
      </div>
      <!-- 表单区域 -->
      <el-form label-width="0px" class="login_form" :model="loginForm" :rules="rules" ref="loginFormRef">
        <!-- 用户名区域 -->
        <el-form-item label="" prop="username">
          <el-input prefix-icon="el-icon-user-solid" v-model="loginForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item label="" prop="password">
          <el-input prefix-icon="el-icon-lock" v-model="loginForm.password" show-password placeholder="请输入密码"></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item label="" class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLogin">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: '123456',
      },

      rules: {
        // 验证用户名
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' },
        ],
        // 验证密码
      },
    }
  },
  methods: {
    resetLogin() {
      this.$refs.loginFormRef.resetFields()
    },
    login() {
      this.$refs.loginFormRef.validate(async (v) => {
        if (!v) return
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) return this.$message.error('登录失败!')
        this.$message.success('恭喜你，登录成功!')
        console.log(res)
        // 1.1项目中除了登录之外的其他API接口，必须在登陆之后才能访问
        // 1.2token 直应在当前网站打开期间生效， 所以将 token 保存在 sessionStorage中
        window.sessionStorage.setItem('token', res.data.token)
        // 2.通过编程式导航跳转到后台主页，路由是/home
        this.$router.push('/home')
      })
    },
  },
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: rgb(230, 218, 220);
  height: 100%;
  // display: flex;
  // justify-content: center;
  // align-items: center;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  .avatar_box {
    height: 150px;
    width: 250px;
    border: 1px solid #eee;
    border-radius: 75%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);

    img {
      width: 100%;
      height: 100%;
      border-radius: 75%;
    }
  }
}
.login_form {
  // position: absolute;
  // bottom: 0px;
  position: absolute;
  bottom: 0px;
  width: 65%;
  padding: 0 20px;
  box-sizing: border-box;
  margin: 0 auto;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
