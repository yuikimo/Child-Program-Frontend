import request from '@/utils/request'

// 查询会员等级列表
export function listVip(query) {
  return request({
    url: '/system/vip/list',
    method: 'get',
    params: query
  })
}

// 查询会员等级详细
export function getVip(id) {
  return request({
    url: '/system/vip/' + id,
    method: 'get'
  })
}

// 新增会员等级
export function addVip(data) {
  return request({
    url: '/system/vip',
    method: 'post',
    data: data
  })
}

// 修改会员等级
export function updateVip(data) {
  return request({
    url: '/system/vip',
    method: 'put',
    data: data
  })
}

// 删除会员等级
export function delVip(id) {
  return request({
    url: '/system/vip/' + id,
    method: 'delete'
  })
}
