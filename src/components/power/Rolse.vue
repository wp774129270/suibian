<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->

      <el-table :data="rolelist" border stripe>
        <el-table-column label="" type="expand" v-slot="scope">
          <el-row v-for="(item1, i1) in scope.row.children" :key="item1.id" :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'cel']">
            <!-- 渲染一级权限 -->
            <el-col :span="5"
              ><el-tag>{{ item1.authName }}</el-tag> <i class="el-icon-caret-right"></i
            ></el-col>

            <!-- 渲染二级和三级级权限 -->
            <el-col :span="19">
              <!--  通过for循环嵌套渲染-->
              <el-row v-for="(item2, i2) in item1.children" :key="item2.id" :class="[i2 === 0 ? '' : 'bdtop', 'cel']">
                <el-col :span="6"
                  ><el-tag type="success">{{ item2.authName }}</el-tag
                  ><i class="el-icon-caret-right"></i
                ></el-col>
                <el-col :span="18">
                  <el-tag v-for="(item3, i3) in item2.children" :key="item3.id" type="warning" :class="[i3 === 0 ? '' : 'bdtop']" closable @close="removeRightById(scope.row, item3.id)">{{ item3.authName }}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <!-- <pre>
           {{scope.row}}
         </pre> -->
        </el-table-column>
        <el-table-column label="" type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px" v-slot="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="rolesdelete(scope.row.id)">删除</el-button>
          <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>
        </el-table-column>
      </el-table>
      <!-- 添加角色对话框 -->
      <el-dialog title="添加角色" :visible.sync="addDialogVisible" @close="addDislogClosed">
        <el-form :model="addRolesForm" ref="addRolesForm" label-width="100px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addRolesForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addRolesForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRolesUser">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑对话框 -->
      <el-dialog title="修改角色" :visible.sync="editDialogVisible" width="30%">
        <el-form :model="editRolesForm" ref="editFormRef" label-width="100px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editRolesForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="editRolesForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editFormInfo">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
    <!-- 分配权限的对话框 -->
    <el-dialog title="分配权限" :visible.sync="setRightDiaVisible" width="50%" @close="setRightDialogClosed">
      <!-- 树形控件 -->
      <el-tree :data="rightslist" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDiaVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Roles',

  data() {
    return {
      // 所有角色列表数据
      rolelist: [],
      addDialogVisible: false,
      // 添加角色对话框的显示和隐藏
      addDialogVisible: false,
      addRolesForm: {
        roleName: '',
        roleDesc: '',
      },

      // 编辑对话框的显示和隐藏
      editDialogVisible: false,
      editRolesForm: {},
      // 控制分配权限对话框的显示与隐藏
      setRightDiaVisible: false,
      // 所有权限的数据
      rightslist: [],
      // 树形控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children',
      },
      // 默认选中的节点Id值数组
      defKeys: [],
      // 当前即将分配权限的角色id
      roleId: '',
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.rolelist = res.data
      console.log(this.rolelist)
    },
    addDislogClosed() {
      this.$refs.addRolesForm.resetFields()
    },
    // 添加角色
    addRolesUser() {
      this.$refs.addRolesForm.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post('roles', this.addRolesForm)
        console.log(res)
        if (res.meta.status !== 201) {
          return this.$message.error('添加角色失败!')
        }
        this.$message.success('添加角色成功!')
        this.getRolesList()
        this.addDialogVisible = false
      })
      // console.log(this.addRolesForm)
    },
    // 清空添加角色对话框
    addDislogClosed() {
      this.$refs.addRolesForm.resetFields()
    },

    // 得到修改用户的信息
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询角色失败!')
      }
      this.editRolesForm = res.data
      console.log(this.editRolesForm)
      this.editDialogVisible = true
    },
    editFormInfo() {
      this.$refs.editFormRef.validate((valid) => {
        if (!valid) return
        this.$http
          .put('roles/' + this.editRolesForm.roleId, {
            roleName: this.editRolesForm.roleName,
            roleDesc: this.editRolesForm.roleDesc,
          })
          .then((res) => {
            if (res.data.meta.status !== 200) {
              return this.$message.error('修改角色失败!')
            }
            this.$message.success('修改角色成功!')
            this.getRolesList()
          })
        this.editDialogVisible = false
      })
    },
    // 删除角色
    async rolesdelete(id) {
      const confirmRusult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '删除角色', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch((err) => err)
      // 没有使用await
      if (confirmRusult !== 'confirm') {
        return this.$message.info('已取消该删除操作')
      }
      this.$http.delete('roles/' + id).then((res) => {
        const { data: response } = res
        // console.log(response)
        if (response.meta.status !== 200) {
          return this.$message.error('该用户删除失败')
        }
        this.$message.success('该用户已经删除')
        this.getRolesList()
      })
    },

    // 得到修改用户的信息
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询角色失败!')
      }
      this.editRolesForm = res.data
      console.log(this.editRolesForm)
      this.editDialogVisible = true
    },
    editFormInfo() {
      this.$refs.editFormRef.validate((valid) => {
        if (!valid) return
        this.$http
          .put('roles/' + this.editRolesForm.roleId, {
            roleName: this.editRolesForm.roleName,
            roleDesc: this.editRolesForm.roleDesc,
          })
          .then((res) => {
            if (res.data.meta.status !== 200) {
              return this.$message.error('修改角色失败!')
            }
            this.$message.success('修改角色成功!')
            this.getRolesList()
          })
        this.editDialogVisible = false
      })
    },
    // 根据id删除
    async removeRightById(roles, id) {
      // 弹框提示是否删除
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch((err) => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除')
      }
      // console.log('确认了删除');
      const { data: res } = await this.$http.delete(`roles/${roles.id}/rights/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败')
      }
      roles.children = res.data
    },
    // 展示分配权限的对话框
    async showSetRightDialog(role) {
      this.roleId = role.id
      // 获取所有权限的数据
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限数据失败!')
      }
      // 获取到的权限数据保存到data中
      this.rightslist = res.data
      console.log(this.rightslist)
      // 递归获取三级节点的id
      this.getLeafKeys(role, this.defKeys)
      this.setRightDiaVisible = true
    },
    // 通过递归的形式获取角色项权限的id，并保存到数组中
    getLeafKeys(node, arr) {
      // 如果当前node节点不包含children属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach((item) => this.getLeafKeys(item, arr))
    },
    // 监听分配权限对话框的关闭事件
    setRightDialogClosed() {
      this.defKeys = []
    },
    // 点击为角色分配权限
    async allotRights() {
      const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
      console.log(keys)
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if(res.meta.status !==200){return this.$message.error('分配角色权限失败！')}
      this.$message.success('分配权限成功')  
      this.getRolesList()
      this.setRightDiaVisible = false
  },
  },
}
</script>

<style></style>
