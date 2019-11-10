<template>
<el-card class="box-card">
    <!-- 面包屑 -->
    <!-- <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>权限管理</el-breadcrumb-item>
          <el-breadcrumb-item>角色列表</el-breadcrumb-item>
      </el-breadcrumb> -->
    <cus-Breadcrumb level1='权限管理' level2='角色列表'></cus-Breadcrumb>
    <el-row class="row-add">
        <el-col :span="24">
            <el-button>添加角色</el-button>
        </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table :data="list" style="width: 100%">
        <!-- 展开列 -->
        <el-table-column type="expand">
            <template slot-scope="scope">
                <!-- <el-tag @click="handleClose" type="success"></el-tag> -->
                <!-- 一级权限 -->
                <el-row class="level1" v-for="item1 in scope.row.children" :key="item1.id">
                    <el-col :span="4">
                        <el-tag @close="handleClose(scope.row, item1.id)" closable>{{item1.authName}}</el-tag>
                        <i class="el-icon-arrow-right"></i>
                    </el-col>
                    <!-- 二级权限 -->
                    <el-col :span="20">
                        <el-row v-for="item2 in item1.children" :key="item2.id">
                            <el-col :span="4">
                                <el-tag @close="handleClose(scope.row, item2.id)" closable type="success">{{item2.authName}}</el-tag>
                                <i class="el-icon-arrow-right"></i>
                            </el-col>
                            <!-- 三级权限 -->
                            <el-col :span="20">
                                <el-tag @close="handleClose(scope.row, item3.id)" class="level3" closable type="warning" v-for="item3 in item2.children" :key="item3.id">{{item3.authName}}</el-tag>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
                <!-- 未设置权限的展示 -->
                <el-row v-if="scope.row.children.length == '0'">
                    <el-col :span="24">未分配权限</el-col>
                </el-row>
            </template>
        </el-table-column>
        <el-table-column type="index" width="50">
        </el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="180">
        </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" width="180">
        </el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button plain size="mini" type="primary" icon="el-icon-edit" circle></el-button>
                <el-button plain size="mini" type="danger" icon="el-icon-delete" circle></el-button>
                <el-button @click="handleShowRightsDialog(scope.row)" plain size="mini" type="success" icon="el-icon-check" circle></el-button>
            </template>
        </el-table-column>
    </el-table>

    <!-- 分配权限对话框 -->
    <el-dialog @open="handleOpenDialog" title="分配权限" :visible.sync="dialogVisible">

        <el-tree ref="tree" v-loading="loadingTree" :data="treedata" :props="defaultProps" node-key="id" :default-checked-keys="checkedList" show-checkbox default-expand-all></el-tree>

        <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSetRoles">确 定</el-button>
      </span>
    </el-dialog>
</el-card>
</template>

<script>
export default {
    data() {
        return {
            list: [],
            loading: true,
            loadingTree: true,
            dialogVisible: false,
            treedata: [],
            defaultProps: {
                children: 'children',
                label: 'authName'
            },
            checkedList: [],
            currentRoleId: -1
        }
    },
    created() {
        this.loadData()
    },
    methods: {
        // 点击确定按钮,更新用户权限
        async handleSetRoles() {
            // 获取被选这个权限的id
            const checkedKeys = this.$refs.tree.getCheckedKeys()
            // 获取半选中权限的节点的id
            const halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys()
            const newArray = [...checkedKeys, ...halfCheckedKeys]
            // console.log(newArray)
            const {
                data: resData
            } = await this.$http.post(`roles/${this.currentRoleId}/rights`, {
                rids: newArray.join(',')
            })
            const {
                meta: {
                    status,
                    msg
                }
            } = resData
            if (status === 200) {
                this.dialogVisible = false
                this.$message.success(msg)
                this.loadData()
            } else {
                this.$message.error(msg)
            }
        },
        handleShowRightsDialog(role) {
            this.dialogVisible = true
            this.currentRoleId = role.id
            // console.log(role)
            const arr = []
            role.children.forEach((item1) => {
                item1.children.forEach((item2) => {
                    item2.children.forEach((item3) => {
                        arr.push(item3.id)
                    })
                })
            })
            this.checkedList = arr
            // console.log(this.checkedList)
        },
        async handleOpenDialog() {
            this.loadingTree = true
            const {
                data: resData
            } = await this.$http.get('rights/tree')
            this.loadingTree = false
            const {
                data
            } = resData
            this.treedata = data
        },
        async handleClose(role, rightId) {
            // console.log(role)
            const {
                data: resData
            } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
            const {
                data,
                meta: {
                    status,
                    msg
                }
            } = resData
            if (status === 200) {
                this.$message.success(msg)
                role.children = data
            } else {
                this.$message.error(msg)
            }
        },
        async loadData() {
            this.loading = true
            const {
                data: resData
            } = await this.$http.get('roles')
            const {
                data,
                meta: {
                    status,
                    msg
                }
            } = resData
            this.loading = false
            if (status === 200) {
                this.list = data
            } else {
                this.$message.error(msg)
            }
        }
    }
}
</script>

<style>
.row-add {
    margin-top: 10px;
    margin-bottom: 10px;
}
</style>
