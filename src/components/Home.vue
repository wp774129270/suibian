<template>
  <div class="home">
    <el-container class="home-container">
      <!-- 头部区域 -->
      <el-header>
        <img src="../assets/img/2.jpg" alt="" class="imgage" />
        <div class="div1">
          <span class="v1">电商后台管理系统</span>
        </div>
        <el-button type="success" round class="margin" @click="logout">退出</el-button>
      </el-header>
      <!-- 页面主体区域 -->

      <el-container>
        <!-- 侧边栏 -->

        <el-aside :width="iscollapse ? '64px' : '200px'">
          <el-button type="warning" icon="el-icon-arrow-down" circle @click="toggle"></el-button>
          <!-- <div class="toggle-button">|||</div> -->
          <el-menu background-color="#2e2834" text-color="#fff" active-text-color="pink" class="mr" unique-opened :collapse="iscollapse" :collapse-transition="false" router>
            <!-- 一级菜单啊 -->
            <el-submenu :index="item.id + ''" v-for="item in meunlist" :key="item.id">
              <!-- 一级菜单模板区域 -->
              <template slot="title">
                <div class="icon">
                  <!-- 图标 -->
                  <i :class="iconsObj[item.id]"></i>
                  <!-- 文本 -->
                  <span>{{ item.authName }}</span>
                </div>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item :index="'/' + subItem.path + ''" v-for="subItem in item.children" :key="subItem.id">
                <template slot="title">
                  <!-- 图标 -->
                  <i class="el-icon-star-on"></i>
                  <!-- 文本 -->
                  <span>{{ subItem.authName }}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 右侧内容主体 -->
        <el-main>
          <!--  路由占位符-->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      meunlist: [],
      iconsObj: {
        125: 'el-icon-user-solid',
        103: 'el-icon-s-grid',
        101: 'el-icon-s-cooperation',
        102: 'el-icon-s-order',
        145: 'el-icon-s-platform',
      },
      iscollapse: false,
    }
  },
  created() {
    this.getMenuList()
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取所有的菜单
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      console.log(res)
      this.meunlist = res.data
    },
    // 点击按钮切换折叠与展开
    toggle() {
      this.iscollapse = !this.iscollapse
    },
  },
}
</script>

<style lang="less" scoped>
.ccc {
  height: 30px;
  width: 30px;
}
.toggle-button {
  background-color: #2e2834;
  color: #fff;
  line-height: 30px;
  font-size: 15px;

  // text-align: center;
}
.icon {
  margin-right: 45px;
}

.mr {
  // margin-right: 30px;
  // border: #fff;
  border-right: none;
  padding-left: 0px;
}
.home-container {
  height: 100%;
}
.margin {
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
  background-color: #2e2834;
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
  font-family: '楷体';
}
.el-aside {
  background-color: #2e2834;
  color: #333;
  text-align: center;
  line-height: 10px;
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
