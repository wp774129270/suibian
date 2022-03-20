<template>
  <div class="home">
    <el-container class="home-container">
      <!-- 头部区域 -->
      <el-header>
        <img src="../assets/img/95828445_p0.jpg" alt="" class="imgage" />
        <div class="div1">
          <span class="v1">电商后台管理系统</span>
        </div>
        <el-button type="info" class="margin" @click="logout">退出</el-button>
      </el-header>
      <!-- 页面主体区域 -->
      <el-container>
        <!-- 侧边栏 -->
        <el-aside width="200px"></el-aside>
        <!-- 右侧内容主体 -->
        <el-main></el-main>
      </el-container>
    </el-container>
    <div></div>
    <div></div>
    <div></div>
  </div>
</template>

<script>
export default {
  methods:{
    logout(){
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.margin{
  margin-right: 20px;
}
.v1 {
  position: absolute;
  left: 120px;
  top: 3px;
}
.imgage {
  //   position: absolute;
  width: 100px;
  height: 50px;
  //   top: 5px;
}
.el-header,
.el-footer {
  background-color: #373d3f;
  color: #333;
  text-align: center;
  line-height: 60px;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  padding-right: 0;
  color: #fff;
  font-size: 20px;
  align-items: center;
}
.home {
  height: 100%;
}
.el-aside {
  background-color: #323743;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #e9edf0;
  color: #333;
  text-align: center;
  line-height: 160px;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
</style>
