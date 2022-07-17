<template>
  <div id="goods_cate" class="page">
    <!-- 头部面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 添加分类的按钮 -->
      <el-row>
        <el-col>
          <!-- 显示父级分类对话框，获取父级分类列表 -->
          <el-button type="success" @click="showParentCate">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 渲染的商品分类表格区域 -->
      <el-row>
        <tree-table
          :data="commodityClassificationDataList"
          :columns="columns"
          :selection-type="false"
          :expand-type="false"
          :show-index="true"
          border
          :show-row-hover="false"
        >
          <template slot="isOk" slot-scope="scope">
            <i class="el-icon-error" v-if="scope.row.cat_deleted"></i>
            <i class="el-icon-success" v-if="!scope.row.cat_deleted"></i>
          </template>
          <template slot="level" slot-scope="scope">
            <el-tag effect="dark" v-if="scope.row.cat_level == 0">一级</el-tag>
            <el-tag effect="dark" type="success" v-if="scope.row.cat_level == 1"
              >二级</el-tag
            >
            <el-tag effect="dark" type="warning" v-if="scope.row.cat_level == 2"
              >三级</el-tag
            >
          </template>
          <template slot="operation" slot-scope="scope">
            <el-button type="success" icon="el-icon-edit" @click="editCate(scope.row.cat_id)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete"  @click="deleteCate(scope.row.cat_id)">删除</el-button>
          </template>
        </tree-table>
      </el-row>
      <!-- 分页栏区域 -->
      <!-- 接口有问题，无法完成分页操作 -->
      <!-- <el-row>
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="ItemClassificationRequestParameters.pagenum"
            :page-sizes="[3, 5, 10, 15]"
            :page-size="ItemClassificationRequestParameters.pagesize"
            layout="sizes, prev, pager, next, jumper"
          >
          </el-pagination>
        </div>
      </el-row> -->
    </el-card>
    <!-- 点击添加分类出现的会话框 -->
    <el-dialog title="添加分类" :visible.sync="addDialogVisible" width="40%" @close="addDialogClosed">
      <!-- 对话框的内容区域 -->
      <span>
        <el-form
          label-width = auto
          :rules="addRules"
          :model="addClassificationParameterList"
          ref="addFormRef"
        >
          <el-form-item label="分类名称:" prop="cat_name">
            <el-input v-model="addClassificationParameterList.cat_name"></el-input>
          </el-form-item>
          <!-- 父级分类列表渲染为级联选择器，一定要指定props来指定配置对象 -->
          <el-form-item label="父级分类:">
            <el-cascader
    v-model="selectionKeys"
    :options="ParentCateList"
    :props="cascaderProps"
    :clearable = true
    :change-on-select= true
    @change="parentCateChange"
    ></el-cascader>
          </el-form-item>
        </el-form>
      </span>
      <!-- 对话框的底部按钮区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogClosed">重 置</el-button>
        <el-button type="primary" @click="addClassification">提 交</el-button>
      </span>
    </el-dialog>
    <!-- 编辑分类的会话框 -->
<el-dialog
  title="编辑分类" :visible.sync="editDialogVisible"
  >
  <span>
    <el-form :model="editCateRequestParameters" ref="editFormRef" label-width=auto :rules="addRules" >
  <el-form-item label="分类名称:" prop="cat_name" >
    <el-input v-model="editCateRequestParameters.cat_name"></el-input>
  </el-form-item>
  </el-form>
  </span>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="submitEdited">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>


<script>
import validate from '@/assets/js/validate';
import paramsVue from './params.vue';
export default {
  data() {
    return {
      //商品分类请求参数
      ItemClassificationRequestParameters: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      //商品分类数据列表
      commodityClassificationDataList: [],
      //表格各列的配置
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          prop: "cat_deleted",
          //表示这一列以插槽形式渲染
          type: "template",
          template: "isOk",
          width: "100px",
        },
        {
          label: "排序",
          prop: "cat_level",
          //表示这一列以插槽形式渲染
          type: "template",
          template: "level",
          width: "300px",
        },
        {
          label: "操作",
          //表示这一列以插槽形式渲染
          type: "template",
          template: "operation",
        },
      ],
      //控制分类会话框的显示与隐藏
      addDialogVisible:false,
      //添加分类的请求参数
      addClassificationParameterList:{
        //默认添加的是一级分类
        cat_pid: 0,
        cat_name:'',
        cat_level: 0,
      },
      // 添加表单的验证规则
      addRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
      },
      //父级分类数据列表
      ParentCateList:[],
      //父级分类列表的级联选择器的配置对象
      cascaderProps:{
        expandTrigger:'hover',
        value:'cat_id',
        label:'cat_name',
        children:'children'
      },
      //级联选择器选中的父级分类id数组
      selectionKeys:[],
    // 编辑分类会话框的显示与隐藏
      editDialogVisible:false,
      // 编辑分类请求参数
      editCateRequestParameters:{
        id:0,
        cat_name:''
      }
    };
  },
  methods: {
    async getDateList() {
      const { data: res } = await this.$http.get(
        "categories",{Params:this.ItemClassificationRequestParameters}
      );
      if (res.meta.status != 200)
        return this.$message.error("获取商品分类数据失败");
      this.commodityClassificationDataList = res.data;
      this.$message.success(res.meta.msg);
    },
    //分页栏 点击改变每页展现的数据数目
    // handleSizeChange(newSize){
    //   this.ItemClassificationRequestParameters.pagesize = newSize
    //   getDateList();
    // },
    //分页栏 当前页数改变时的
    // handleCurrentChange(newPage){
    //   this.ItemClassificationRequestParameters.pagenum=newPage
    //   getDateList();
    // }
    //获取父级分类列表
    async getParentCateList(){
      const {data : res} = await this.$http.get("categories", {Params:{type: 2 }})
      if(res.meta.status!=200) return this.$message.error("获取父级分类列表失败");
      this.ParentCateList = res.data
      this.$message.success(res.meta.msg)
    },
    //点击分类控制会话框的出现，并发起ajax请求父级分类列表
    showParentCate(){
      this.addDialogVisible = true;
      this.getParentCateList()
    },
    //级联选择器父级分类切换，
    parentCateChange(){
      // console.log(this.selectionKeys);
      //如果选中的分类，则selectionKeys的长度大于0
      if(this.selectionKeys.length > 0){
        this.addClassificationParameterList.cat_pid = this.selectionKeys[this.selectionKeys.length - 1];
         this.addClassificationParameterList.cat_level = this.selectionKeys.length
         return
      }else{
        this.addClassificationParameterList.cat_pid = 0;
         this.addClassificationParameterList.cat_level = 0
      }
    },
    //关闭添加分类对话框清空表单事件
    addDialogClosed(){
      this.$refs.addFormRef.resetFields();
      this.selectionKeys = [];
      this.addClassificationParameterList.cat_pid=0;
      this.addClassificationParameterList.cat_level=0;
    },
    //提交添加分类的信息，先验证在提交
    addClassification(){
     this.$refs.addFormRef.validate(async valid =>{
      if(!valid) return
      const {data : res} = await this.$http.post("categories",this.addClassificationParameterList)
      if(res.meta.status!=201) return this.$message.error('添加分类请求失败')
       this.$message.success(res.meta.msg)
       this.addDialogVisible = false;
       this.getDateList();
     })
    },
    //点击编辑按钮事件，得到所在的id，控制会话框出现
    async editCate(id){
      const {data : res} = await this.$http.get(`categories/${id}`)
      if(res.meta.status!=200) return this.$message.error('查询分类失败')
      this.$message.success(res.meta.msg)
      this.editCateRequestParameters.id = res.data.cat_id;
      this.editCateRequestParameters.cat_name =res.data.cat_name;
      this.editDialogVisible = true
    },
    //编辑提交分类
    submitEdited(){
      this.$refs.editFormRef.validate(async valid =>{
        if(!valid) return
      const {data : res} = await this.$http.put(`categories/${this.editCateRequestParameters.id}`,this.editCateRequestParameters.cat_name)
      console.log(res);
      if(res.meta.status!=200) return this.$message.error('修改失败')
       this.$message.success(res.meta.msg)
        this.editDialogVisible = false;
       this.getDateList();
      })
    },
    // 点击删除事件,需要先询问用户是否删除，点击了确定才确认删除
    async deleteCate(id){
    const  confirmResult =  await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        // 点击确定返回字符串confirm，点击取消返回字符串cancel
        // console.log(confirmResult);
        if(confirmResult === 'confirm'){
          const {data : res} = await this.$http.delete(`categories/${id}`)
          if(res.meta.status!=200) return this.$message.error('删除失败')
           this.$message.success(res.meta.msg)
           this.getDateList();
        }else{
          this.$message.info('取消了删除操作')
        }
      },
      
  },
  created() {
    //组件创建时获取商品分类数据
    this.getDateList();
  },
};
</script>


<style scoped>
.el-icon-success:before {
  color: green;
}
.el-icon-error:before {
  color: red;
}
.zk-table {
  margin-top: 30px;
}
.el-cascader{
  width: 100%;
}
</style>