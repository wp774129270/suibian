<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <!-- 搜索与添加 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList"> <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button> </el-input>
        </el-col>
        <el-col :span="4"><el-button type="primary" @click="dialogVisible = true">添加用户</el-button></el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userLIst" border stripe>
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template v-slot="scope">
            <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949" @change="userStateChanged(scope.row)"> </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scoped">
            <!-- v-slot="scoped" -->
            <div class="flex">
              <!-- 修改按钮 -->
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEdit(scoped.row.id)"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="removUserById(scoped.row.id)"></el-button>
              <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scoped.row)"></el-button>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[5, 7, 10, 20]" :page-size="queryInfo.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
      <!-- 用户对话框的片段 -->
    </el-card>
    <el-dialog title="添加用户  " :visible.sync="dialogVisible" width="30%" @close="addDialog">
      <!-- 内容主题区域 -->
      <el-form :model="ruleForm" :rules="rules" ref="ruleFormRef" label-width="70px">
        <el-form-item label="用户名" prop="name">
          <el-input v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="ruleForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ruleForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="ruleForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户的对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialog" width="50%" @close="editDialogClosed">
      <el-form :model="editFrom" :rules="rules" ref="ruleFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editFrom.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editFrom.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editFrom.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="edituserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色的对话框 -->
    <el-dialog title="分配角色" :visible.sync="setRoleDialogVisible" width="50%" @close="setRoleDialogClosed">
      <div>
        <p>当前的用户:{{ userInfo.username }}</p>
        <p>当前的角色:{{ userInfo.role_name }}</p>
        <p>
          分配新角色:<el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option v-for="item in rolesList" :key="item.id" :label="item.roleName" :value="item.id"> </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="savaRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 验证邮箱的规则
    var checkEmail = (rule, value, cd) => {
      // 验证邮箱的正则表达
      const regEmail = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z]{2,5}$/

      if (regEmail.test(value)) {
        // 合法邮箱
        return cd()
      }
      cd(new Error('请输入合法邮箱'))
    }
    // 验证手机号的规则
    var checkMobile = (rule, value, cd) => {
      // 验证手机号的正则表达
      const regMobile = /^1[3456789]\d{9}$/

      if (regMobile.test(value)) {
        // 合法手机号
        return cd()
      }
      cd(new Error('请输入合法手机号'))
    }
    return {
      // 控制修改用户对话框的显示隐藏
      editDialog: false,
      // 查询到的用户信息对象
      editFrom: {},
      // 获取用户列表的参数对象
      queryInfo: {
        query: '',
        // 当前的页数
        pagenum: 1,
        pagesize: 10,
      },
      userLIst: [],
      total: 0,
      // 控制添加用户对话框的显示与隐藏
      dialogVisible: false,
      // 添加用户表单数据
      ruleForm: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      // 添加用户表单验证规则对象
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '请用户名的长度在3-10之间', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '请用户名的长度在6-15之间', trigger: 'blur' },
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {
            validator: checkEmail,
            trigger: 'blur',
          },
        ],
        mobile: [
          { required: true, message: '请输入手机', trigger: 'blur' },
          {
            validator: checkMobile,
            trigger: 'blur',
          },
        ],
      },
      // 控制分配角色对话框的显示与隐藏
      setRoleDialogVisible: false,
      // 需要被分配角色的用户信息
      userInfo: {},
      // 所有角色的数据列表
      rolesList: [],
      //  已选中的角色Id值
      selectedRoleId: '',
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$messag.error('获取用户列表失败')
      this.userLIst = res.data.users
      this.total = res.data.total
      console.log(res)
    },
    // 监听pagesize改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听handleCurrentChange页码值改变的事件
    handleCurrentChange(newPage) {
      console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    //
    async userStateChanged(userInfo) {
      console.log(userInfo)
      const { data: res } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('更新用户状态失败')
      }
      this.$message.success('更新状态成功')
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then((_) => {
          done()
        })
        .catch((_) => {})
    },
    // 监听添加用户对话框的关闭事件
    addDialog() {
      this.$refs.ruleFormRef.resetFields()
    },
    // 点击按钮添加新用户
    addUser() {
      this.$refs.ruleFormRef.validate(async (valid) => {
        if (!valid) return
        // 可以发送添加用户的网络请求
        const { data: res } = await this.$http.post('users', this.ruleForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加用户失败')
        }
        // 隐藏添加用户的对话框
        this.dialogVisible = false

        // 重新获取列表数据
        this.getUserList()
        return this.$message.success('用户添加成功了~')
      })
    },
    // 展示编辑用户的对话框
    async showEdit(id) {
      // console.log(id);
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询失败')
      }
      this.editFrom = res.data
      this.editDialog = true
    },
    editDialogClosed() {
      this.$refs.ruleFormRef.resetFields()
    },
    // 修改用户信息并提交
    edituserInfo() {
      this.$refs.ruleFormRef.validate(async (valid) => {
        if (!valid) return
        // 通过了发起用户修改信息的数据请求
        const { data: res } = await this.$http.put('users/' + this.editFrom.id, { email: this.editFrom.email, mobile: this.editFrom.mobile })
        if (res.meta.status !== 200) {
          return this.$message.error('更新用户信息失败')
        }
        // 关闭对话框
        this.editDialog = false
        // 刷新数据列表
        this.getUserList()
        // 提示修改成功
        this.$message.success('更新用户信息成功')
      })
    },
    // 根据id删除对应的用户信息
    async removUserById(id) {
      console.log(id)
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch((err) => err)
      if (confirmResult !== 'confirm') return this.$message.info('已取消删除')
      const { data: res } = await this.$http.delete('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除用户失败')
      }
      this.$message.success('删除成功')
      this.getUserList()
    },
    // 展示分配角色的对话框
    async setRole(userino) {
      this.userInfo = userino
      // 在展示对话框之前，获取所有角色的列表
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败！')
      }
      this.rolesList = res.data
      this.setRoleDialogVisible = true
    },
    // 点击按钮分配角色
    async savaRoleInfo() {
      if (!this.selectedRoleId) {
        return this.$message.error('请选择要分配的角色!')
      }
      const { data: res } = await this.$http.put(`users/${this.userInfo.id}/role`, { rid: this.selectedRoleId })
      if (res.meta.status !== 200) {
        return this.$message.error('更新角色失败!')
      }
      this.$message.success('更新成功')
      this.getUserList()
      this.setRoleDialogVisible = false
    },
    // 监听分配角色对话框的关闭事件
    setRoleDialogClosed(){
      this.selectedRoleId = ''
      this.userInfo = {}
    }
  },
}
</script>

<style lang="less" scoped>
.flex {
  display: flex;
  justify-content: space-around;
}
.el-table {
  line-height: 15px;
}
.el-row {
  line-height: 10px;
}
.text {
  font-size: 14px;
}

.item {
  padding: 18px 0;
}

.box-card {
  margin-top: 25px;
  //   padding: 50px;
  //   width: 480px;
  font-size: 16px;
  box-shadow: 0 1px 5px rgb(0, 0, 0, 0.2);
}
</style>
