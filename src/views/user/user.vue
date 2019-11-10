<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索框 -->
    <el-row class="searchArea">
      <el-col :span="24">
           <el-input v-model="searchValue" class="searchInput" clearable placeholder="请输入内容">
            <el-button @click="handleSearch" slot="append" icon="el-icon-search"></el-button>
           </el-input>
        <el-button @click="addUserDialogFormVisible = true" type="success" plain>添加用户</el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
       <el-table
       v-loading="loading"
      :data="list"
      style="width: 100%">
      <!-- 序号 -->
      <el-table-column
      type="index"
      width="50">
    </el-table-column>

      <el-table-column
        prop="username"
        label="姓名"
        width="100">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        width="180">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话"
        width="200">
      </el-table-column>
       <el-table-column
        label="创建日期">
        <template slot-scope="scope">
            {{scope.row.create_time | fmtDate('YYYY-MM-DD')}}
        </template>
      </el-table-column>
       <el-table-column
         label="用户状态">
          <template slot-scope="scope">
            <!-- scope.row就是当前绑定的数据对象 -->
         <el-switch
         @change="handleSwitchChange(scope.row)"
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
      </template>
      </el-table-column>
        <el-table-column
        label="操作" width="300">
       <template slot-scope="scope">
        <el-button @click="handleEditUser(scope.row)" plain size="mini" type="primary" icon="el-icon-edit" circle></el-button>
        <el-button @click="handleDelete(scope.row.id)" plain size="mini" type="danger" icon="el-icon-delete" circle></el-button>
        <el-button @click="handleShowSetRole(scope.row)"  plain size="mini" type="success" icon="el-icon-check" circle></el-button>
      </template>

      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    <!-- 添加用户 -->
    <el-dialog @closed="handleClosed" title="添加用户" :visible.sync="addUserDialogFormVisible">
      <el-form
      ref="myform"
      :rules="formRules"
      label-width="100px"
      :model="formData">
        <el-form-item label="用户名" prop="username" >
          <el-input v-model="formData.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
         <el-input v-model="formData.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
         <el-input v-model="formData.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话">
         <el-input v-model="formData.mobile" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addUserDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
</el-dialog>
      <!-- 编辑用户 -->
       <el-dialog @closed="handleClosed" title="编辑用户" :visible.sync="editUserDialogFormVisible">
      <el-form
      ref="myform"
      :rules="formRules"
      label-width="100px"
      :model="formData">
        <el-form-item label="用户名" prop="username" >
          <el-input disabled v-model="formData.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
         <el-input v-model="formData.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话">
         <el-input v-model="formData.mobile" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editUserDialogFormVisible = false">取 消</el-button>
        <el-button @click="handleEdit" type="primary">确 定</el-button>
      </div>
</el-dialog>
    <!-- 添加用户对话框 -->
    <el-dialog @closed="handleClosed" title="添加用户" :visible.sync="addUserDialogFormVisible">
      <el-form
      ref="myform"
      :rules="formRules"
      label-width="100px"
      :model="formData">
        <el-form-item label="用户名" prop="username" >
          <el-input v-model="formData.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
         <el-input v-model="formData.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
         <el-input v-model="formData.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话">
         <el-input v-model="formData.mobile" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addUserDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
</el-dialog>
      <!-- 分配角色 -->
       <el-dialog title="分配角色" :visible.sync="setRoleDialogFormVisible">
      <el-form label-width="100px">
        <el-form-item label="用户名" prop="username" >
            {{currentUsername}}
        </el-form-item>
        <el-form-item label="角色">
            <el-select v-model="currentRoleId">
              <el-option disabled label="请选择" :value="-1">
              </el-option>
              <el-option
              v-for="item in roles"
                :key="item.id"
                :label="item.roleName"
                :value="item.id">
              </el-option>
            </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogFormVisible = false">取 消</el-button>
        <el-button @click="handleSetRole" type="primary">确 定</el-button>
      </div>
</el-dialog>

  </el-card>
</template>

<script>
export default {
  data () {
    return {
      // tableData: [{
      //   date: '2016-05-02',
      //   name: '王小虎',
      //   address: '上海市普陀区金沙江路 1518 弄'
      // }, {
      //   date: '2016-05-04',
      //   name: '王小虎',
      //   address: '上海市普陀区金沙江路 1517 弄'
      // }, {
      //   date: '2016-05-01',
      //   name: '王小虎',
      //   address: '上海市普陀区金沙江路 1519 弄'
      // }, {
      //   date: '2016-05-03',
      //   name: '王小虎',
      //   address: '上海市普陀区金沙江路 1516 弄'
      // }]
      list: [],
      loading: true,
      // 分页相关的属性
      pagenum: 1,
      pagesize: 2,
      total: 0,
      // 搜索参数
      searchValue: '',
      // 控制添加用户的对话框显示与隐藏
      addUserDialogFormVisible: false,
      // 绑定表单数据
      formData: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 表单验证规则
      formRules: {
        username: [{ required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 1, max: 5, message: '长度在 1 到 5 个字符', trigger: 'blur' }],
        password: [{ required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 1, max: 5, message: '长度在 1 到 5 个字符', trigger: 'blur' }]
      },
      editUserDialogFormVisible: false,
      setRoleDialogFormVisible: false,
      currentUsername: '',
      currentRoleId: -1,
      currentUserId: -1,
      roles: []
    }
  },
  created () {
    this.loadData()
  },
  methods: {
    // 分配角色
    async handleSetRole () {
      this.$http.defaults.headers.common['Authorization'] = sessionStorage.getItem('token')
      const res = await this.$http.put(`users/${this.currentUserId}/role`, {
        rid: this.currentRoleId
      })
      const data = res.data
      const { meta: { status, msg } } = data
      if (status === 200) {
        this.setRoleDialogFormVisible = false
        this.$message.success(msg)
        // 重置数据
        this.currentUsername = ''
        this.currentRoleId = -1
        this.currentUserId = -1
      } else {
        this.$message.error(msg)
      }
    },
    // 获取角色名称
    async handleShowSetRole (user) {
      this.currentUserId = user.id
      this.currentUsername = user.username
      this.setRoleDialogFormVisible = true
      this.$http.defaults.headers.common['Authorization'] = sessionStorage.getItem('token')
      const res = await this.$http.get('roles')
      this.roles = res.data.data

      const res1 = await this.$http.get(`users/${user.id}`)
      this.currentRoleId = res1.data.data.rid
    },
    // 关闭按钮
    handleClosed () {
      for (const key in this.formData) {
        this.formData[key] = ''
      }
    },
    // 处理编辑用户
    async handleEdit () {
      this.$http.defaults.headers.common['Authorization'] = sessionStorage.getItem('token')
      const res = await this.$http.put(`users/${this.formData.id}`, {
        mobile: this.formData.mobile,
        email: this.formData.email
      })
      const data = res.data
      const { meta: { status, msg } } = data
      if (status === 200) {
        this.$message.success(msg)
        this.editUserDialogFormVisible = false
        this.loadData()
        // for (const key in this.formData) {
        //   this.formData[key] = ''
        // }
      } else {
        this.$message.error(msg)
      }
    },
    // 显示编辑用户页面
    handleEditUser (user) {
      // 显示对话框
      this.editUserDialogFormVisible = true
      // 显示用户信息
      // this.formData = user
      this.formData.username = user.username
      this.formData.email = user.email
      this.formData.mobile = user.mobile
      this.formData.id = user.id
    },
    // 添加用户
    async addUser () {
      this.$refs.myform.validate(async (valid) => {
        if (!valid) {
          this.$message.error('请重新输入')
        }
        // 验证成功 添加新用户

        this.$http.defaults.headers.common['Authorization'] = sessionStorage.getItem('token')
        const res = await this.$http.post('users', this.formData)
        const data = res.data
        const { meta: { status, msg } } = data
        if (status === 201) {
        // 添加成功
        // 隐藏对话框
          this.addUserDialogFormVisible = false
          // 提示成功
          this.$message.success(msg)
          // 重新加载数据
          this.loadData()
          // 清空文本输入框的值
          // for (const key in this.formData) {
          //   this.formData[key] = ''
          // }
        } else {
          this.$message.error(msg)
        }
      })
    },
    // 删除用户
    handleDelete (id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(async () => {
          const res = await this.$http.delete(`users/${id}`)
          const data = res.data
          // console.log(data)
          const { meta: { status, msg } } = data

          if (status === 200) {
            // 删除成功 重新加载数据
            this.pagenum = 1
            this.loadData()
          } else {
            this.$message({
              type: 'success',
              message: msg
            })
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: 'catch--'
          })
        })
    },
    //  用户状态
    async handleSwitchChange (user) {
      this.$http.defaults.headers.common['Authorization'] = sessionStorage.getItem('token')
      // console.log(user)
      const res = await this.$http.put(
        `users/${user.id}/state/${user.mg_state}`
      )
      const data = res.data
      // console.log(data)
      const { meta: { status, msg } } = data
      if (status === 200) {
        this.$message.success(msg)
      } else {
        this.$message.error(msg)
      }
    },
    // 搜索
    handleSearch () {
      this.loadData()
    },
    // 分页
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.loadData()
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.pagenum = val
      this.loadData()
    },
    // 网络请求
    async loadData () {
      this.loading = true
      const res = await this.$http.get('users', {
        headers: {
          Authorization: window.sessionStorage.getItem('token')
        },
        params: {
          pagenum: this.pagenum,
          pagesize: this.pagesize,
          query: this.searchValue
        }
      })
      // console.log(res)
      this.loading = false
      const data = res.data
      const { meta: { msg, status } } = data
      if (status === 200) {
        const { data: { users, total } } = data
        this.list = users
        // 获取总共多少条数据
        this.total = total
      } else {
        this.$message.error(msg)
      }
    }
    // async loadData () {
    //   this.loading = true
    //   const res = await this.$http.get('users', {
    //     headers: {
    //       Authorization: window.sessionStorage.getItem('token')
    //     },
    //     params: {
    //       pagenum: 1,
    //       pagesize: 10
    //     }
    //   })
    //   // console.log(res)
    //   this.loading = false
    //   const data = res.data
    //   const { meta: { msg, status } } = data
    //   if (status === 200) {
    //     const { data: { users } } = data
    //     this.list = users
    //   } else {
    //     this.$message.error(msg)
    //   }
    // }
  }
}
</script>

<style scoped>
.box-card {
  height: 100%;
}
.searchArea {
  margin-top: 10px;
  margin-bottom: 10px;
}
.searchArea .searchInput {
  width: 350px;
}
</style>
