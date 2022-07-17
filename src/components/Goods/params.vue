<template>
    <div id="goods_cate" class="page">
        <!-- 头部面包屑区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card class="box-card">
            <!-- 警告区域 -->
            <el-alert title="注意，只允许为第三级分类设置相关参数" type="warning" show-icon :closable="false"> </el-alert>
            <!-- 选择商品分类区域，级联选择框 -->
            <el-row class="goods_cate">
                <el-col><span>
                        选择商品分类：
                    </span>
                    <!-- 级联选择框区域 -->
                    <!-- 使用级联选择器的要点，options指定数据源，props指定配置对象 ，v-model双向绑定一个数组表示拿到的值-->
                    <el-cascader v-model="selectionCateKeys" :options="cateList" :props="cateProps"
                        @change="handleChange">
                    </el-cascader>
                </el-col>
            </el-row>
            <!-- 下方标签页区域 -->
            <!-- v-model双向绑定当前标签页的 -->
            <el-tabs type="border-card" v-model="activeName" @tab-click="handleTabClick">
                <el-tab-pane name="many">
                    <span slot="label"><i class="el-icon-s-tools"></i> 动态参数</span>
                    <!-- 添加参数按钮 -->
                    <el-button type="primary" class="btn" :disabled="isBtnDisabled" @click="addDialogVisible = true">
                        添加参数</el-button>

                    <!-- 动态参数列表 -->
                    <el-table :data="paramsManyData" stripe :border="true">
                        <!-- 展开行 -->
                        <el-table-column type="expand">
                            <!-- 使用循环将所有的描述数据渲染成标签 -->
                            <template slot-scope="scope">
                                <el-tag :closable="true" v-for="(item, index) in scope.row.attr_vals" :key="index"
                                    @close="handleClose(index, scope.row)">
                                    {{ item }}</el-tag>
                                <!-- 动态编辑标签 -->
                                <el-input class="input-new-tag" v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue" ref="saveTagInput" size="small"
                                    @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+
                                    New Tag
                                </el-button>
                            </template>
                        </el-table-column>
                        <!-- 索引列 -->
                        <el-table-column type="index" label="#">
                        </el-table-column>
                        <el-table-column prop="attr_name" label="参数名称">
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button size="mini" type="primary" icon="el-icon-edit"
                                    @click="showAmendDialog(scope.row)">编辑</el-button>
                                <el-button size="mini" type="danger" icon="el-icon-delete"
                                    @click="deleteParams(scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane name="only">
                    <span slot="label"><i class="el-icon-setting"></i> 静态属性</span>
                    <!-- 添加属性按钮 -->
                    <el-button type="primary" class="btn" :disabled="isBtnDisabled" @click="addDialogVisible = true">
                        添加属性
                    </el-button>
                    <!-- 静态属性列表 -->
                    <el-table :data="paramsOnlyData" stripe :border="true">
                        <!-- 展开行 -->
                        <el-table-column type="expand">
                            <!-- 使用循环将所有的描述数据渲染成标签 -->
                            <template slot-scope="scope">
                                <el-tag :closable="true" v-for="(item, index) in scope.row.attr_vals" :key="index"
                                    @close="handleClose(index, scope.row)">
                                    {{ item }}</el-tag>
                                <!-- 动态编辑标签 -->
                                <el-input class="input-new-tag" v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue" ref="saveTagInput" size="small"
                                    @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+
                                    New Tag
                                </el-button>
                            </template>
                        </el-table-column>
                        <!-- 索引列 -->
                        <el-table-column type="index" label="#">
                        </el-table-column>
                        <el-table-column prop="attr_name" label="属性名称">
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button size="mini" type="primary" icon="el-icon-edit"
                                    @click="showAmendDialog(scope.row)">编辑</el-button>
                                <el-button size="mini" type="danger" icon="el-icon-delete"
                                    @click="deleteParams(scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>
        <!-- 添加参数，添加属性会话框 -->
        <el-dialog :title='"添加" + getTitle' :visible.sync="addDialogVisible" @close="addDialogClosed">
            <span>
                <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width=auto>
                    <el-form-item :label="getTitle" prop="attr_name">
                        <el-input v-model="addForm.attr_name"></el-input>
                    </el-form-item>
                </el-form>
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addParams">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 修改参数，属性会话框 -->
        <el-dialog :title='"修改" + getTitle' :visible.sync="amendDialogVisible" @close="amendDialogClosed">
            <span>
                <el-form :model="amendForm" :rules="addFormRules" ref="amendFormRef" label-width=auto>
                    <el-form-item :label="getTitle" prop="attr_name">
                        <el-input v-model="amendForm.attr_name"></el-input>
                    </el-form-item>
                </el-form>
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="amendDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="amendParams">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import validate from '@/assets/js/validate'
export default {
    data() {
        return {
            // 商品分类列表
            cateList: [],
            // 级联选择框的配置对象
            cateProps: {
                // expandTrigger指定触发方式，value指定选中的真正值，label属性指定看到的值，children指定嵌套关系
                expandTrigger: 'hover',
                value: 'cat_id',
                label: 'cat_name',
                children: 'children'
            },
            // 级联选择器拿到的值
            selectionCateKeys: [],
            //标签页区域显示的选项卡被激活的name
            activeName: 'many',
            //控制按钮的启用与禁用
            // buttonStatus:true
            //参数列表相应数据--动态参数
            paramsManyData: [],
            //参数列表相应数据--静态属性
            paramsOnlyData: [],
            // 控制添加参数/属性会话框的显示与隐藏
            addDialogVisible: false,
            // 添加动态参数或者静态属性的请求参数
            // 添加动态参数、静态属性的数据对象
            addForm: {
                attr_name: '',
            },
            // 添加动态参数、静态属性的表单校验对象
            addFormRules: {
                attr_name: [
                    { required: true, message: `请输入名称`, trigger: 'blur' }
                ],
            },
            // 控制修改参数，修改属性显示与隐藏
            amendDialogVisible: false,
            // 修改动态参数或者静态属性的请求参数
            // 修改动态参数、静态属性的数据对象
            amendForm: {},

        }
    },
    methods: {
        // 获取所有的商品列表
        async getCateList() {
            const { data: res } = await this.$http.get('categories', { params: { type: 3 } })
            if (res.meta.status != 200) return this.$message.error('获取商品列表数据失败')
            this.$message.success(res.meta.msg)
            this.cateList = res.data
        },
        // 级联选择器判断是否选中的为3级分类,若选中的不是三级分类，则重置数组，若选中的是三级分类，则改变按钮状态为启用，这里最好使用计算属性
        handleChange() {
            if (this.selectionCateKeys.length !== 3) {
                this.selectionCateKeys = [];
                this.paramsManyData = [];
                this.paramsOnlyData = []
                return
                // }else{
                //     this.buttonStatus = false
                //发起ajax请求，获取分类参数列表
            } else {
                this.getParamsData()
            }
        },
        // 标签页点击事件
        handleTabClick() {
            this.getParamsData()
        },
        //根据id和当前标签页发起ajax请求得到分类列表数据
        async getParamsData() {
            const { data: res } = await this.$http.get(`categories/${this.getThreeId}/attributes`, { params: { sel: this.activeName } })
            if (res.meta.status != 200) return this.$message.error('获取参数列表数据失败')
            this.$message.success(res.meta.msg)
            // 运用循环将每一项数据中的attr_vals转化为一个数组，包含所有描述
            res.data.forEach(element => {
                element.attr_vals = element.attr_vals ? element.attr_vals.split(" ") : []
                // 添加一个布尔值来控制编辑tag文本框的显示与隐藏，并且添加一个vaule来上向绑定数据
                element.inputVisible = false;
                element.inputValue = ''
            });
            if (this.activeName == 'many') { this.paramsManyData = res.data } else {
                this.paramsOnlyData = res.data
            }
            // console.log(res.data);
        },
        // 会话框关闭时间，重新进行校验规则
        addDialogClosed() {
            this.$refs.addFormRef.resetFields()
        },
        //会话框点击确定按钮事件
        addParams() {
            this.$refs.addFormRef.validate(async valid => {
                if (!valid) return;
                const { data: res } = await this.$http.post(`categories/${this.getThreeId}/attributes`, { attr_name: this.addForm.attr_name, attr_sel: this.activeName })
                if (res.meta.status != 201) return this.$message.error(`添加失败`)
                this.$message.success('添加成功')
                this.addDialogVisible = false;
                this.getParamsData();
            })
        },
        // 点击编辑事件,传过来的参数使用解构赋值的方法赋值给data中的数据，作为提交修改的请求参数
        showAmendDialog(row) {
            this.amendDialogVisible = true;
            this.amendForm = row

        },
        // 修改参数，属性会话框关闭事件,重置表单
        amendDialogClosed() {
            this.$refs.amendFormRef.resetFields()
        },
        // 确认修改提交事件
        amendParams() {
            this.$refs.amendFormRef.validate(async valid => {
                if (!valid) return;
                const { data: res } = await this.$http.put(`categories/${this.amendForm.cat_id}/attributes/${this.amendForm.attr_id}`, { attr_name: this.amendForm.attr_name, attr_sel: this.amendForm.attr_sel })
                if (res.meta.status != 200) {
                    this.getParamsData();
                    return this.$message.error(修改失败)
                }
                this.$message.success(res.meta.msg);
                this.amendDialogVisible = false;
                this.getParamsData();
            })
        },
        // 关闭修改参数会话框时，重新渲染界面，清空求参数
        amendDialogClosed() {
            this.amendForm = {}
            this.getParamsData();
        },
        //点击删除弹出确认删除弹窗
        async deleteParams(row) {
            const confirmResult = await this.$confirm(`此操作将永久删除该${this.getTitle}, 是否继续?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)
            // 点击确定返回字符串confirm，点击取消返回字符串cancel
            // console.log(confirmResult);
            if (confirmResult === 'confirm') {
                const { data: res } = await this.$http.delete(`categories/${row.cat_id}/attributes/${row.attr_id}`)
                if (res.meta.status != 200) return this.$message.error('删除失败')
                this.$message.success(res.meta.msg)
                this.getParamsData();
            } else {
                this.$message.info('取消了删除操作')
            }
        },
        // 点击+ tag 按钮时表单出现
        showInput(row) {
            row.inputVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        //动态编辑tag时按下enter或失去焦点就生成新的tag
        async handleInputConfirm(row) {
            if (row.inputValue.trim() == '') return
            row.attr_vals.push(row.inputValue.trim())
            row.inputVisible = false;
            row.inputValue = '';
            // 发起ajax请求保存数据
            await this.$http.put(`categories/${row.cat_id}/attributes/${row.attr_id}`, { attr_name: row.attr_name, attr_sel: row.attr_sel, attr_vals: row.attr_vals.join(' ') })
        },
        //动态删除标签
        async handleClose(index, row) {
            const confirmResult = await this.$confirm(`此操作将永久删除, 是否继续?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)
            // 点击确定返回字符串confirm，点击取消返回字符串cancel
            // console.log(confirmResult);
            if (confirmResult === 'confirm') {
                row.attr_vals.splice(index, 1)
                await this.$http.put(`categories/${row.cat_id}/attributes/${row.attr_id}`, { attr_name: row.attr_name, attr_sel: row.attr_sel, attr_vals: row.attr_vals.join(' ') })
            } else {
                this.$message.info('取消了删除操作')
            }
        }
    },
    computed: {
        //根据级联选择器选中的值来进行判断是否禁用按钮
        isBtnDisabled() {
            if (this.selectionCateKeys.length !== 3) {
                return true
            } else {
                return false
            }
        },
        // 拿到级联选择器的三级分类的id
        getThreeId() {
            if (this.selectionCateKeys.length === 3) {
                return this.selectionCateKeys[2]
            }
            return null
        },
        //根据当前激活的标签页控制会话框的标题
        getTitle() {
            if (this.activeName === 'many') {
                return '动态参数'
            }
            return '静态属性'
        },

    },
    created() {
        this.getCateList();
    }
}
</script>

<style scoped>
.goods_cate {
    margin: 20px 0;
    font-weight: bolder;
}

.btn {
    margin: 10px 0;
}

.el-tag {
    margin: 0 15px;
}

.input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
}
</style>