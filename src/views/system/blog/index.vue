<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="文章标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入文章标题"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="文章简述" prop="description">
        <el-input
          v-model="queryParams.description"
          placeholder="请输入文章简述"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="发表人" prop="author">
        <el-input
          v-model="queryParams.author"
          placeholder="请输入发表人"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="发表时间" prop="time">
        <el-date-picker clearable
          v-model="queryParams.time"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择发表时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['system:blog:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:blog:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:blog:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['system:blog:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="blogList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="文章ID" align="center" prop="id" />
      <el-table-column label="文章标题" align="center" prop="title" />
      <el-table-column label="文章简述" align="center" prop="description" />
      <el-table-column label="发表人" align="center" prop="author" />
      <el-table-column label="发表时间" align="center" prop="time" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.time, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:blog:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['system:blog:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改博客文章对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="blogRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="文章标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入文章标题" />
        </el-form-item>
        <el-form-item label="文章简述" prop="description">
          <el-input v-model="form.description" placeholder="请输入文章简述" />
        </el-form-item>
        <el-form-item label="发表人" prop="author">
          <el-input v-model="form.author" placeholder="请输入发表人" />
        </el-form-item>
        <el-form-item label="发表时间" prop="time">
          <el-date-picker clearable
            v-model="form.time"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择发表时间">
          </el-date-picker>
        </el-form-item>
        <el-divider content-position="center">博客文章详情信息</el-divider>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="Plus" @click="handleAddBlogDetail">添加</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="Delete" @click="handleDeleteBlogDetail">删除</el-button>
          </el-col>
        </el-row>
        <el-table :data="blogDetailList" :row-class-name="rowBlogDetailIndex" @selection-change="handleBlogDetailSelectionChange" ref="blogDetail">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="序号" align="center" prop="index" width="50"/>
          <el-table-column label="推荐教师ID" prop="teacherId" width="150">
            <template #default="scope">
              <el-input v-model="scope.row.teacherId" placeholder="请输入推荐教师ID" />
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Blog">
import { listBlog, getBlog, delBlog, addBlog, updateBlog } from "@/api/system/blog";

const { proxy } = getCurrentInstance();

const blogList = ref([]);
const blogDetailList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const checkedBlogDetail = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    title: null,
    description: null,
    author: null,
    time: null
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询博客文章列表 */
function getList() {
  loading.value = true;
  listBlog(queryParams.value).then(response => {
    blogList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    id: null,
    title: null,
    description: null,
    author: null,
    time: null
  };
  blogDetailList.value = [];
  proxy.resetForm("blogRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加博客文章";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getBlog(_id).then(response => {
    form.value = response.data;
    blogDetailList.value = response.data.blogDetailList;
    open.value = true;
    title.value = "修改博客文章";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["blogRef"].validate(valid => {
    if (valid) {
      form.value.blogDetailList = blogDetailList.value;
      if (form.value.id != null) {
        updateBlog(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addBlog(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除博客文章编号为"' + _ids + '"的数据项？').then(function() {
    return delBlog(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 博客文章详情序号 */
function rowBlogDetailIndex({ row, rowIndex }) {
  row.index = rowIndex + 1;
}

/** 博客文章详情添加按钮操作 */
function handleAddBlogDetail() {
  let obj = {};
  obj.content = "";
  obj.teacherId = "";
  obj.teacherComment = "";
  blogDetailList.value.push(obj);
}

/** 博客文章详情删除按钮操作 */
function handleDeleteBlogDetail() {
  if (checkedBlogDetail.value.length == 0) {
    proxy.$modal.msgError("请先选择要删除的博客文章详情数据");
  } else {
    const blogDetails = blogDetailList.value;
    const checkedBlogDetails = checkedBlogDetail.value;
    blogDetailList.value = blogDetails.filter(function(item) {
      return checkedBlogDetails.indexOf(item.index) == -1
    });
  }
}

/** 复选框选中数据 */
function handleBlogDetailSelectionChange(selection) {
  checkedBlogDetail.value = selection.map(item => item.index)
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('system/blog/export', {
    ...queryParams.value
  }, `blog_${new Date().getTime()}.xlsx`)
}

getList();
</script>
