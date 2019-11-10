<template>
<el-card class="box-card">
  <!-- 面包屑 -->
  <cus-Breadcrumb level1='商品管理' level2='商品列表'></cus-Breadcrumb>
  <!-- 提示框 -->
  <el-alert class="alert" title="添加商品信息" type="info" center :closable="false" show-icon></el-alert>
  <!-- 步骤条 -->
  <el-steps class="steps" :space="400" 
  align-center :active="active*1" finish-status="success">
    <el-step title="基本信息"></el-step>
    <el-step title="商品参数"></el-step>
    <el-step title="商品属性"></el-step>
    <el-step title="商品图片"></el-step>
    <el-step title="商品内容"></el-step>
  </el-steps>
  <!-- tabs选项卡 -->
  <!-- element-ui已经封装好了，当切换时,v-model的值自动切换为el-tabs-pane的name对应的值. -->
  <el-form class="form" label-position="top" :model="form" label-width="80px">
    <el-tabs @tab-click="handleTabClick" 
    class="tabs" v-model="active" tab-position="left">

      <el-tab-pane name="1" label="基本信息">
        <el-form-item label="商品名称">
          <el-input v-model="form.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格">
          <el-input v-model="form.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品重量">
          <el-input v-model="form.goods_weight"></el-input>
        </el-form-item>
        <el-form-item label="商品数量">
          <el-input v-model="form.goods_number"></el-input>
        </el-form-item>
        <el-form-item label="商品分类">
          <!-- 级联选择器 -->
          <el-cascader
            clearable
            :options="options"
            :props="defaultProps"
            v-model="selectedOptions"
            expand-trigger="hover"
            @change="handleChange">
          </el-cascader>
        </el-form-item>
      </el-tab-pane>

      <el-tab-pane name="2" label="商品参数">
        <el-form-item v-for="item in dynamicsParams" :key="item.attr_id" :label="item.attr_name">
        <el-checkbox-group v-model="item.attr_vals">
          <el-checkbox border v-for="val in item.attr_vals" :key="val" :label="val"></el-checkbox>
        </el-checkbox-group>
        </el-form-item>
      </el-tab-pane>
      <el-tab-pane name="3" label="商品属性">
        <el-form-item v-for="item in staticParams" :key="item.attr_id" :label="item.attr_name">
          <el-input v-model="item.attr_vals"></el-input>
        </el-form-item>
      </el-tab-pane>
      <el-tab-pane name="4" label="商品图片">
        <!-- action
          必须设置全路径
          必须设置token -->
        <el-upload
          action="http://127.0.0.1:8888/api/private/v1/upload"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
          :headers="tokenHeader"
          list-type="picture">
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-tab-pane>
      <el-tab-pane name="5" label="商品内容">
        <el-button @click="handleAdd">添加商品</el-button>
        <quillEditor class="editor" v-model="form.goodsintroduce"></quillEditor>
      </el-tab-pane>
    </el-tabs>
  </el-form>
</el-card>
</template>

<script>
import {quillEditor} from 'vue-quill-editor'

// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
export default {
  components: {
    quillEditor
  },
  data () {
    return {
      active: '1',
      form: {
        goods_name: '',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        // 分类id
        goods_cat: '',
        pics: [],
        goods_introduce: '',
        attrs: ''
      },
      // 层级下拉框的数据源
      options: [],
      // 层级下拉框的数据源配置
      defaultProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 绑定到层级下拉框上的数据
      selectedOptions: [],
      checkList: [],
      dynamicsParams: [],
      staticParams: [],
      tokenHeader: {
        'Authorization': sessionStorage.getItem('token')
      }
    }
  },
  created () {
    this.loadOptions()
  },
  methods: {
    async handleAdd () {
      this.form.goods_cat = this.selectedOptions.join(',')
      const dy = this.dynamicsParams
      const st = this.staticParams
      const arr1 = dy.map((item) => {
        item.attr_vals = item.attr_vals.join(',')
        return {attr_id: item.attr_id, attr_value: item.attr_vals}
      })
      const arr2 = st.map((item) => {
        item.attr_vals = item.attr_vals.join(',')
        return {attr_id: item.attr_id, attr_value: item.attr_vals}
      })
      this.form.attrs = [...arr1, ...arr2]
      console.log(this.form.attrs)
      const {data: {meta: {status, msg}}} = await this.$http.post('goods', this.form)
      if (status === 201) {
        this.$message.success(msg)
        this.$router.push({
          name: 'goodslist'
        })
      } else {
        this.$message.error(msg)
      }
    },
    handleRemove (file, fileList) {
      const index = this.form.pics.findIndex((item) => {
        return item.pic === file.response.data.tem_path
      })
      this.form.pics.splice(index, 1)
      // console.log(this.form)
    },
    handleSuccess (response, file, fileList) {
      const { meta } = response

      if (meta.status === 200) {
        this.$message.success('图片上传成功')
        this.form.pics.push({
          pic: response.data.tmp_path
        })
      } else {
        this.$message.error(meta.msg)
      }
    },
    async handleTabClick () {
      if (this.active === '2' || this.active === '3') {
        if (this.selectedOptions.length !== 3) {
          this.$message.error('请选择商品的三级分类')
          return
        }
      }
      // console.log(this.active)
      const sel = this.active === '2' ? 'many' : 'only'
      // console.log(sel)
      const { data: resData } = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=${sel}`)
      if (this.active === '2') {
        this.dynamicsParams = resData.data
        // console.log('动态参数')
        // console.log(this.dynamicsParams)
        this.dynamicsParams.forEach((item) => {
          item.attr_vals = item.attr_vals.trim().length === 0 ? [] : item.attr_vals.trim().split(',')
        })
      }
      if (this.active === '3') {
        // console.log('静态参数')
        this.staticParams = resData.data
        // console.log(this.staticParams)
      }
    },
    handleChange () {
      if (this.selectedOptions.length !== 3) {
        this.$message.warning('商品只能添加到三级分类')
        this.selectedOptions.length = 0
      }
    },
    async loadOptions () {
      const { data: resData } = await this.$http.get(`categories?type=3`)

      this.options = resData.data
      // console.log(this.options)
    }
  }
}
</script>

<style scoped>
.alert{
  margin-top: 26px;
  margin-bottom: 10px;
}
.form{
  height: 400px;
  overflow: auto;
}
.editor{
  min-height: 400px;
}
</style>
