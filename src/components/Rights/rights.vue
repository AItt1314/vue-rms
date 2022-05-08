<template>
  <div id="rights" class="page">
    <!-- 头部面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片内容区域 -->
    <el-card class="box-card">
      <!-- 渲染的列表区域 -->
      <el-row>
        <el-table :data="RightsList" style="width: 100%" stripe :border="true">
          <el-table-column type="index" label="#" />
          <el-table-column prop="authName" label="权限名称" />
          <el-table-column prop="path" label="路径" />
          <el-table-column label="权限等级">
            <!-- 作用域插槽实现标签的展现 ， 在插槽中将三个标签都写上，再用v-if决定渲染哪一个 -->
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.level == 0">一级</el-tag>
              <el-tag v-if="scope.row.level == 1">二级</el-tag>
              <el-tag type="warning" v-if="scope.row.level == 2">三级</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-card>
  </div>
</template>


<script>
export default {
  data() {
    return {
      RightsList: [],
    };
  },
  methods: {
    async getRightsList() {
      const { data: res } = await this.$http.get("rights/list");
      if (res.meta.status != 200)
        return this.$message.error("请求权限列表失败");
      this.RightsList = res.data;
      // console.log(res);
    },
  },
  created() {
    // 这里需要加this，否则会报错该方法没有被定义
    this.getRightsList();
  },
};
</script>

<style scoped>
</style>