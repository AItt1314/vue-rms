<template>
  <!-- 首页 -->
  <el-container class="home_container">
    <!-- 顶部栏 -->
    <el-header>
      <div class="home_title">
        <img src="../assets/img/homeLogo.png" alt="" /><span
          >电商后台管理系统</span
        >
      </div>
      <el-button type="info" @click="quit">退出</el-button>
    </el-header>
    <el-container>
      <!-- 左侧侧边栏 -->
      <el-aside width="200px">
          <!-- 大菜单 -->
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          background-color='#ecdef0'
          text-color='#590505'
        >
        <!-- 一级菜单 -->
          <el-submenu>
              <!-- 一级菜单模板区 -->
            <template slot="title">
                <!-- 一级菜单图标 -->
              <i class="el-icon-location"></i>
              <!-- 一级菜标题名 -->
              <span>导航一</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item index="1-4-1"><template slot="title">
                <!-- 二级菜单图标 -->
              <i class="el-icon-location"></i>
              <!-- 二级菜标题名 -->
              <span>导航一</span>
            </template></el-menu-item>
          </el-submenu>
          
        </el-menu></el-aside
      >
      <!-- 主要内容栏 -->
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    //退出登录事务：1.清空存储的token window.sessionStorage.clear() 2.跳转至登录页 this.$router.push('/login')
    quit() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
  },
};
</script>


<style scoped>
/* header区域 */
.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #0a90e9;
}
.el-header img {
  width: 80px;
}
.home_title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 350px;
  font-size: 25px;
  color: #fff;
}
/* 左侧侧边栏区域 */
.el-aside {
  background-color: #ecdef0;
}
.el-submenu [class^=el-icon-]{
    font-size: 25px;
}
.el-submenu__title span{
    font-size: 18px;
}
.el-main {
  background-color: #f3e7e7;
}
.home_container {
  height: 100%;
}
</style>