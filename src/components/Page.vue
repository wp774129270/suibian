<template>
  <div class="block">
    <span class="demonstration">完整功能</span>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage4" :page-sizes="[1, 2, 5, 10]" :page-size="100" layout="total, sizes, prev, pager, next, jumper" :total="300"> </el-pagination>
    <el-backtop target=".page-component__scroll .el-scrollbar__wrap"></el-backtop>
  </div>
</template>

<script>
export default {}
</script>

<style scoped>
.block {
  position: absolute;
  bottom: 10px;
  right: 20px;
}
</style>
