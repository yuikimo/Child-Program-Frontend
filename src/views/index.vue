<template>
  <div class="app-container home">
    <h1>
      <img style="height: 20px;margin-right: 10px" src="/favicon.png" alt=""/>
      <b>少儿编程俱乐部管理系统</b>
    </h1>
    <div>您好，欢迎来到少儿编程俱乐部，今天想要做点什么呢？</div>
    <div class="dashboard">
      <el-card style="max-width: 480px" v-for="item in dashboard">
        <template #header>
          <div class="card-header">
            <span>{{ item.name }}</span>
          </div>
        </template>
        <div style="display: flex;justify-content: space-between">
          <el-statistic title="截至现在" :value="item.value"/>
          <el-progress type="dashboard" :width="80" :percentage="item.percentage" :status="item.status">
            <template #default="{ percentage }">
              <span class="percentage-value"></span>
              <span class="percentage-label">{{ item.name }}</span>
            </template>
          </el-progress>
        </div>
      </el-card>
    </div>
    <div class="function-list">
      <div class="function-card" @click="toClient(nav.link)" v-for="nav in navigation">
        <img src="@/assets/index/bg.png" alt="背景图"/>
        <div class="function-text">
          <div style="font-weight: bold">{{ nav.title }}</div>
          <div style="font-size: 13px">{{ nav.desc }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup name="Index">
import {listUser} from "@/api/system/user.js";
import {listOrder} from "@/api/system/order.js";
import {listEvent} from "@/api/system/event.js";
import {listTeacher} from "@/api/system/teacher.js";

const dashboard = ref([
  {name: '用户数量', value: 12, percentage: 80, status: ''},
  {name: '订单数量', value: 30, percentage: 60, status: 'warning'},
  {name: '活动数量', value: 20, percentage: 90, status: 'exception'},
  {name: '教师数量', value: 3, percentage: 70, status: 'success'}
])

const navigation = [
  {title: '前往首页', desc: '首页是我们公司的所有内容的介绍', link: '/'},
  {title: '购买课程', desc: '首页是我们公司的所有内容的介绍', link: '/course/list'},
  {title: '充值会员', desc: '首页是我们公司的所有内容的介绍', link: '/'},
  {title: '联系我们', desc: '首页是我们公司的所有内容的介绍', link: '/'},
  {title: '公司介绍', desc: '首页是我们公司的所有内容的介绍', link: '/'},
  {title: '最新活动', desc: '首页是我们公司的所有内容的介绍', link: '/'}
]

function toClient(link) {
  window.open(import.meta.env.VITE_CLIENT_URL + link, '_blank');
}

onMounted(() => {
  listUser().then(data => dashboard.value[0].value = data.total)
  listOrder().then(data => dashboard.value[1].value = data.total)
  listEvent().then(data => dashboard.value[2].value = data.total)
  listTeacher().then(data => dashboard.value[1].value = data.total)
})
</script>

<style scoped lang="scss">
.home {
  .dashboard {
    margin-top: 30px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }

  .function-list {
    margin-top: 30px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;

    .function-card {
      width: 100%;
      border-radius: 10px;
      overflow: hidden;
      aspect-ratio: 16/9;
      position: relative;
      background-color: black;
      transition: all .3s ease-in-out;

      &:hover {
        scale: 1.03;
        cursor: pointer;
      }

      .function-text {
        bottom: 10px;
        left: 10px;
        position: absolute;
        color: white;
        text-shadow: 0 0 10px #272727;
      }

      img {
        width: 100%;
        height: 100%;
        opacity: 0.7;
        object-fit: cover;
      }
    }
  }
}
</style>

