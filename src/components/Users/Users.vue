<template>
  <div id="user" @keyup.enter="getUsersList" class="page">
    <!-- 头部面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 搜索框与添加区域-->
      <el-row>
        <el-col :span="14">
          <!-- 将表单双向绑定到请求参数对象的对应位置,清空，清空事件（点击清空自动重新获取列表） -->
          <el-input
            placeholder="请输入需要查询的用户信息"
            class="input-with-select"
            :clearable="true"
            @clear="getUsersList"
            v-model="requestParameterList.query"
          >
            <!-- 实现点击查询按钮触发查询事件（即触发获取用户列表事件） -->
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUsersList"
            ></el-button> </el-input
        ></el-col>
        <!-- 添加用户按钮 -->
        <el-col :span="2" :offset="2">
          <el-button type="success" @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <el-row>
        <!-- 渲染的用户列表区域 -->
        <el-table
          :data="ResponseParameterObject.usersList"
          border
          stripe
          style="width: 100%"
          class="listTable"
        >
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column prop="username" label="用户名"></el-table-column>
          <el-table-column prop="email" label="邮箱"></el-table-column>
          <el-table-column prop="mobile" label="电话"></el-table-column>
          <el-table-column prop="role_name" label="角色权限"></el-table-column>
          <el-table-column label="状态">
            <!-- 用作用域插槽来获取数据,slot-scope="scope",scope.row为本行数据 -->
            <template slot-scope="scope"
              ><el-switch
                v-model="scope.row.mg_state"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="userStateChange(scope.row)"
            /></template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <div class="btnList">
                <el-tooltip
                  effect="light"
                  content="修改用户信息"
                  placement="top"
                  :enterable="false"
                >
                  <!-- 点击控制对话框的出现，并将作用域插槽的数据返回给一个对象中 -->
                  <el-button
                    type="primary"
                    size="mini"
                    icon="el-icon-edit"
                    @click="editBtn(scope.row)"
                  />
                </el-tooltip>
                <el-tooltip
                  effect="light"
                  content="更改用户角色"
                  placement="top"
                  :enterable="false"
                >
                  <el-button
                    type="warning"
                    size="mini"
                    icon="el-icon-s-tools"
                    @click="
                      changeRoles({
                        id: scope.row.id,
                        username: scope.row.username,
                        role_name: scope.row.role_name,
                      })
                    "
                  />
                </el-tooltip>
                <el-tooltip
                  effect="light"
                  content="删除用户"
                  placement="top"
                  :enterable="false"
                >
                  <el-button
                    type="danger"
                    size="mini"
                    @click="removeUser(scope.row)"
                    icon="el-icon-delete-solid"
                  />
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <!-- 分页栏 -->
      <el-row>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="ResponseParameterObject.pagenum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="requestParameterList.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="ResponseParameterObject.total"
        >
        </el-pagination>
      </el-row>
    </el-card>

    <!-- 添加用户提示框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="40%">
      <!-- 对话框的内容区域 -->
      <span>
        <el-form
          label-width="80px"
          :rules="addRules"
          :model="addRequestParameterList"
          ref="addFormRef"
        >
          <el-form-item label="用户名称" prop="username">
            <el-input v-model="addRequestParameterList.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" type="password" prop="password">
            <el-input
              prefix-icon="el-icon-lock"
              v-model="addRequestParameterList.password"
              type="password"
              ref="password_inputRef"
            >
            </el-input>
            <i class="el-icon-view see" @click="view"></i>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addRequestParameterList.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="addRequestParameterList.mobile"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <!-- 对话框的底部按钮区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetAddForm">重 置</el-button>
        <el-button type="primary" @click="addUser">提 交</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户提示框 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editDialogVisible"
      width="40%"
    >
      <!-- 对话框的内容区域 -->
      <span>
        <el-form
          label-width="80px"
          :rules="addRules"
          :model="editRequestParameterList"
          ref="editFormRef"
        >
          <el-form-item label="用户名称">
            <!-- 禁用表单属性disabled="disabled" -->
            <el-input
              v-model="editRequestParameterList.username"
              disabled="disabled"
            ></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editRequestParameterList.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="editRequestParameterList.mobile"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <!-- 对话框的底部按钮区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确认修改</el-button>
      </span>
    </el-dialog>
    <!-- 点击分配角色出现的对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="allotDialogVisible"
      width="40%"
      @close="setAllotDialogClosed"
      class="allot"
    >
      <!-- 对话框的内容区域 -->
      <div>
        <p>当前的用户：{{ userInfo.username }}</p>
        <p>当前的角色：{{ userInfo.role_name }}</p>
        <!-- 下拉选择器区域 -->

        <p>
          分配新角色:<el-select v-model="selectRid" placeholder="请选择">
            <!-- label是选中时看到的值,value是选中时真正选到的值(一般用他来存放需要拿到的数据,及为el-select中v-model的值) -->
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <!-- 对话框的底部按钮区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="allotDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="AssigningUserRoles"
          >确认分配</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>


<script>
import validate from "../../assets/js/validate.js";
export default {
  data() {
    return {
      // 获取用户列表请求参数对象
      requestParameterList: {
        query: "",
        // 当前数据的页数页数
        pagenum: 1,
        pagesize: 2,
      },
      ResponseParameterObject: {
        //获取用户列表
        usersList: [],
        total: 0,
        pagenum: 1,
      },
      //控制添加对话框的显示与隐藏
      addDialogVisible: false,
      //控制修改对话框的显示与隐藏
      editDialogVisible: false,
      //增加用户提交请求参数对象
      addRequestParameterList: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      //修改用户提交请求参数对象
      editRequestParameterList: {
        id: "",
        username: "",
        email: "",
        mobile: "",
      },
      // 用户提交表单的验证规则
      addRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 5,
            max: 15,
            message: "长度在 5 到 15 个字符",
            trigger: "blur",
          },
        ],
        email: [
          {
            required: true,
            message: "请输入邮箱",
            trigger: ["change", "blur"],
          },
          {
            validator: validate.email,
            message: "",
            trigger: ["change", "blur"],
          },
        ],
        mobile: [
          {
            required: true,
            message: "请输入电话",
            trigger: ["blur"],
          },
          {
            validator: validate.phone,
            message: "",
            trigger: ["change", "blur"],
          },
        ],
      },
      // 控制分配角色对话框的显示与隐藏
      allotDialogVisible: false,
      // 分配用户角色请求参数
      // 分配角色对话框的内容所需数据,
      userInfo: {
        id: "",
        role_name: "",
        username: "",
      },
      AssignUserRoleRequestParameters: {
        //用户id
        id: "",
        //角色id
        rid: "",
      },
      // 角色列表数据
      roleList: [],
      //下拉选择器收集到的角色id
      selectRid: "",
    };
  },
  methods: {
    //获取数据函数，ajxs请求
    async getUsersList() {
      const { data: res } = await this.$http.get("users", {
        params: this.requestParameterList,
      });
      if (res.meta.status != 200) return this.message.error(res.meta.msg);
      //    console.log(res);
      this.ResponseParameterObject.usersList = res.data.users;
      this.ResponseParameterObject.total = res.data.total;
    },
    // 监听pageSize改变
    handleSizeChange(newSize) {
      // console.log(newSize);
      // 将新获取的每页条数赋值给我们的请求参数，并重新到用一次获取数据函数
      this.requestParameterList.pagesize = newSize;
      this.getUsersList();
    },
    // 监听currentPage 改变
    handleCurrentChange(currentPage) {
      // 将新获取的每页条数赋值给我们的请求参数，并重新到用一次获取数据函数
      this.requestParameterList.pagenum = currentPage;
      this.getUsersList();
    },
    // 发送put请求的路径最好使用模板字符串
    async userStateChange(inf) {
      // console.log(inf);
      const { data: res } = await this.$http.put(
        `users/${inf.id}/state/${inf.mg_state}`
      );
      if (res.meta.status != 200) {
        // 如果更新失败，不能改变状态，及将状态恢复为原来的状态
        inf.mg_state = !inf.mg_state;
        return this.$message.error("更新状态失败");
      }
      this.$message.success(res.meta.msg);
    },
    // 发送put请求，向数据库中添加用户
    addUser() {
      //所有的表单提交都要先进行验证，验证通过后才能提交
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "users",
          this.addRequestParameterList
        );
        if (res.meta.status != 201) return this.$message.error("用户创建失败");
        this.addDialogVisible = false;
        this.$message.success(res.meta.msg);
        this.getUsersList();
      });
    },
    // 根据用户id删除单个用户
    async removeUser(inf) {
      const { data: res } = await this.$http.delete(`users/${inf.id}`, inf.id);
      if (res.meta.status != 200) return this.$message.error("用户删除失败");
      this.$message.success(res.meta.msg);
      this.getUsersList();
    },
    // 修改用户信息按钮 功能1：控制会话框出现，功能2获取到用户信息，并将信息存入新对象中
    editBtn(inf) {
      this.editDialogVisible = true;
      this.ResponseParameterObject.usersList.find((element) => {
        if (element.id == inf.id) {
          this.editRequestParameterList.email = element.email;
          this.editRequestParameterList.mobile = element.mobile;
          this.editRequestParameterList.username = inf.username;
          this.editRequestParameterList.id = inf.id;
        }
      });
    },
    //确认修改 同样需要先验证表单
    editUser() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        const { id, email, mobile } = this.editRequestParameterList;
        const { data: res } = await this.$http.put(
          `users/${this.editRequestParameterList.id}`,
          { id, email, mobile }
        );
        if (res.meta.status != 200) return this.$message.error("修改失败");
        this.editDialogVisible = false;
        this.$message.success(res.meta.msg);
        this.getUsersList();
      });
    },
    view() {
      switch (this.$refs.password_inputRef.type) {
        case "password":
          this.$refs.password_inputRef.type = "text";
          break;
        case "text":
          this.$refs.password_inputRef.type = "password";
          break;
      }
    },
    //重置添加表单
    resetAddForm() {
      this.$refs.addFormRef.resetFields();
    },
    //点击更改用户角色按钮事件
    async changeRoles(inf) {
      // 将得到id，username，role_name赋值给data中的对象
      console.log(inf);
      Object.assign(this.userInfo, inf);
      //将得到的用户id赋值给请求参数
      this.AssignUserRoleRequestParameters.id = inf.id;
      //得到所有的角色列表
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status != 200)
        return this.$message.error("获取角色列表失败");
      this.roleList = res.data;
      this.$message.success(res.meta.msg);
      this.allotDialogVisible = true;
      this.getUsersList();
    },
    //点击确认分配按钮,分配用户角色
    async AssigningUserRoles() {
      if (this.selectRid == "") return this.$message.error("请分配用户角色");
      //将收集到的id赋值给请求参数中的id
      this.AssignUserRoleRequestParameters.rid = this.selectRid;
      const { data: res } = await this.$http.put(
        `users/${this.AssignUserRoleRequestParameters.id}/role`,
        { rid: this.AssignUserRoleRequestParameters.rid }
      );
      if (res.meta.status != 200) return this.$message.error("分配角色失败");
      this.$message.success(res.meta.msg);
      this.getUsersList();
      this.allotDialogVisible = false;
    },
    //监听对话框关闭时,将选择框的值清空,将用户信息重置为空
    setAllotDialogClosed() {
      (this.selectRid = ""), (this.userInfo = {});
    },
  },
  created() {
    this.getUsersList();
  },
};
</script>


<style scoped>
.el-pagination {
  margin-top: 20px;
  width: 100%;
  display: flex;
  justify-content: space-around;
}
.see {
  position: absolute;
  top: 15px;
  right: 10px;
  cursor: pointer;
}
.allot p {
  margin: 25px;
}
.el-select {
  margin-left: 10px;
}
</style>