<template>
    <div>
        <el-button type="info" @click="quit">退出</el-button>
    </div>
</template>

<script>
export default {
    data () {
        return {
            
        }
    },
    methods: {
        //退出登录事务：1.清空存储的token window.sessionStorage.clear() 2.跳转至登录页 this.$router.push('/login')
        quit(){
            window.sessionStorage.clear();
            this.$router.push('/login');
        }
    }
}
</script>


<style scoped>

</style>