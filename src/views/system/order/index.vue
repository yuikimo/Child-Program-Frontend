<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="用户ID" prop="uid">
        <el-input
          v-model="queryParams.uid"
          placeholder="请输入用户ID"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="下单时间" prop="time">
        <el-date-picker clearable
          v-model="queryParams.time"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择下单时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="合计金额" prop="price">
        <el-input
          v-model="queryParams.price"
          placeholder="请输入合计金额"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="收件人" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入收件人"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="收件公司" prop="company">
        <el-input
          v-model="queryParams.company"
          placeholder="请输入收件公司"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="国家" prop="country">
        <el-input
          v-model="queryParams.country"
          placeholder="请输入国家"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="城市" prop="city">
        <el-input
          v-model="queryParams.city"
          placeholder="请输入城市"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="街道地址1" prop="street1">
        <el-input
          v-model="queryParams.street1"
          placeholder="请输入街道地址1"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="街道地址2" prop="street2">
        <el-input
          v-model="queryParams.street2"
          placeholder="请输入街道地址2"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="邮政编码" prop="postal">
        <el-input
          v-model="queryParams.postal"
          placeholder="请输入邮政编码"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input
          v-model="queryParams.phone"
          placeholder="请输入手机号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="电子邮件" prop="email">
        <el-input
          v-model="queryParams.email"
          placeholder="请输入电子邮件"
          clearable
          @keyup.enter="handleQuery"
        />
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
          v-hasPermi="['system:order:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:order:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:order:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['system:order:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="orderList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="订单ID" align="center" prop="id" />
      <el-table-column label="用户ID" align="center" prop="uid" />
      <el-table-column label="下单时间" align="center" prop="time" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.time, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="合计金额" align="center" prop="price" />
      <el-table-column label="收件人" align="center" prop="name" />
      <el-table-column label="收件公司" align="center" prop="company" />
      <el-table-column label="国家" align="center" prop="country" />
      <el-table-column label="城市" align="center" prop="city" />
      <el-table-column label="街道地址1" align="center" prop="street1" />
      <el-table-column label="街道地址2" align="center" prop="street2" />
      <el-table-column label="邮政编码" align="center" prop="postal" />
      <el-table-column label="手机号" align="center" prop="phone" />
      <el-table-column label="电子邮件" align="center" prop="email" />
      <el-table-column label="订单备注" align="center" prop="note" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:order:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['system:order:remove']">删除</el-button>
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

    <!-- 添加或修改订单列表对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="orderRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户ID" prop="uid">
          <el-input v-model="form.uid" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="下单时间" prop="time">
          <el-date-picker clearable
            v-model="form.time"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择下单时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="合计金额" prop="price">
          <el-input v-model="form.price" placeholder="请输入合计金额" />
        </el-form-item>
        <el-form-item label="收件人" prop="name">
          <el-input v-model="form.name" placeholder="请输入收件人" />
        </el-form-item>
        <el-form-item label="收件公司" prop="company">
          <el-input v-model="form.company" placeholder="请输入收件公司" />
        </el-form-item>
        <el-form-item label="国家" prop="country">
          <el-input v-model="form.country" placeholder="请输入国家" />
        </el-form-item>
        <el-form-item label="城市" prop="city">
          <el-input v-model="form.city" placeholder="请输入城市" />
        </el-form-item>
        <el-form-item label="街道地址1" prop="street1">
          <el-input v-model="form.street1" placeholder="请输入街道地址1" />
        </el-form-item>
        <el-form-item label="街道地址2" prop="street2">
          <el-input v-model="form.street2" placeholder="请输入街道地址2" />
        </el-form-item>
        <el-form-item label="邮政编码" prop="postal">
          <el-input v-model="form.postal" placeholder="请输入邮政编码" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="电子邮件" prop="email">
          <el-input v-model="form.email" placeholder="请输入电子邮件" />
        </el-form-item>
        <el-form-item label="订单备注" prop="note">
          <el-input v-model="form.note" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-divider content-position="center">订单商品列表信息</el-divider>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="Plus" @click="handleAddOrderItem">添加</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="Delete" @click="handleDeleteOrderItem">删除</el-button>
          </el-col>
        </el-row>
        <el-table :data="orderItemList" :row-class-name="rowOrderItemIndex" @selection-change="handleOrderItemSelectionChange" ref="orderItem">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="序号" align="center" prop="index" width="50"/>
          <el-table-column label="订单商品名称" prop="title" width="150">
            <template #default="scope">
              <el-input v-model="scope.row.title" placeholder="请输入订单商品名称" />
            </template>
          </el-table-column>
          <el-table-column label="订单商品价格" prop="price" width="150">
            <template #default="scope">
              <el-input v-model="scope.row.price" placeholder="请输入订单商品价格" />
            </template>
          </el-table-column>
          <el-table-column label="订单商品数量" prop="count" width="150">
            <template #default="scope">
              <el-input v-model="scope.row.count" placeholder="请输入订单商品数量" />
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

<script setup name="Order">
import { listOrder, getOrder, delOrder, addOrder, updateOrder } from "@/api/system/order";

const { proxy } = getCurrentInstance();

const orderList = ref([]);
const orderItemList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const checkedOrderItem = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    uid: null,
    time: null,
    price: null,
    name: null,
    company: null,
    country: null,
    city: null,
    street1: null,
    street2: null,
    postal: null,
    phone: null,
    email: null,
    note: null
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询订单列表列表 */
function getList() {
  loading.value = true;
  listOrder(queryParams.value).then(response => {
    orderList.value = response.rows;
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
    uid: null,
    time: null,
    price: null,
    name: null,
    company: null,
    country: null,
    city: null,
    street1: null,
    street2: null,
    postal: null,
    phone: null,
    email: null,
    note: null
  };
  orderItemList.value = [];
  proxy.resetForm("orderRef");
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
  title.value = "添加订单列表";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getOrder(_id).then(response => {
    form.value = response.data;
    orderItemList.value = response.data.orderItemList;
    open.value = true;
    title.value = "修改订单列表";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["orderRef"].validate(valid => {
    if (valid) {
      form.value.orderItemList = orderItemList.value;
      if (form.value.id != null) {
        updateOrder(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addOrder(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除订单列表编号为"' + _ids + '"的数据项？').then(function() {
    return delOrder(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 订单商品列表序号 */
function rowOrderItemIndex({ row, rowIndex }) {
  row.index = rowIndex + 1;
}

/** 订单商品列表添加按钮操作 */
function handleAddOrderItem() {
  let obj = {};
  obj.title = "";
  obj.price = "";
  obj.count = "";
  orderItemList.value.push(obj);
}

/** 订单商品列表删除按钮操作 */
function handleDeleteOrderItem() {
  if (checkedOrderItem.value.length == 0) {
    proxy.$modal.msgError("请先选择要删除的订单商品列表数据");
  } else {
    const orderItems = orderItemList.value;
    const checkedOrderItems = checkedOrderItem.value;
    orderItemList.value = orderItems.filter(function(item) {
      return checkedOrderItems.indexOf(item.index) == -1
    });
  }
}

/** 复选框选中数据 */
function handleOrderItemSelectionChange(selection) {
  checkedOrderItem.value = selection.map(item => item.index)
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('system/order/export', {
    ...queryParams.value
  }, `order_${new Date().getTime()}.xlsx`)
}

getList();
</script>
