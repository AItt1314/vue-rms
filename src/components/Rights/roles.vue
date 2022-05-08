<template>
  <div id="roles" class="page">
    <!-- 头部面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片内容区域 -->
    <el-card class="box-card">
      <!-- 添加用户按钮区域 -->
      <el-row>
        <el-col
          ><el-button type="primary" @click="AddDialogVisible = true"
            >添加用户</el-button
          ></el-col
        >
      </el-row>
      <!-- 渲染的列表区域 -->
      <el-row>
        <el-table
          :data="RolesList"
          style="width: 100%"
          stripe
          :border="true"
          class="listTable"
        >
          <!-- 展开列 -->
          <el-table-column type="expand">
            <!-- 展开列的内容区域，用作用域插槽实现-->
            <template slot-scope="scope">
              <!-- 权限区域 利用三重for循环渲染出三辰结构 -->
              <el-row
                v-for="(item, index) in scope.row.children"
                :key="item.id"
                :class="[
                  index == 0 ? 'top_border' : '',
                  'bottom_border',
                  'vertical_center',
                ]"
              >
                <!-- 一级权限区域 -->
                <el-col :span="5">
                  <el-tag
                    effect="dark"
                    closable
                    @close="RemoveTagById(scope.row, item.id)"
                  >
                    {{ item.authName }}
                  </el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <!-- 二级和三级权限区域 -->
                <el-col :span="19">
                  <el-row
                    v-for="(item1, index1) in item.children"
                    :key="item1.id"
                    :class="[
                      index1 == 0 ? '' : 'top_border',
                      'vertical_center',
                    ]"
                  >
                    <!-- 二级权限区域 -->
                    <el-col :span="6">
                      <el-tag
                        closable
                        effect="dark"
                        type="success"
                        @close="RemoveTagById(scope.row, item1.id)"
                      >
                        {{ item1.authName }}
                      </el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <!-- 三级权限区域 -->
                    <el-col :span="18">
                      <el-tag
                        v-for="(item2, index2) in item1.children"
                        :key="item2.id"
                        :class="[index2 == 0 ? '' : 'top_border']"
                        closable
                        effect="dark"
                        type="warning"
                        @close="RemoveTagById(scope.row, item2.id)"
                      >
                        {{ item2.authName }}
                      </el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <!-- 索引列 -->
          <el-table-column type="index" label="#" />
          <el-table-column prop="roleName" label="角色名称" />
          <el-table-column prop="roleDesc" label="角色描述" />
          <el-table-column label="操作" width="200px">
            <!-- 作用域插槽实现标签的展现 ， 在插槽中将三个标签都写上，再用v-if决定渲染哪一个 -->
            <template slot-scope="scope">
              <!-- 按钮区域，有三种操作按钮 -->
              <div class="btnList">
                <el-tooltip
                  effect="light"
                  content="编辑"
                  placement="top"
                  :enterable="false"
                >
                  <!-- 点击控制对话框的出现，并将作用域插槽的数据返回给一个对象中 -->
                  <el-button
                    type="primary"
                    size="mini"
                    icon="el-icon-edit"
                    @click="
                      editBtn({
                        id: scope.row.id,
                        roleName: scope.row.roleName,
                        roleDesc: scope.row.roleDesc,
                      })
                    "
                  />
                </el-tooltip>
                <el-tooltip
                  effect="light"
                  content="分配权限"
                  placement="top"
                  :enterable="false"
                >
                  <el-button
                    type="warning"
                    size="mini"
                    icon="el-icon-s-tools"
                    @click="privilegesBtn(scope.row)"
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
                    icon="el-icon-delete-solid"
                    @click="DeleteUser(scope.row.id)"
                  />
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-card>
    <!-- 添加按钮弹出的会话框 -->
    <el-dialog title="添加用户" :visible.sync="AddDialogVisible" width="40%">
      <span>
        <!-- 添加用户的表单 -->
        <el-form
          ref="addUserListRef"
          :model="addRequiredParameterList"
          label-width="80px"
          :rules="addRules"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addRequiredParameterList.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addRequiredParameterList.roleDesc"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="reset">重 置</el-button>
        <el-button type="primary" @click="SubmitUser">提 交</el-button>
      </span>
    </el-dialog>
    <!-- 点击编辑按钮弹出的会话框 -->
    <el-dialog title="添加用户" :visible.sync="editDialogVisible" width="40%">
      <span>
        <!-- 编辑用户的表单 -->
        <el-form
          ref="editUserListRef"
          :model="editRequiredParameterList"
          label-width="80px"
          :rules="addRules"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editRequiredParameterList.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="editRequiredParameterList.roleDesc"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="EditUser">确认修改</el-button>
      </span>
    </el-dialog>
    <!-- 点击分配权限出现的会话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="privilegesDialogVisible"
      width="40%"
    >
      <span>
          <!-- 树形控件 -->
        <el-tree
          :data="allRightsTree"
          :props="TreeProps"
           show-checkbox
           node-key='id'
           default-expand-all
           :default-checked-keys='defKeys'
           ref="RightsTreeRef"
        ></el-tree>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="privilegesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="SubmitRights"
          >确定分配</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 角色列表
      RolesList: [],
      //控制添加用户提示框的显示与隐藏
      AddDialogVisible: false,
      //控制编辑用户会话框的显示与隐藏
      editDialogVisible: false,
      //控制分配权限会话框的显示与隐藏
      privilegesDialogVisible: false,
      //添加用户请求参数
      addRequiredParameterList: {
        roleName: "",
        roleDesc: "",
      },
      //编辑用户请求参数
      editRequiredParameterList: {
        id: "",
        roleName: "",
        roleDesc: "",
      },
      //添加用户,编辑用户的表单验证
      addRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
      },
      //   设置权限的所有数据，树形结构
      allRightsTree: [],
    //  控制树形组件的标题和数据节点
      TreeProps:{
          children: 'children',
          label: 'authName'
      },
    //   默认选中的节点
    defKeys:[],
    // 角色授权请求参数
    RoleAuthorizationRequestParametersList:{
        id:'',
        rids:''
    },
    }
  },
  methods: {
    // 请求角色列表
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status != 200)
        return this.$message.error("请求角色列表失败");
      this.RolesList = res.data;
    },
    //提交添加用户的表单事件 提交事件一定要先进行验证
    SubmitUser() {
      this.$refs.addUserListRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "roles",
          this.addRequiredParameterList
        );
        if (res.meta.status != 201) return this.$message.error("创建用户失败");
        this.AddDialogVisible = false;
        this.$message.success(res.meta.msg);
        this.getRolesList();
      });
    },
    // 重置用户提交的表单
    reset() {
      this.$refs.addUserListRef.resetFields();
    },
    // 删除用户按钮，根据用户id删除
    async DeleteUser(id) {
      const { data: res } = await this.$http.delete(`roles/${id}`);
      if (res.meta.status != 200) return this.$message.error("删除用户失败");
      this.$message.success(res.meta.msg);
      this.getRolesList();
    },
    // 编辑用户按钮事件
    editBtn(inf) {
      this.editDialogVisible = true;
      // 这里可以直接使用Object.assign(target,source)方法，将一个对象的属性值赋值给另一个对象，要求的俩个对象有相同的属性名
      Object.assign(this.editRequiredParameterList, inf);
    },
    //确认修改用户按钮事件 ：先验证，在向数据库中提交修改数据
    EditUser() {
      this.$refs.editUserListRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          `roles/${this.editRequiredParameterList.id}`,
          this.editRequiredParameterList
        );
        if (res.meta.status != 200) return this.$message.error("修改失败");
        this.$message.success(res.meta.msg);
        this.getRolesList();
        this.editDialogVisible = false;
      });
    },
    // 根据id移出指定权限
    async RemoveTagById(role, rightId) {
      // 弹出确认框来提示，element-ui的提示框组件，确认消息
      const confirmResult = await this.$confirm(
        "此操作将移除此项权限, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);

      if (confirmResult != "confirm") {
        return this.$message.info("取消了此次删除");
      }

      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      );
      if (res.meta.status != 200) return this.$message.error("取消权限失败");
      this.$message.success(res.meta.msg);
      role.children = res.data;
    },
    // 分配权限按钮功能 1.实现分配权限会话框的展现 2.递归获取当前角色的所有三级节点 3获取权限树需要的数据 4在点击按钮后，递归获取所有三级节点前要将data中的当前三级权限节点数组清空
    async privilegesBtn(inf) {
        this.RoleAuthorizationRequestParametersList.id=inf.id;
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status != 200)
        return this.$message.error("获取角色数据权限失败");
      // 把获取的数据保存到data中
      this.allRightsTree = res.data;
      this.$message.success(res.meta.msg);
      //清空三级权限数组
      this.defKeys=[]
    //   递归获取当前角色的所有三级节点
      this.getLeafKeys(inf,this.defKeys)
      this.privilegesDialogVisible = true;
    },
    //通过递归的形式获取角色所有的三级权限的id，并把其保存至data的数组中
    getLeafKeys(node,arr){
        //如果当前节点不包含children则它是三级节点，就直接将其id保存到arr中
        if(!node.children){
           return arr.push(node.id)
        }
        node.children.forEach(element => {
            this.getLeafKeys(element,arr);
        });
    },
    //提交分配权限的结果到服务器
    async SubmitRights(){
        // 获取树型结构的被半选的key值，返回一个数组
        //获取所有选中的节点的key值，返回一个数组
        // 利用展开运算符...合并数组
        const keys = [...this.$refs.RightsTreeRef.getHalfCheckedKeys(),...this.$refs.RightsTreeRef.getCheckedKeys()];
        this.RoleAuthorizationRequestParametersList.rids = keys.join(',');
        const {data : res} = await this.$http.post(`roles/${this.RoleAuthorizationRequestParametersList.id}/rights`,this.RoleAuthorizationRequestParametersList);
        if(res.meta.status!=200) return this.$message.error('分配权限失败');
         this.$message.success(res.meta.msg);
         this.privilegesDialogVisible = false;
         this.getRolesList()
    }
  },
  created() {
    this.getRolesList();
  },
};
</script>


<style scoped>
/* 给el-row盒子布局，让一二级权限的标签垂直居中 */
.vertical_center {
  display: flex;
  align-items: center;
}
.el-tag {
  margin: 20px;
  margin-right: 0;
}
.top_border {
  border-top: 1px solid #ccc;
}
.bottom_border {
  border-bottom: 1px solid #ccc;
}
</style>