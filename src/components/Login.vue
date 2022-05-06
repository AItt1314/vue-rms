<template>
    <div id='login'>
        <div class="login_box">
            <!-- 头像区域 -->
            <div class="avatar_box">
                <img src="../assets/img/avatar.jpg" alt="" class="avatar">
            </div>
            <!-- 登录表单区域 -->
            <!-- 表单数据绑定的步骤：1.为form组件添加:model='form' 2.为输入框进行双向数据绑定 v-model='form.username' -->
            <!-- 进行表单数据验证的步骤：1.通过 rules 属性传入约定的验证规则 :rules="rules" 2.在data中声明验证规则 rules: {
          name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ], 3.将 Form-Item 的 prop 属性设置为需校验的字段名即可。 prop="region" -->
            <el-form label-width="80px" class="login_form" :model='loginForm' :rules='loginFormRules' ref="loginFormRef">
                <!-- 用户名 -->
                <el-form-item label='用户名：' prop="username">
                    <el-input prefix-icon="el-icon-user-solid" v-model='loginForm.username' ></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item label='密码：' prop="password">
                    <el-input prefix-icon="el-icon-lock" v-model='loginForm.password' type='password' ref='password_inputRef'>
                    </el-input>
                    <i class="el-icon-view see" @click="view"></i>
                </el-form-item>
                <!-- 按钮区域 -->
                <el-form-item class="login_btn">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="reset">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>


<script>
export default {
    data () {
        return {
            // 登录页面的登录数据对象
            loginForm:{
                username:'',
                password:''
            },
            //表单的验证规则对象
            loginFormRules:{
                // 验证用户名
                username:[
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                // 验证密码
                password:[
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        view(){
            switch(this.$refs.password_inputRef.type){
                case 'password':this.$refs.password_inputRef.type='text';
                break;
                case 'text' : this.$refs.password_inputRef.type='password';
                break;
            } 
        },
        // 点击重置按钮，重置表单对象 步骤：1.获取到表单的实例对象 ，使用ref+this.$refs 2.对实例对象使用element—ui自带的resetFields方法
        reset(){
            this.$refs.loginFormRef.resetFields()
        },
        //点击登录按钮事务 1.对表单进行预验证 （1.获取到表单的实例对象 ，使用ref+this.$refs 2.对实例对象使用element—ui自带的validate方法） 2.根据预验证结果判断是否移交数据 3根据返回的结果的状态码来判断是否登陆成功
        login(){
            this.$refs.loginFormRef.validate(async valid=>{
                if(!valid) return;
                const {data:res} = await this.$http.post('login',this.loginForm);
                // console.log(result);
                //弹框效果 如果element-ui为全局引入可以直接使用$message，如果为按需导入则需要先引入弹框组件并在Vue上进行全局挂载
                if(res.meta.status!=200) return this.$message.error('登陆失败！');
                this.$message({message: '登录成功！',type: 'success'});
                // 1．将登录成功之后的 token，保存到客户端的sessionStorage中
                    // 1.1项目中出了登录之外的其他API接口，必须在登录之后才能访问
                    //1.2 token只应在当前网站丁开期间生效，所以将 token保存在sessionStorage中
                window.sessionStorage.setItem('token', res.data.token)
                // 2．通过编程式导航跳转到后台主页，路由地址是/home
                this.$router.push('/home')

            })
        }
    }
}
</script>


<style scoped>
#login{
    background-color: #2b4b6b;
    height: 100%;
}
.login_box{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 450px;
    height: 300px;
    border-radius: 5px;
    background-color: #fff;
}
.avatar_box {
    /* 将头像盒子位移到指定位置 */
    position: absolute;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 130px;
    height: 130px;
    border-radius: 50%;
    border: 1px solid #eee;
    padding: 3px;
    z-index: 999;
    background-color: #fff;
    
}
.avatar{
    width: 100%;
    height: 100%;
    border-radius: 50%;
}
.login_form{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
}
.login_btn{
    display: flex;
    justify-content: flex-end;
    padding-right: 40px;
}
.see {
    position: absolute;
    top: 15px;
    right: 10px;
    cursor: pointer;
}
</style>