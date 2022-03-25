<template>
  <div>
    <!-- 面包屑导航区域 -->
    <bread><template v-slot:manage>数据统计</template><template v-slot:params>数据报表</template></bread>
    <!-- 卡片视图区域 -->
    <el-card>
      <div id="main" style="width: 750px; height: 400px"></div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import _ from 'lodash'
export default {
  data() {
    return {
      // 需要合并的数据
      options: {
        title: {
          text: '用户来源',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3',
            },
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
      },
    }
  },
  created() {},
  //   dom元素初始化完毕了
  async mounted() {
    var myChart = echarts.init(document.getElementById('main'))
    const { data: res } = await this.$http('reports/type/1')
    if (res.meta.status !== 200) {
      return this.$message.error('获取折线图数据失败！')
    }
    // 准备数据的配置项
    const result =  _.merge(res.data, this.options)
    myChart.setOption(result)
  },
  methods: {},
}
</script>
<style lang="less" scoped></style>
