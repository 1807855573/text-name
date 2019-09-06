<template>
    <el-container>
        <el-header class="m-header">
            <div>
                <span>欢迎：{{username}}</span>
                <el-button size="mini" type="primary" @click="quit">退出</el-button>
            </div>
        </el-header>
        <el-container>
            <el-aside width="200px">Aside</el-aside>
            <el-main>
                <el-button  @click="open">添加</el-button>
                <!-- 音乐列表 -->
                 <el-table
                    :data="musicList"
                    style="width: 100%">
                    <el-table-column
                    label="序号"
                    prop="music_name">
                    </el-table-column>
                    <el-table-column
                    label="歌名"
                    prop="music_name">
                    </el-table-column>
                    <el-table-column
                    label="图片"
                    prop="music_name">
                    <template slot-scope="text">
                        <img :src="text.row.pic" alt="" class="m-img">
                    </template>
                    </el-table-column>
                    <el-table-column
                    label="歌手"
                    prop="singer_name">
                    </el-table-column>
                    <el-table-column
                    label="是否上架"
                    prop="isup">
                    <template slot-scope="scope">
                        <span>{{scope.row.isup==1? "是":"否"}}</span>
                    </template>
                    </el-table-column>
                    <el-table-column
                    align="right">
                    <template slot-scope="scope">
                        <el-button
                        size="mini"
                        @click="handleEdit(scope.row.id)">修改</el-button>
                        <el-button
                        size="mini"
                        type="danger"
                        @click="handleDelete(scope.row.id)">删除</el-button>
                    </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                    background
                    layout="prev, pager, next"
                    :total="total"
                    :page-size="limit"
                    @current-change="pageChange"
                    >
                </el-pagination>
                <!-- 对话框 -->
                <el-dialog
                    title="提示"
                    :visible.sync="dialogVisible"
                    width="30%">
                    <el-form  ref="ruleForm" label-width="100px"  class="demo-ruleForm m-form">
                        <el-form-item label="歌名" prop="username">
                            <el-input v-model="music.music_name"></el-input>
                        </el-form-item>
                        <el-form-item label="歌手" prop="pass">
                            <el-input type="text" v-model="music.singer_name"></el-input>
                        </el-form-item>
                        <el-form-item label="上传图片" prop="pass">
                            <input type="file" @change="upload" ref="files"/>
                            <img :src="music.pic" alt="" class="m-img">
                        </el-form-item>
                        <el-form-item label="是否上架" prop="pass">
                            <el-radio-group v-model="music.isup">
                                <el-radio label="1">是</el-radio>
                                <el-radio label="0">否</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="operate">{{emitId?"修改":"添加"}}</el-button>
                        </el-form-item>
                    </el-form>
                    </el-dialog>
                <!-- 对话框结束-->
            </el-main>
        </el-container>
    </el-container>
</template>
<script>
import {mapState,mapMutations} from 'vuex'
export default {
    data(){
        return{
             musicList: [],
            dialogVisible: false,
            music:{
                music_name:'',
                singer_name:'',
                pic:'',
                isup:"1"
            },
            limit:2, 
            pagenum:1, 
            total:0,
            emitId:""

        }
    },
    created(){
        this.$api.user.getInfo().then(res => {
            if(res.data.code === 1){
                this.setName(res.data.data.username);
            }
        })
        this.getList();
    },
    methods:{
        ...mapMutations(['setName']),
        getList(){
            this.$api.music.querymusic({pagenum:this.pagenum,limit:this.limit}).then(res=>{
            if(res.data.code===1){
                this.musicList = res.data.data;
                this.total = res.data.total;
                console.log(res.data.total)
            }
        })
        },
        quit(){
            this.$confirm('确认退出吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                
                localStorage.removeItem('token');
                this.$router.push('/login')
            })
        },
        handleDelete(id){
            this.$confirm('确认退出吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                    }).then(() => {
                this.$api.music.delmusic({id}).then(res => {
                console.log(res)
                if(res.data.code === 1){
                        this.pagenum >=1 && this.pagenum>1?--this.pagenum:this.pagenum
                        this.getList(); 
                            }
                        })
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                            });
                        })
        },
        reset(){
            this.music.music_name = '',
            this.music.singer_name = '',
            this.music.pic = '',
            this.music.isup = "1"
            this.emitId = ""
        },
        pageChange(val){
            console.log(1)
            console.log(val)
            this.pagenum = val;
            this.getList();
        },
        upload(e){
            let file = e.target.files[0]
            let fromdata = new FormData()
            fromdata.append("file",file)

            this.$api.music.upload(fromdata).then(res=>{
            if(res.data.code===1){
                this.music.pic = 'http://localhost:3000'+res.data.url
            }
            })
             this.$refs.files.value = ""
        },
        open(){
            this.reset();
            this.dialogVisible = true;
        },
        operate(){
            if(this.emitId){
                this.emitmusic()
            }else{
                this.add()
            }
        },
        emitmusic(){
            this.$api.music.updatemusic(Object.assign({},this.music,{id:this.emitId})).then(res=>{
                if(res.data.code === 1){
                    this.dialogVisible = false;
                    this.getList()
                }
            })
        },
        add(){
            this.$api.music.addmusic(this.music).then(res=>{
            if(res.data.code===1){
                this.dialogVisible = false;
                this.$message({
                    message:"添加成功",
                    type:"success"
                })
                this.getList()
            }
        })
        },
        handleEdit(id){
            this.dialogVisible = true;
            this.emitId = id;
            let emitObj = this.musicList.find(item=>item.id===id)
            console.log(id)
            this.music.music_name = emitObj.music_name;
            this.music.singer_name = emitObj.singer_name;
            this.music.pic = emitObj.pic;
            this.music.isup = emitObj.isup
        }
    },
    computed:{
        ...mapState({
            username:state => state.user.username
        })
    }
}
</script>
<style>
    .el-header, .el-footer {
        background-color: #B3C0D1;
        color: #333;
        line-height: 60px;
    }
    
    .el-aside {
        background-color: #D3DCE6;
        color: #333;
        text-align: center;
    }
    
    .el-main {
        background-color: #E9EEF3;
        color: #333;
        height: 100%;
     
    }
    .el-container{
        height: 100%;
    }
    
    .m-header{
        text-align: right;
    }

    .m-img{
        width: 70px;
        height: 70px;
    }
</style>

